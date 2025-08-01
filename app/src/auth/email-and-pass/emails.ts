import { type GetVerificationEmailContentFn, type GetPasswordResetEmailContentFn } from 'wasp/server/auth';

export const getVerificationEmailContent: GetVerificationEmailContentFn = ({ verificationLink }) => ({
  subject: 'Welcome to XTasker - Verify Your Email',
  text: `Welcome to XTasker! Click the link below to verify your email address: ${verificationLink}`,
  html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f9fafb; padding: 20px;">
      <div style="background: white; border-radius: 8px; padding: 40px; text-align: center;">
        <h1 style="color: #1f2937; font-size: 24px; font-weight: bold; margin-bottom: 16px;">Welcome to XTasker</h1>
        <p style="color: #6b7280; font-size: 16px; margin-bottom: 24px;">
          Thanks for signing up! Please verify your email address to get started with AI-powered task management.
        </p>
        <a href="${verificationLink}" 
           style="background: #3b82f6; color: white; padding: 12px 32px; border-radius: 6px; text-decoration: none; font-weight: 600; display: inline-block;">
          Verify Email Address
        </a>
        <p style="color: #9ca3af; font-size: 14px; margin-top: 24px;">
          If you didn't create this account, you can safely ignore this email.
        </p>
      </div>
    </div>
  `,
});

export const getPasswordResetEmailContent: GetPasswordResetEmailContentFn = ({ passwordResetLink }) => ({
  subject: 'XTasker - Reset Your Password',
  text: `We received a request to reset your XTasker password. Click the link below to reset it: ${passwordResetLink}`,
  html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f9fafb; padding: 20px;">
      <div style="background: white; border-radius: 8px; padding: 40px; text-align: center;">
        <h1 style="color: #1f2937; font-size: 24px; font-weight: bold; margin-bottom: 16px;">Reset Your Password</h1>
        <p style="color: #6b7280; font-size: 16px; margin-bottom: 24px;">
          We received a request to reset your XTasker password. Click the button below to create a new password.
        </p>
        <a href="${passwordResetLink}" 
           style="background: #3b82f6; color: white; padding: 12px 32px; border-radius: 6px; text-decoration: none; font-weight: 600; display: inline-block;">
          Reset Password
        </a>
        <p style="color: #9ca3af; font-size: 14px; margin-top: 24px;">
          This link will expire in 1 hour. If you didn't request this reset, you can safely ignore this email.
        </p>
      </div>
    </div>
  `,
});
