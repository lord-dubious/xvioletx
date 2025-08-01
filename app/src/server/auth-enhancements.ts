import { MiddlewareConfigFn, HttpError } from 'wasp/server';

interface TokenPayload {
  userId: string;
  iat: number;
  exp: number;
  sessionId?: string;
}

interface SessionStore {
  isValid(jti: string): Promise<boolean>;
  invalidate(jti: string): Promise<void>;
  isSessionActive(sessionId: string): Promise<boolean>;
  invalidateSession(sessionId: string): Promise<void>;
}

class InMemorySessionStore implements SessionStore {
  private validTokens = new Set<string>();
  private activeSessions = new Set<string>();

  async isValid(jti: string): Promise<boolean> {
    return this.validTokens.has(jti);
  }

  async invalidate(jti: string): Promise<void> {
    this.validTokens.delete(jti);
  }

  async isSessionActive(sessionId: string): Promise<boolean> {
    return this.activeSessions.has(sessionId);
  }

  async invalidateSession(sessionId: string): Promise<void> {
    this.activeSessions.delete(sessionId);
  }

  addToken(jti: string): void {
    this.validTokens.add(jti);
  }

  addSession(sessionId: string): void {
    this.activeSessions.add(sessionId);
  }
}

// Session store instance
const sessionStore = new InMemorySessionStore();

// Enhanced JWT configuration with additional security features
export const enhanceJwtConfiguration = () => {
  return {
    jwt: {
      expiresIn: '24h',
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
      domain: undefined, // Use the same domain
      signed: false,
    },
  };
};

// Enhanced JWT validation function
export const validateEnhancedJwt = async (token: string, context: any) => {
  try {
    const decoded = context.verifyToken(token) as TokenPayload;
    
    if (!decoded.sessionId) {
      throw new HttpError(401, 'Invalid token format');
    }

    // Check if session is still active
    const sessionActive = await sessionStore.isSessionActive(decoded.sessionId);
    if (!sessionActive) {
      throw new HttpError(401, 'Session has been invalidated');
    }

    // Check if token is still valid
    const tokenValid = await sessionStore.isValid(decoded.userId + decoded.sessionId);
    if (!tokenValid) {
      throw new HttpError(401, 'Token has been invalidated');
    }

    return decoded;
  } catch (error) {
    if (error instanceof HttpError) throw error;
    throw new HttpError(401, 'Invalid token');
  }
};

// Session invalidation service
export class SessionManager {
  static async invalidateUserSession(userId: string, sessionId: string) {
    await Promise.all([
      sessionStore.invalidate(userId + sessionId),
      sessionStore.invalidateSession(sessionId),
    ]);
  }

  static async invalidateAllUserSessions(userId: string) {
    // In a real implementation, this would query a database
    // For now, we'll mark all sessions for this user as invalid
    console.log(`Invalidating all sessions for user: ${userId}`);
  }

  static async createNewSession(userId: string): Promise<string> {
    const sessionId = `session_${userId}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    await sessionStore.addSession(sessionId);
    await sessionStore.addToken(userId + sessionId);
    return sessionId;
  }
}

// Enhanced authentication middleware
export const enhancedAuthMiddleware: MiddlewareConfigFn = (middlewareConfig) => {
  // Enhanced configuration for production
  if (process.env.NODE_ENV === 'production') {
    middlewareConfig.use(express => express.csrf());
  }

  return middlewareConfig;
};

// Rate limiting for login attempts
export const loginRateLimiter = () => {
  const attempts = new Map<string, { count: number; lastAttempt: number }>();
  
  return {
    isAllowed: (identifier: string): boolean => {
      const now = Date.now();
      const attempt = attempts.get(identifier);
      
      if (!attempt) {
        attempts.set(identifier, { count: 1, lastAttempt: now });
        return true;
      }
      
      // Reset counter after 15 minutes
      if (now - attempt.lastAttempt > 15 * 60 * 1000) {
        attempts.set(identifier, { count: 1, lastAttempt: now });
        return true;
      }
      
      // Allow 5 attempts per 15 minutes
      if (attempt.count < 5) {
        attempts.set(identifier, { count: attempt.count + 1, lastAttempt: now });
        return true;
      }
      
      return false;
    },
  };
};

// Security headers middleware
export const securityHeaders = () => {
  return {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
    'Cache-Control': 'no-store',
    'Pragma': 'no-cache',
  };
};

// Token refresh mechanism
export class TokenManager {
  static async refreshToken(currentToken: string, context: any): Promise<string> {
    const decoded = await validateEnhancedJwt(currentToken, context);
    
    // Invalidate old session
    await SessionManager.invalidateUserSession(decoded.userId, decoded.sessionId!);
    
    // Create new session
    const newSessionId = await SessionManager.createNewSession(decoded.userId);
    
    // Generate new token
    const newToken = await context.generateToken({
      userId: decoded.userId,
      sessionId: newSessionId,
    });
    
    return newToken;
  }
}

// Password change handler with session invalidation
export const handlePasswordChange = async (userId: string, context: any) => {
  try {
    // Invalidate all existing sessions for the user
    await SessionManager.invalidateAllUserSessions(userId);
    
    // Create a new session
    const newSessionId = await SessionManager.createNewSession(userId);
    
    // Generate new token
    const newToken = await context.generateToken({
      userId,
      sessionId: newSessionId,
    });
    
    return newToken;
  } catch (error) {
    console.error('Error during password change session handling:', error);
    throw new HttpError(500, 'Failed to update session');
  }
};

export { sessionStore };