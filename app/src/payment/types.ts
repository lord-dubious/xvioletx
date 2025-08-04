// Type definitions for payment webhooks and related functionality

import type { Request, Response } from 'express';
import type { PrismaClient } from '@prisma/client';

// Webhook context type
export interface WebhookContext {
  entities: {
    User: PrismaClient['user'];
    Logs: PrismaClient['logs'];
  };
}

// Webhook function type
export type WebhookFunction = (
  request: Request,
  response: Response,
  context: WebhookContext
) => Promise<Response>;

// Middleware config type
export interface MiddlewareConfig {
  delete: (middleware: string) => void;
  set: (middleware: string, handler: any) => void;
}

export type MiddlewareConfigFunction = (config: MiddlewareConfig) => void;

// User signup field data types
export interface EmailSignupData {
  email: string;
  password: string;
}

export interface GitHubSignupData {
  profile: {
    login: string;
    email?: string;
  };
  emails?: Array<{
    email: string;
    verified: boolean;
    primary: boolean;
  }>;
}

export interface GoogleSignupData {
  profile: {
    email: string;
    email_verified: boolean;
  };
}

export interface DiscordSignupData {
  profile: {
    email?: string;
    username: string;
    verified: boolean;
  };
}

// Operation context types
export interface OperationContext {
  user?: {
    id: string;
    email: string;
    username?: string;
    isAdmin: boolean;
  };
  entities: {
    User: PrismaClient['user'];
    Task: PrismaClient['task'];
    File: PrismaClient['file'];
    DailyStats: PrismaClient['dailyStats'];
    Logs: PrismaClient['logs'];
  };
}

// Generic operation type
export type Operation<TInput, TOutput> = (
  args: TInput,
  context: OperationContext
) => Promise<TOutput>;

// Job context type
export interface JobContext {
  entities: {
    User: PrismaClient['user'];
    DailyStats: PrismaClient['dailyStats'];
    Logs: PrismaClient['logs'];
  };
}

// Generic job type
export type Job<TInput, TOutput> = (
  args: TInput,
  context: JobContext
) => Promise<TOutput>;
