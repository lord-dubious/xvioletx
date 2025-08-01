# XTasker - Features and Application Structure

## Application Overview
XTasker is a task management SaaS application built with Wasp framework, integrating ElizaOS agent framework for AI-powered task assistance and automation. The application follows Wasp.sh conventions and boilerplate structure while providing a Twitter-like interface design similar to the main task3 repository.

## Core Features Implementation

### 1. AI-Powered Task Management
**How it works:**
- Uses custom LLM providers with configurable base URLs, models, and parameters
- ElizaOS agents process natural language input and convert to actionable tasks
- AI analyzes task complexity and suggests time estimates and priorities
- Automatic task categorization and dependency detection
- Support for multiple LLM providers (OpenAI, Anthropic, local models, etc.)

**Components:**
- `AppPage.tsx` - Main task interface with AI scheduler (renamed from DemoAppPage)
- `operations.ts` - Backend operations for LLM integration
- `schedule.ts` - Task scheduling logic and data structures
- `LlmSettings.tsx` - Custom LLM configuration interface

### 2. User Authentication System (Wasp Boilerplate)
**How it works:**
- Email-based authentication with verification (Wasp built-in)
- Password reset functionality via email
- JWT token management through Wasp auth system
- Role-based access control (user/admin)
- Maintains Wasp.sh auth conventions and structure

**Components:**
- `AuthPageLayout.tsx` - Authentication wrapper component
- `LoginPage.tsx` - User login interface
- `SignupPage.tsx` - User registration interface
- `userSignupFields.ts` - User registration field configuration
- Email templates in `auth/email-and-pass/emails.ts`

### 3. File Management System (Wasp Boilerplate)
**How it works:**
- AWS S3 integration for secure file storage
- Pre-signed URLs for direct browser uploads
- File validation and type checking
- User-specific file organization
- Follows Wasp file upload patterns

**Components:**
- `FileUploadPage.tsx` - File upload interface with progress tracking
- `fileUploading.ts` - Upload logic and validation
- `s3Utils.ts` - AWS S3 integration utilities
- `operations.ts` - Backend file operations

### 4. Payment and Subscription Management (Wasp Boilerplate)
**How it works:**
- Multiple payment processors (Stripe, Lemon Squeezy)
- Subscription plans with different feature tiers
- Credit-based usage tracking
- Customer portal for self-service management
- Maintains Wasp payment structure

**Components:**
- `PricingPage.tsx` - Subscription plans display
- `CheckoutPage.tsx` - Payment processing interface
- `plans.ts` - Payment plan configurations
- `paymentProcessor.ts` - Payment logic abstraction
- Webhook handlers for payment events

### 5. Analytics and Reporting (Wasp Boilerplate)
**How it works:**
- Daily statistics collection and aggregation
- Page view tracking and source attribution
- Revenue and user growth metrics
- Real-time dashboard updates
- Uses Wasp job scheduling for stats

**Components:**
- `AnalyticsDashboardPage.tsx` - Main analytics interface
- `TotalPageViewsCard.tsx` - Page view metrics display
- `TotalRevenueCard.tsx` - Revenue tracking
- `RevenueAndProfitChart.tsx` - Visual analytics
- `stats.ts` - Analytics data processing

### 6. Admin Management System (Wasp Boilerplate)
**How it works:**
- Role-based admin access control
- User management and monitoring
- System health and performance monitoring
- Content and configuration management
- Follows Wasp admin patterns

**Components:**
- `DefaultLayout.tsx` - Admin dashboard layout
- `UsersDashboardPage.tsx` - User management interface
- `SettingsPage.tsx` - System configuration
- `useRedirectHomeUnlessUserIsAdmin.ts` - Admin access control

## UI Design Structure (Similar to Task3 Main Repo)

### Twitter-like Interface Components
**Main Layout:**
- `Header.tsx` - Top navigation with user profile and notifications
- `Sidebar.tsx` - Left navigation panel with main menu items
- `MobileSidebar.tsx` - Mobile-responsive navigation
- `MobileBottomNav.tsx` - Bottom navigation for mobile

**Task Management Interface:**
- `TweetComposer.tsx` - Task creation interface (Twitter-like composer)
- `AgentList.tsx` - List of available AI agents
- `AgentForm.tsx` - Agent configuration and settings
- `SchedulingView.tsx` - Calendar and scheduling interface
- `TweetCalendar.tsx` - Task timeline view

**Dashboard Components:**
- `DashboardView.tsx` - Main dashboard with task overview
- `StatsCard.tsx` - Metrics and statistics cards
- `MediaLibraryView.tsx` - File and media management
- `NotificationDropdown.tsx` - Real-time notifications

**Mobile-First Design:**
- `MobileDashboard.tsx` - Mobile dashboard layout
- `MobileHeader.tsx` - Mobile navigation header
- `MobileTweetComposer.tsx` - Mobile task creation
- Responsive design patterns throughout

## Application Structure (Respecting Wasp.sh Conventions)

### Frontend Architecture (Wasp Client Structure)
```
src/
├── components/ui/          # Reusable UI components (Shadcn/ui)
├── client/                 # Client-side application logic (Wasp structure)
├── auth/                   # Authentication components (Wasp auth)
├── app/                    # Main app features (renamed from demo-ai-app)
├── file-upload/           # File management system (Wasp boilerplate)
├── payment/               # Payment and subscription logic (Wasp boilerplate)
├── user/                  # User profile and account management (Wasp)
├── admin/                 # Administrative interfaces (Wasp boilerplate)
├── landing-page/          # Marketing and landing pages (Wasp)
├── analytics/             # Analytics and reporting (Wasp boilerplate)
└── shared/                # Shared utilities and constants (Wasp)
```

