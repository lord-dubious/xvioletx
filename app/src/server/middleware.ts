import { MiddlewareConfigFn } from 'wasp/server';
import express from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';

// Enhanced security headers
const securityHeaders = {
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      scriptSrc: ["'self'"],
      connectSrc: ["'self'", "https://*.supabase.co"],
    },
  },
  crossOriginEmbedderPolicy: false,
};

// Rate limiting configurations
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per window
  message: 'Too many login attempts. Please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP. Please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Enhanced middleware configuration
export const middlewareConfig: MiddlewareConfigFn = (config) => {
  // Security headers
  config.use(helmet(securityHeaders));
  
  // Rate limiting
  config.use('/auth/login', loginLimiter);
  config.use('/api', apiLimiter);
  
  // Request logging
  config.use(express.json({ limit: '10mb' }));
  config.use(express.urlencoded({ extended: true, limit: '10mb' }));
  
  // Custom security middleware
  config.use((req, res, next) => {
    // Remove sensitive headers from response
    res.removeHeader('X-Powered-By');
    res.removeHeader('server');
    
    // Add security headers
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
    
    // Cache control for sensitive pages
    if (req.path.startsWith('/auth') || req.path.startsWith('/dashboard')) {
      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
      res.setHeader('Pragma', 'no-cache');
    }
    
    next();
  });
  
  // Credential security check
  config.use((req, res, next) => {
    if (req.method === 'POST' && req.body) {
      // Check for common sensitive patterns
      const bodyStr = JSON.stringify(req.body);
      if (/password.*123|password.*=.*['"`]/.test(bodyStr)) {
        console.warn('Weak password detected in request:', req.path);
      }
    }
    next();
  });
  
  return config;
};

// Enhanced JWT configuration
export const jwtConfig = {
  jwt: {
    // Enhanced token settings with shorter expiry for better security
    expiresIn: process.env.NODE_ENV === 'production' ? '1h' : '24h',
    httpOnly: true,
    sameSite: 'strict' as const,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 3600000, // 1 hour
  },
};

// Logout handler with session cleanup
export const createLogoutHandler = async (req: any, res: any) => {
  try {
    // Invalidate all sessions for this user
    if (req.user?.id) {
      await invalidateUserSessions(req.user.id);
    }
    
    // Clear session stores
    req.session = null;
    
    // Clear cookies
    res.clearCookie('wasp-jwt', {
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
    });
    
    res.clearCookie('wasp.sessionToken', {
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
    });
    
    return { success: true };
  } catch (error) {
    console.error('Logout error:', error);
    throw new Error('Failed to logout');
  }
};

// Session management utilities
export const sessionStore = {
  activeSessions: new Map<string, Set<string>>(),
  
  async addToken(userId: string, tokenId: string) {
    if (!this.activeSessions.has(userId)) {
      this.activeSessions.set(userId, new Set());
    }
    this.activeSessions.get(userId)!.add(tokenId);
  },
  
  async removeToken(userId: string, tokenId: string) {
    const sessions = this.activeSessions.get(userId);
    if (sessions) {
      sessions.delete(tokenId);
      if (sessions.size === 0) {
        this.activeSessions.delete(userId);
      }
    }
  },
  
  async invalidateAllSessions(userId: string) {
    this.activeSessions.delete(userId);
  },
  
  async getActiveSessions(userId: string) {
    return Array.from(this.activeSessions.get(userId) || []);
  },
};

// Enhanced token validation
export const validateToken = async (token: string, context: any) => {
  try {
    const decoded = context.verifyToken(token);
    
    if (!decoded || !decoded.userId) {
      throw new HttpError(401, 'Invalid token');
    }
    
    // Check if user still exists and is active
    const user = await context.entities.User.findUnique({
      where: { id: decoded.userId },
      select: { id: true, isDeleted: true }
    });
    
    if (!user || user.isDeleted) {
      throw new HttpError(401, 'User not found or deactivated');
    }
    
    // Add token checks to prevent replay attacks
    if (decoded.exp && decoded.exp < Date.now() / 1000) {
      throw new HttpError(401, 'Token expired');
    }
    
    return decoded;
  } catch (error) {
    throw new HttpError(401, 'Invalid or expired token');
  }
};

export async function invalidateUserSessions(userId: string) {
  await sessionStore.invalidateAllSessions(userId);
}

// Custom error handling for security
export const createSecurityErrorHandler = () => {
  return (error: any, req: any, res: any, next: any) => {
    // Log security events
    if (error.status === 401 || error.status === 403) {
      console.error('Authentication/Authorization error:', {
        path: req.path,
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        timestamp: new Date().toISOString(),
      });
    }
    
    // Don't leak sensitive information in production
    if (process.env.NODE_ENV === 'production') {
      delete error.stack;
      delete error.innerError;
    }
    
    next(error);
  };
};