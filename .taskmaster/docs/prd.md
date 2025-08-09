# xtasker - Product Requirements Document

## 🎯 Product Overview

**Product Name**: xtasker
**Product Type**: AI-powered Twitter management platform
**Target Users**: Content creators, social media managers, businesses, influencers
**Core Value Proposition**: Streamline Twitter content creation, scheduling, and management with AI assistance

## 📋 Executive Summary

xtasker is an intelligent Twitter management platform that combines AI-powered content generation with smart scheduling and media optimization. Users can create engaging tweets using AI agents with custom personalities, schedule content for optimal engagement times, and manage their Twitter presence efficiently.

The platform integrates with Google AI (Gemini) for content generation, Cloudflare R2 for media storage, and Twitter API v2 for seamless posting and account management.

## 🎯 Core Features

### 1. AI-Powered Content Generation
**Priority**: High
**Description**: Generate engaging tweets using OpenAI (leveraging existing OpenAI integration)

**User Stories**:
- As a subscriber, I want unlimited AI tweet generation using the platform's OpenAI key
- As a free user, I want to use my own OpenAI API key for unlimited AI generation
- As a power user, I want to configure custom OpenAI endpoints (Azure OpenAI, local models)
- As a business owner, I want AI to analyze my uploaded images and create contextual tweets
- As a social media manager, I want to improve existing tweets with AI suggestions for better engagement

**Acceptance Criteria**:
- Subscribers get unlimited AI usage with platform's OpenAI key
- Free users can configure their own OpenAI API key in settings
- Support for custom OpenAI base URLs and model selection
- Users can input prompts and receive AI-generated tweet suggestions
- System analyzes uploaded images and generates relevant tweet content (extends existing file-upload)
- AI provides suggestions to improve existing tweet drafts
- Generated content respects Twitter's character limits
- Users can regenerate content with different tones/styles

### 2. Custom AI Agents
**Priority**: High
**Description**: Create personalized AI personas for consistent brand voice

**User Stories**:
- As a brand manager, I want to create AI agents with specific personalities so my content maintains consistent voice
- As an influencer, I want different AI agents for different content types (professional, casual, educational)
- As a business, I want AI agents that understand my industry expertise and terminology

**Acceptance Criteria**:
- Users can create multiple AI agents with custom names and personalities
- Each agent has defined expertise areas and writing styles
- Agents can be trained with example posts for consistency
- Users can select specific agents when generating content
- Agents maintain personality across all generated content

### 3. Smart Tweet Scheduling
**Priority**: High
**Description**: Schedule tweets for optimal posting times with intelligent recommendations

**User Stories**:
- As a content creator, I want to schedule tweets for when my audience is most active
- As a global business, I want to schedule content for different time zones
- As a busy professional, I want to batch create and schedule a week's worth of content

**Acceptance Criteria**:
- Users can schedule tweets for specific dates and times
- System suggests optimal posting times based on audience analytics
- Bulk scheduling interface for multiple tweets
- Calendar view showing scheduled content
- Automatic posting at scheduled times
- Edit/delete scheduled tweets before posting

### 4. Media Management & Optimization
**Priority**: Medium
**Description**: Leverage existing file-upload system for Twitter media optimization

**User Stories**:
- As a visual content creator, I want to upload and optimize images for Twitter
- As a video creator, I want automatic video compression for faster uploads
- As a mobile user, I want images automatically resized for optimal Twitter display

**Acceptance Criteria**:
- Extends existing S3-compatible file-upload system (works with Cloudflare R2!)
- Support for image uploads (JPEG, PNG, GIF, WebP) - already implemented
- Support for video uploads (MP4, MOV, AVI) - extends existing validation
- Automatic image compression and optimization (40-70% size reduction)
- Automatic resizing to Twitter's optimal dimensions
- Format conversion to web-optimized formats
- Media library for reusing uploaded content (extends existing File entity)
- Leverages existing presigned URL system for secure uploads

### 5. Twitter Account Integration
**Priority**: High
**Description**: Secure connection to Twitter accounts for posting and analytics

**User Stories**:
- As a user, I want to securely connect my Twitter account to post content
- As a social media manager, I want to manage multiple Twitter accounts
- As a business owner, I want to ensure my Twitter credentials are secure

