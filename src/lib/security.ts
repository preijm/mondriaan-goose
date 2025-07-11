/**
 * Security utilities for input validation and sanitization
 */

export const sanitizeInput = (input: string): string => {
  if (typeof input !== 'string') {
    return '';
  }
  
  // Remove potentially dangerous characters
  return input
    .replace(/[<>]/g, '') // Remove < and > to prevent XSS
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers like onclick=
    .trim();
};

export const validateEmail = (email: string): boolean => {
  if (!email || typeof email !== 'string') {
    return false;
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254; // RFC 5321 limit
};

export const validatePassword = (password: string, isSignup: boolean = false): { 
  isValid: boolean; 
  message: string; 
} => {
  if (!password || typeof password !== 'string') {
    return { isValid: false, message: "Password is required" };
  }
  
  if (isSignup) {
    if (password.length < 8) {
      return { isValid: false, message: "Password must be at least 8 characters" };
    }
    if (!/(?=.*[a-z])/.test(password)) {
      return { isValid: false, message: "Password must contain at least one lowercase letter" };
    }
    if (!/(?=.*[A-Z])/.test(password)) {
      return { isValid: false, message: "Password must contain at least one uppercase letter" };
    }
    if (!/(?=.*\d)/.test(password)) {
      return { isValid: false, message: "Password must contain at least one number" };
    }
    if (password.length > 128) { // Reasonable upper limit
      return { isValid: false, message: "Password is too long" };
    }
  }
  
  return { isValid: true, message: "" };
};

export const validateUsername = (username: string): { 
  isValid: boolean; 
  message: string; 
} => {
  if (!username || typeof username !== 'string') {
    return { isValid: false, message: "Username is required" };
  }
  
  const sanitized = sanitizeInput(username);
  
  if (sanitized.length < 2) {
    return { isValid: false, message: "Username must be at least 2 characters" };
  }
  
  if (sanitized.length > 30) {
    return { isValid: false, message: "Username must be less than 30 characters" };
  }
  
  if (!/^[a-zA-Z0-9_-]+$/.test(sanitized)) {
    return { isValid: false, message: "Username can only contain letters, numbers, hyphens, and underscores" };
  }
  
  return { isValid: true, message: "" };
};

/**
 * Rate limiting helper (client-side basic implementation)
 * Note: This is not a substitute for server-side rate limiting
 */
export class ClientSideRateLimit {
  private attempts: Map<string, number[]> = new Map();
  private maxAttempts: number;
  private windowMs: number;

  constructor(maxAttempts: number = 5, windowMs: number = 15 * 60 * 1000) { // 5 attempts per 15 minutes
    this.maxAttempts = maxAttempts;
    this.windowMs = windowMs;
  }

  canAttempt(key: string): boolean {
    const now = Date.now();
    const attempts = this.attempts.get(key) || [];
    
    // Remove expired attempts
    const validAttempts = attempts.filter(time => now - time < this.windowMs);
    
    if (validAttempts.length >= this.maxAttempts) {
      return false;
    }
    
    return true;
  }

  recordAttempt(key: string): void {
    const now = Date.now();
    const attempts = this.attempts.get(key) || [];
    attempts.push(now);
    
    // Keep only recent attempts
    const validAttempts = attempts.filter(time => now - time < this.windowMs);
    this.attempts.set(key, validAttempts);
  }

  getRemainingTime(key: string): number {
    const now = Date.now();
    const attempts = this.attempts.get(key) || [];
    
    if (attempts.length === 0) return 0;
    
    const oldestValidAttempt = Math.min(...attempts.filter(time => now - time < this.windowMs));
    return Math.max(0, this.windowMs - (now - oldestValidAttempt));
  }
}

// Global rate limiter instances
export const loginRateLimit = new ClientSideRateLimit(5, 15 * 60 * 1000); // 5 attempts per 15 minutes
export const signupRateLimit = new ClientSideRateLimit(3, 60 * 60 * 1000); // 3 attempts per hour
export const passwordResetRateLimit = new ClientSideRateLimit(3, 60 * 60 * 1000); // 3 attempts per hour
