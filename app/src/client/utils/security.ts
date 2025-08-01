/**
 * XSS Protection and Output Encoding Utilities
 * Provides functions to safely render user input and prevent XSS attacks
 */

// HTML entities for encoding
const htmlEntities: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#x27;',
  '/': '&#x2F;',
};

/**
 * Encode HTML entities to prevent XSS
 */
export const encodeHtml = (input: string): string => {
  return String(input).replace(/[&<>"'/]/g, (char) => htmlEntities[char] || char);
};

/**
 * Sanitize HTML content by removing dangerous tags and attributes
 */
export const sanitizeHtml = (input: string): string => {
  if (!input) return '';
  
  return input
    // Remove script tags and content
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    // Remove javascript: protocol
    .replace(/javascript:/gi, '')
    // Remove event handlers
    .replace(/on\w+\s*=/gi, '')
    // Remove iframe tags
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    // Remove object tags
    .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '')
    // Remove embed tags
    .replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, '')
    // Remove link tags
    .replace(/<link\b[^<]*(?:(?!<\/link>)<[^<]*)*<\/link>/gi, '')
    // Remove meta tags
    .replace(/<meta\b[^<]*(?:(?!<\/meta>)<[^<]*)*<\/meta>/gi, '');
};

/**
 * Create a safe URL by validating and encoding
 */
export const sanitizeUrl = (url: string): string => {
  try {
    const parsed = new URL(url);
    
    // Only allow http/https protocols
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return '#';
    }
    
    return parsed.toString();
  } catch {
    return '#';
  }
};

/**
 * Sanitize CSS to prevent CSS injection
 */
export const sanitizeCss = (css: string): string => {
  if (!css) return '';
  
  // Remove potentially dangerous CSS
  return css
    .replace(/expression\s*\(/gi, '') // IE expression()
    .replace(/javascript:/gi, '')
    .replace(/behavior\s*:/gi, '') // IE behavior
    .replace(/-moz-binding/gi, '') // Firefox binding
    .replace(/@import/gi, '') // CSS imports
    .replace(/<\/style>/gi, '') // Close style tags
    .replace(/<style[^>]*>/gi, ''); // Open style tags
};

/**
 * Validate and sanitize file names
 */
export const sanitizeFileName = (fileName: string): string => {
  if (!fileName) return '';
  
  // Remove path traversal attempts
  const sanitized = fileName
    .replace(/\.\./g, '') // Remove ..
    .replace(/\/+/g, '') // Remove forward slashes
    .replace(/\\+/g, '') // Remove backslashes
    .replace(/[<>:"|?*]/g, '') // Remove invalid characters
    .trim();
  
  return sanitized.substring(0, 255); // Limit length
};

/**
 * Create CSP nonce for inline scripts
 */
export const generateNonce = (): string => {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('');
};

/**
 * Validate and sanitize JSON data
 */
export const sanitizeJson = (data: unknown): string => {
  try {
    const jsonString = JSON.stringify(data);
    return encodeHtml(jsonString);
  } catch {
    return '{}';
  }
};

/**
 * Create safe React props for dangerouslySetInnerHTML
 */
export const createSafeHtml = (html: string): { __html: string } => {
  return {
    __html: sanitizeHtml(html)
  };
};

/**
 * Check if content contains potential XSS
 */
export const containsPotentialXss = (content: string): boolean => {
  const xssPatterns = [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi,
    /<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi,
    /<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi,
    /eval\s*\(/gi,
    /expression\s*\(/gi,
  ];
  
  return xssPatterns.some(pattern => pattern.test(content));
};

/**
 * CSP policy generator
 */
export const generateCSP = (nonce: string): string => {
  return [
    "default-src 'self'",
    "script-src 'self' 'nonce-" + nonce + "' 'strict-dynamic'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https:",
    "font-src 'self'",
    "connect-src 'self'",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'"
  ].join('; ');
};
