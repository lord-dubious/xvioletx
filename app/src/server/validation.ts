import { HttpError } from 'wasp/server';
import * as z from 'zod';

export function ensureArgsSchemaOrThrowHttpError<Schema extends z.ZodType>(
  schema: Schema,
  rawArgs: unknown
): z.infer<Schema> {
  const parseResult = schema.safeParse(rawArgs);
  if (!parseResult.success) {
    console.error(parseResult.error);
    throw new HttpError(400, 'Operation arguments validation failed', { errors: parseResult.error.errors });
  } else {
    return parseResult.data;
  }
}

// User Registration Schema
export const userRegistrationSchema = z.object({
  email: z.string().email('Invalid email format').max(255),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password too long')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// User Login Schema
export const userLoginSchema = z.object({
  email: z.string().email('Invalid email format').max(255),
  password: z.string().min(1, 'Password is required').max(128),
});

// Password Reset Schema
export const passwordResetSchema = z.object({
  email: z.string().email('Invalid email format').max(255),
});

// New Password Schema
export const newPasswordSchema = z.object({
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password too long')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// Task Creation Schema
export const taskCreationSchema = z.object({
  title: z.string()
    .min(1, 'Title is required')
    .max(200, 'Title must be 200 characters or less')
    .trim()
    .regex(/^[\w\s\-.,!?()]+$/, 'Title contains invalid characters'),
  description: z.string()
    .max(2000, 'Description must be 2000 characters or less')
    .trim()
    .optional(),
  category: z.string()
    .max(50, 'Category must be 50 characters or less')
    .trim()
    .optional(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).optional(),
  dueDate: z.string().datetime().optional(),
  tags: z.array(z.string().max(30)).max(10).optional(),
});

// Task Update Schema
export const taskUpdateSchema = z.object({
  id: z.string().uuid('Invalid task ID'),
  title: z.string().min(1).max(200).trim().optional(),
  description: z.string().max(2000).trim().optional(),
  category: z.string().max(50).trim().optional(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).optional(),
  dueDate: z.string().datetime().optional(),
  tags: z.array(z.string().max(30)).max(10).optional(),
  completed: z.boolean().optional(),
});

// File Upload Schema
export const fileUploadSchema = z.object({
  fileName: z.string()
    .min(1, 'File name is required')
    .max(255, 'File name too long')
    .regex(/^[\w\-_. ]+$/, 'File name contains invalid characters'),
  fileType: z.string()
    .refine((type) => [
      'image/jpeg', 'image/png', 'image/gif', 'image/webp',
      'application/pdf', 'text/plain', 'text/markdown',
      'video/mp4', 'video/quicktime', 'video/webm',
      'audio/mpeg', 'audio/wav', 'audio/ogg'
    ].includes(type), 'Unsupported file type'),
  fileSize: z.number()
    .max(5 * 1024 * 1024, 'File size must be 5MB or less'),
  taskId: z.string().uuid('Invalid task ID').optional(),
});

// API Request Schema
export const apiRequestSchema = z.object({
  endpoint: z.string()
    .url('Invalid URL format')
    .max(500, 'URL too long'),
  method: z.enum(['GET', 'POST', 'PUT', 'DELETE', 'PATCH']),
  headers: z.record(z.string()).optional(),
  body: z.string().max(10000, 'Request body too large').optional(),
});

// LLM Configuration Schema
export const llmConfigSchema = z.object({
  key: z.string()
    .min(1, 'Configuration key is required')
    .max(100, 'Key too long')
    .regex(/^[a-zA-Z0-9_-]+$/, 'Key contains invalid characters'),
  baseUrl: z.string()
    .url('Invalid URL format')
    .max(500, 'URL too long'),
  models: z.string()
    .min(1, 'Models list is required')
    .max(1000, 'Models list too long'),
  temperature: z.number()
    .min(0, 'Temperature must be 0 or greater')
    .max(2, 'Temperature must be 2 or less')
    .optional(),
  maxTokens: z.number()
    .min(1, 'Max tokens must be 1 or greater')
    .max(100000, 'Max tokens too large')
    .optional(),
  topP: z.number()
    .min(0, 'Top P must be 0 or greater')
    .max(1, 'Top P must be 1 or less')
    .optional(),
  customHeaders: z.string().max(1000).optional(),
});

// Sanitization helper for strings
export const sanitizeString = (input: string): string => {
  return input
    .trim()
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .replace(/<[^>]*>/g, '');
};

// Email validation regex
export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// URL validation regex
export const urlRegex = /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/;

// File extension validation
export const allowedFileExtensions = [
  '.jpg', '.jpeg', '.png', '.gif', '.webp', '.pdf', '.txt', '.md',
  '.mp4', '.mov', '.webm', '.mp3', '.wav', '.ogg'
] as const;

