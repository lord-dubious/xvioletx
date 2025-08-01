import { useCallback } from 'react';
import { encodeHtml, sanitizeHtml, sanitizeUrl, sanitizeFileName, containsPotentialXss } from '../utils/security';

/**
 * Security hook for React components
 * Provides safe rendering utilities and XSS protection
 */
export const useSecurity = () => {
  /**
   * Safely render user content with HTML encoding
   */
  const safeRender = useCallback((content: string): string => {
    return encodeHtml(content);
  }, []);

  /**
   * Safely render HTML content with sanitization
   */
  const safeHtml = useCallback((html: string): { __html: string } => {
    return {
      __html: sanitizeHtml(html)
    };
  }, []);

  /**
   * Validate and sanitize URL
   */
  const safeUrl = useCallback((url: string): string => {
    return sanitizeUrl(url);
  }, []);

  /**
   * Validate and sanitize file name
   */
  const safeFileName = useCallback((fileName: string): string => {
    return sanitizeFileName(fileName);
  }, []);

  /**
   * Check if content contains potential XSS
   */
  const hasXss = useCallback((content: string): boolean => {
    return containsPotentialXss(content);
  }, []);

  /**
   * Validate form input
   */
  const validateInput = useCallback((
    value: string,
    options: {
      maxLength?: number;
      minLength?: number;
      pattern?: RegExp;
      allowHtml?: boolean;
    } = {}
  ): { isValid: boolean; error?: string } => {
    const { maxLength, minLength, pattern, allowHtml = false } = options;

    // Check for XSS
    if (!allowHtml && containsPotentialXss(value)) {
      return { isValid: false, error: 'Input contains potentially dangerous content' };
    }

    // Check minimum length
    if (minLength && value.length < minLength) {
      return { isValid: false, error: `Input must be at least ${minLength} characters` };
    }

    // Check maximum length
    if (maxLength && value.length > maxLength) {
      return { isValid: false, error: `Input must be ${maxLength} characters or less` };
    }

    // Check pattern
    if (pattern && !pattern.test(value)) {
      return { isValid: false, error: 'Input format is invalid' };
    }

    return { isValid: true };
  }, []);

  /**
   * Sanitize form data
   */
  const sanitizeFormData = useCallback((formData: Record<string, any>): Record<string, any> => {
    const sanitized: Record<string, any> = {};
    
    Object.keys(formData).forEach(key => {
      const value = formData[key];
      
      if (typeof value === 'string') {
        sanitized[key] = encodeHtml(value.trim());
      } else if (typeof value === 'object' && value !== null) {
        sanitized[key] = sanitizeFormData(value);
      } else {
        sanitized[key] = value;
      }
    });
    
    return sanitized;
  }, []);

  /**
   * Create safe attributes for React elements
   */
  const safeAttributes = useCallback((attributes: Record<string, any>): Record<string, any> => {
    const safe: Record<string, any> = {};
    
    Object.keys(attributes).forEach(key => {
      const value = attributes[key];
      
      // Skip dangerous attributes
      if (key.startsWith('on') || key === 'href' && typeof value === 'string' && value.startsWith('javascript:')) {
        return;
      }
      
      if (key === 'href' && typeof value === 'string') {
        safe[key] = sanitizeUrl(value);
      } else if (typeof value === 'string') {
        safe[key] = encodeHtml(value);
      } else {
        safe[key] = value;
      }
    });
    
    return safe;
  }, []);

  return {
    safeRender,
    safeHtml,
    safeUrl,
    safeFileName,
    hasXss,
    validateInput,
    sanitizeFormData,
    safeAttributes,
  };
};