### Backend Architecture (Wasp Server Structure)
```
server/
├── operations/            # Wasp operations (queries/actions)
├── scripts/               # Database seeds and utilities
├── validation/            # Input validation schemas
└── utils/                 # Server-side utilities
```

### Database Schema (Updated for XTasker)
```
User (Wasp boilerplate)
├── id, email, username
├── subscription data (status, plan, credits)
├── payment processor integration
└── relationships: tasks, files, llmResponses

Task (Enhanced)
├── id, description, time, isDone
├── user relationship
├── AI-enhanced metadata
├── priority, category, dependencies
└── ElizaOS agent interactions

File (Wasp boilerplate)
├── id, name, type, key, uploadUrl
└── user relationship

LlmResponse (Renamed from GptResponse)
├── id, content, createdAt
├── model, provider, parameters
├── user relationship
└── custom LLM configuration

DailyStats (Wasp boilerplate)
├── analytics metrics
├── revenue tracking
└── page view sources

LlmConfiguration (New)
├── id, name, provider
├── baseUrl, model, parameters
├── user relationship
└── custom settings
```

## Custom LLM Integration

### LLM Provider Support
**Supported Providers:**
- OpenAI (GPT-3.5, GPT-4, custom deployments)
- Anthropic (Claude models)
- Local models (Ollama, LM Studio)
- Custom API endpoints
- Azure OpenAI Service
- Google AI (Gemini)

**Configuration Options:**
- Custom base URLs for API endpoints
- Model selection and parameters
- Temperature, max tokens, top-p settings
- Custom headers and authentication
- Rate limiting and retry logic

**Components:**
- `LlmSettings.tsx` - LLM provider configuration
- `ModelSelector.tsx` - Model selection interface
- `CustomEndpointForm.tsx` - Custom API configuration
- `llmConfig.ts` - LLM configuration management

## Component Integration Flow (Wasp-Compliant)

### 1. Task Creation Flow
1. User inputs task via `TweetComposer.tsx` interface
2. ElizaOS agent processes natural language input
3. `generateLlmResponse` operation calls configured LLM provider
4. Structured task data returned and stored
5. UI updates with new task and AI suggestions

### 2. File Upload Flow (Wasp Boilerplate)
1. User selects file in `FileUploadPage.tsx`
2. File validation occurs client-side
3. `createFile` operation generates S3 signed URL
4. Direct upload to S3 with progress tracking
5. File metadata stored in database

### 3. Payment Flow (Wasp Boilerplate)
1. User selects plan on `PricingPage.tsx`
2. `generateCheckoutSession` creates payment session
3. Redirect to payment processor
4. Webhook processes payment completion
5. User subscription status updated

### 4. Admin Analytics Flow (Wasp Boilerplate)
1. Daily stats job aggregates data
2. `AnalyticsDashboardPage.tsx` queries metrics
3. Real-time charts and cards display data
4. Admin can drill down into specific metrics

## ElizaOS Agent Integration Points

### 1. Task Processing
- Natural language task input parsing
- Task complexity analysis and estimation
- Automatic categorization and tagging
- Dependency detection and suggestion

### 2. Schedule Optimization
- AI-powered daily schedule generation
- Priority-based task ordering
- Time block optimization
- Conflict resolution and suggestions

### 3. User Assistance
- Contextual help and guidance
- Task completion suggestions
- Productivity insights and recommendations
- Automated follow-up and reminders

## Technology Stack Integration (Wasp-Based)

### Frontend (Wasp Client)
- **React 18** with TypeScript for type safety
- **Tailwind CSS** for styling with **Shadcn/ui** components
- **Wasp client** for API integration and routing
- **Lucide React** for consistent iconography
- **Twitter-like UI patterns** from task3 repo

### Backend (Wasp Server)
- **Wasp framework** for full-stack coordination
- **Prisma ORM** for type-safe database operations
- **PostgreSQL** for data persistence
- **ElizaOS** for AI agent capabilities
- **PgBoss** for job scheduling (Wasp built-in)

### External Services
- **Custom LLM APIs** with configurable endpoints
- **AWS S3** for file storage (Wasp boilerplate)
- **Stripe/Lemon Squeezy** for payment processing (Wasp boilerplate)
- **Email services** for notifications (Wasp boilerplate)

## Development and Deployment (Wasp Workflow)

### Development Setup
- Wasp development server with hot reload
- PostgreSQL database with Prisma migrations
- Environment configuration for API keys and LLM endpoints
- Local S3 simulation for file testing

### Production Deployment
- Wasp build and deployment pipeline
- Database migration management
- Environment variable configuration
- CDN integration for static assets

## Key Wasp.sh Conventions Maintained

### 1. File Structure
- Maintains Wasp's src/ directory structure
- Preserves Wasp's operation patterns (queries/actions)
- Keeps Wasp's entity relationships intact
- Follows Wasp's page and route definitions

### 2. Authentication
- Uses Wasp's built-in auth system
- Maintains email verification flow
- Preserves admin role checking patterns
- Keeps Wasp's user entity structure

### 3. Database
- Uses Wasp's Prisma integration
- Maintains existing entity relationships
- Preserves Wasp's migration patterns
- Keeps Wasp's seeding structure

### 4. Operations
- Follows Wasp's query/action patterns
- Maintains Wasp's entity access control
- Preserves Wasp's validation patterns
- Keeps Wasp's error handling conventions