**Acceptance Criteria**:
- OAuth 2.0 integration with Twitter API v2
- Secure storage of access and refresh tokens
- Support for multiple connected Twitter accounts
- Automatic token refresh handling
- Account verification and status display
- Disconnect/reconnect account functionality

### 6. Content Calendar & Analytics
**Priority**: Medium
**Description**: Visual calendar interface and performance tracking

**User Stories**:
- As a content planner, I want a calendar view of my scheduled content
- As a marketer, I want to track tweet performance and engagement
- As a business owner, I want insights into my content strategy effectiveness

**Acceptance Criteria**:
- Monthly/weekly calendar view of scheduled tweets
- Drag-and-drop rescheduling functionality
- Basic analytics dashboard showing tweet performance
- Engagement metrics (likes, retweets, replies, impressions)
- Content performance insights and recommendations
- Export analytics data for reporting

## 🔐 Authentication & Security

### User Authentication (Leverages Existing System)
- Email/password registration and login (already implemented)
- Google OAuth sign-in/sign-up integration (ready to uncomment in main.wasp)
- Email verification for new accounts (already implemented)
- Password reset functionality (already implemented)
- Secure session management (already implemented)
- Admin user system (already implemented)

### Twitter Integration Security
- OAuth 2.0 with PKCE for Twitter account linking
- Encrypted storage of Twitter access tokens
- Automatic token refresh handling
- Secure API communication with Twitter
- User consent for Twitter permissions

### Data Security (Built on Existing Infrastructure)
- HTTPS encryption for all communications (already implemented)
- Secure storage of user data and media files (existing S3/R2 integration)
- GDPR compliance for user data handling (existing user management)
- Regular security audits and updates
- Data backup and recovery procedures
- Secure API key storage for custom OpenAI configurations

## 🛠️ Technical Architecture

### Frontend Technology Stack
- React with TypeScript (strict typing, no 'any' types)
- Wasp framework for full-stack type safety
- Tailwind CSS for styling
- React Hook Form for form management
- React Query for API state management

### Backend Technology Stack (Leverages Existing)
- Node.js with TypeScript (already configured)
- Wasp framework for API generation (already configured)
- Prisma ORM for database operations (already configured)
- PostgreSQL for primary database (already configured with real credentials)
- PgBoss for job scheduling (already configured for cron jobs)
- Existing analytics and admin systems

### External Integrations
- **OpenAI API**: Content generation and image analysis (already integrated, extend existing)
- **Twitter API v2**: Tweet posting and account management
- **Cloudflare R2**: Media storage and CDN (S3-compatible, already configured)
- **Stripe/LemonSqueezy**: Payment processing for subscriptions (already implemented)
- **Google OAuth**: User authentication (ready to enable)
- **Analytics providers**: Google Analytics, Plausible (already configured)

### Infrastructure
- Cloudflare for CDN and DDoS protection
- Automated deployments with CI/CD
- Environment-based configuration
- Monitoring and logging systems
- Automated backups and disaster recovery

## 📊 API Integrations

### Twitter API v2 (Free Tier)
- **Rate Limits**: 1,500 tweets per month, 300 requests per 15-minute window
- **Endpoints Used**:
  - POST /2/tweets (create tweets)
  - GET /2/users/me (user profile)
  - GET /2/users/:id/tweets (user tweets)
  - POST /1.1/media/upload (media upload)
- **OAuth Scope**: tweet.read tweet.write users.read offline.access

### OpenAI API (Extends Existing Integration)
- Text generation for tweet content (extends existing GPT integration)
- Image analysis for contextual content creation
- Content improvement suggestions
- Multi-modal AI capabilities
- Support for custom API keys and base URLs
- Custom model selection (GPT-4, GPT-3.5-turbo, fine-tuned models)

### Cloudflare R2 Storage
- S3-compatible API for seamless integration
- Zero egress fees for cost optimization
- Global CDN for fast media delivery
- Automatic backup and versioning

## 💰 Monetization Strategy

### Freemium Model (No Credit System)
**Free Tier**:
- Bring your own OpenAI API key for unlimited AI generation
- 1 connected Twitter account
- Basic scheduling (up to 10 scheduled tweets)
- 1 AI agent
- 100MB media storage (leverages existing file-upload system)

**Pro Tier ($9.99/month)**:
- Unlimited AI-generated tweets using platform's OpenAI key
- 3 connected Twitter accounts
- Unlimited scheduling
- 5 AI agents with custom training
- 1GB media storage
- Basic analytics dashboard (extends existing analytics system)

**Business Tier ($29.99/month)**:
- Unlimited AI-generated tweets using platform's OpenAI key
- 10 connected Twitter accounts
- Advanced scheduling with optimal time suggestions
- Unlimited AI agents
- 10GB media storage
- Advanced analytics and reporting
- Priority customer support
- Custom OpenAI base URL support (Azure OpenAI, local models)

## 🎨 User Experience Design

### Design Principles
- Clean, intuitive interface focused on content creation
- Mobile-first responsive design
- Accessibility compliance (WCAG 2.1 AA)
- Consistent design system with reusable components
- Fast loading times and smooth interactions

### Key User Flows
1. **Onboarding**: Account creation → Twitter connection → First tweet generation
2. **Content Creation**: AI prompt → Content generation → Media upload → Scheduling
3. **Bulk Scheduling**: Calendar view → Batch content creation → Schedule optimization
4. **Analytics Review**: Dashboard → Performance metrics → Content insights

## 📈 Success Metrics

### User Engagement
- Daily/Monthly Active Users (DAU/MAU)
- Tweet generation frequency per user
- Scheduled tweet completion rate
- User retention rates (7-day, 30-day)

### Business Metrics
- Conversion rate from free to paid plans
- Monthly Recurring Revenue (MRR)
- Customer Acquisition Cost (CAC)
- Customer Lifetime Value (CLV)
- Churn rate by plan tier

### Product Performance
- AI content generation success rate
- Tweet scheduling accuracy
- Media optimization efficiency
- API response times and uptime

## 🚀 Development Roadmap

### Phase 1: MVP (Months 1-2) - Extend Existing Systems
- Extend existing auth system (uncomment Google OAuth)
- Transform existing AI system for tweet generation (remove credits, add custom keys)
- Simple tweet scheduling using existing job system
- Twitter account connection and posting
- Extend existing file-upload for Twitter media optimization

### Phase 2: Core Features (Months 3-4) - Build on Foundation
- Custom AI agents with personality training (extends existing AI system)
- Advanced scheduling with calendar interface
- Media library using existing file management
- Extend existing analytics dashboard for Twitter metrics
- Extend existing payment system for Twitter-specific plans

### Phase 3: Advanced Features (Months 5-6)
- Optimal posting time recommendations
- Advanced analytics and reporting
- Bulk content creation and scheduling
- Mobile app development
- API for third-party integrations

### Phase 4: Scale & Optimize (Months 7+)
- Advanced AI features and improvements
- Enterprise features for larger teams
- Integration with other social media platforms
- Advanced analytics and AI insights
- Performance optimization and scaling

## 🔧 Technical Requirements

### Performance Requirements
- Page load times under 2 seconds
- API response times under 500ms
- 99.9% uptime availability
- Support for 10,000+ concurrent users
- Mobile-optimized performance

### Security Requirements
- SOC 2 Type II compliance
- GDPR and CCPA compliance
- Regular security audits and penetration testing
- Encrypted data storage and transmission
- Secure API authentication and authorization

### Scalability Requirements
- Horizontal scaling capability
- Auto-scaling based on demand
- Database optimization for large datasets
- CDN integration for global performance
- Microservices architecture for modularity

## 📋 Acceptance Criteria Summary

The xtasker platform will be considered successful when:
- Users can generate high-quality tweet content using AI assistance
- Content scheduling works reliably with accurate posting times
- Media optimization reduces file sizes by 40-70% while maintaining quality
- Twitter integration allows seamless posting without manual intervention
- Analytics provide actionable insights for content strategy improvement
- The platform maintains 99.9% uptime with fast response times
- User onboarding is completed in under 5 minutes
- Free-to-paid conversion rate exceeds 5%
