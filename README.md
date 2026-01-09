# Chatbot Application

A modern, full-stack AI chatbot application built with Next.js, featuring real-time streaming responses, user authentication, subscription management, and message persistence. This application provides a seamless chat experience with OpenAI's GPT models, complete with rate limiting, user management, and a beautiful UI.

## 🚀 Features

### Core Features
- **Real-time AI Chat**: Stream responses from OpenAI's GPT-5-nano model using the Vercel AI SDK
- **User Authentication**: Secure authentication system with Better Auth supporting GitHub OAuth
- **Message Persistence**: All conversations are saved to PostgreSQL database for history
- **Rate Limiting**: Usage tracking and rate limiting based on user subscription tier
  - Free users: 3 prompts per day
  - Pro users: 100 prompts per day
- **Subscription Management**: Integrated with Polar.sh for subscription handling
  - Checkout flow for upgrading to Pro
  - Customer portal for subscription management
  - Webhook handling for subscription events
- **Modern UI/UX**: Beautiful, responsive interface built with Radix UI and Tailwind CSS
  - Auto-scrolling conversation view
  - Loading states and shimmer effects
  - Empty state handling
  - Smooth animations with Motion
- **Type-Safe API**: End-to-end type safety with tRPC
- **Message Management**: 
  - View conversation history
  - Delete all messages
  - Timestamp display for each message

### Technical Features
- **Server-Side Rendering**: Next.js 16 with App Router
- **Streaming Responses**: Real-time token streaming for better UX
- **Database Migrations**: Prisma ORM with PostgreSQL
- **Code Quality**: Biome for linting and formatting
- **React Compiler**: Optimized React rendering with React Compiler
- **Theme Support**: Dark/light mode with next-themes

## 🛠️ Technologies

### Frontend
- **Next.js 16.1.1** - React framework with App Router
- **React 19.2.3** - UI library
- **TypeScript 5** - Type safety
- **Tailwind CSS 4** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
  - `@radix-ui/react-dialog` - Modal dialogs
  - `@radix-ui/react-dropdown-menu` - Dropdown menus
  - `@radix-ui/react-tooltip` - Tooltips
  - `@radix-ui/react-separator` - Visual separators
  - `@radix-ui/react-scroll-area` - Custom scrollbars
- **LobeHub UI** - Pre-built UI components
- **Lucide React** - Icon library
- **Motion** - Animation library
- **Sonner** - Toast notifications
- **next-themes** - Theme management

### Backend & API
- **tRPC 11.8.1** - End-to-end typesafe APIs
- **Better Auth 1.4.10** - Authentication framework
- **Vercel AI SDK 6.0.23** - AI integration
  - `@ai-sdk/openai` - OpenAI integration
  - `@ai-sdk/react` - React hooks for AI
- **Rate Limiter Flexible** - Rate limiting with Prisma storage
- **SuperJSON** - Enhanced JSON serialization

### Database & ORM
- **PostgreSQL** - Relational database
- **Prisma 7.2.0** - Next-generation ORM
  - `@prisma/client` - Prisma client
  - `@prisma/adapter-pg` - PostgreSQL adapter

### Payment & Subscription
- **Polar.sh SDK** - Subscription management
  - `@polar-sh/better-auth` - Better Auth integration
  - `@polar-sh/sdk` - Polar API client

### Development Tools
- **Biome 2.2.0** - Fast formatter and linter
- **pnpm** - Fast, disk space efficient package manager
- **tsx** - TypeScript execution
- **React Compiler** - React optimization

### Utilities
- **Zod 4.3.5** - Schema validation
- **date-fns 4.1.0** - Date formatting
- **clsx** - Conditional classnames
- **class-variance-authority** - Component variants
- **react-textarea-autosize** - Auto-resizing textarea
- **use-stick-to-bottom** - Scroll-to-bottom hook
- **streamdown** - Streaming utilities

## 📊 Architecture

### Project Structure
```
chatbot/
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── migrations/             # Database migrations
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/                # API routes
│   │   │   ├── auth/           # Authentication endpoints
│   │   │   ├── chat/           # Chat streaming endpoint
│   │   │   └── trpc/           # tRPC endpoint
│   │   ├── auth/               # Auth page
│   │   ├── layout.tsx          # Root layout
│   │   └── page.tsx            # Home page
│   ├── components/             # React components
│   │   ├── ai-elements/        # AI-specific components
│   │   ├── auth/               # Auth components
│   │   ├── context/            # React contexts
│   │   └── ui/                 # UI primitives
│   ├── generated/              # Generated Prisma client
│   ├── lib/                    # Utility libraries
│   ├── trpc/                   # tRPC setup and routers
│   ├── utils/                  # Helper utilities
│   └── styles/                 # Global styles
├── public/                     # Static assets
└── types/                      # TypeScript type definitions
```

### Database Schema
- **User**: User accounts with subscription status
- **Session**: User sessions for authentication
- **Account**: OAuth account connections
- **Verification**: Email verification tokens
- **Message**: Chat messages (USER, ASSISTANT, SYSTEM roles)
- **Usage**: Rate limiting tracking

## 🔄 System Flow

### Chat Message Flow Sequence Diagram

```mermaid
sequenceDiagram
    participant User
    participant UI as React UI
    participant tRPC as tRPC Client
    participant API as Next.js API
    participant Auth as Better Auth
    participant DB as PostgreSQL
    participant RateLimiter as Rate Limiter
    participant OpenAI as OpenAI API
    participant Polar as Polar.sh

    User->>UI: Types message & submits
    UI->>tRPC: message.create({ prompt })
    tRPC->>API: POST /api/trpc/message.create
    API->>Auth: Verify session
    Auth->>DB: Check session token
    DB-->>Auth: Session data
    Auth-->>API: User context
    
    API->>RateLimiter: consumeCredits(userId, plan)
    RateLimiter->>DB: Check usage limits
    alt Free user (3/day) or Pro user (100/day)
        DB-->>RateLimiter: Usage count
        RateLimiter-->>API: Credits consumed
    else Limit exceeded
        RateLimiter-->>API: Error
        API-->>tRPC: PAYMENT_REQUIRED error
        tRPC-->>UI: Show error toast
    end
    
    API->>DB: Create USER message
    DB-->>API: Message saved
    API-->>tRPC: Message created
    tRPC-->>UI: Success callback
    
    UI->>API: POST /api/chat (stream)
    API->>Auth: Verify session
    Auth-->>API: User authenticated
    API->>OpenAI: streamText() with messages
    OpenAI-->>API: Stream tokens
    API-->>UI: Stream response chunks
    UI->>User: Display streaming text
    
    OpenAI-->>API: Stream complete
    API->>DB: Save ASSISTANT message
    DB-->>API: Message saved
    API-->>UI: Stream complete
    UI->>User: Show complete message
```

### Authentication Flow

```mermaid
sequenceDiagram
    participant User
    participant UI
    participant Auth as Better Auth
    participant GitHub
    participant DB as PostgreSQL
    participant Polar as Polar.sh

    User->>UI: Click "Sign in with GitHub"
    UI->>Auth: Initiate OAuth flow
    Auth->>GitHub: Redirect to GitHub OAuth
    GitHub->>User: Login/Authorize
    GitHub->>Auth: OAuth callback with code
    Auth->>GitHub: Exchange code for token
    GitHub-->>Auth: Access token
    Auth->>GitHub: Fetch user profile
    GitHub-->>Auth: User data
    Auth->>DB: Create/Update user
    Auth->>Polar: Create customer (if new)
    Polar-->>Auth: Customer created
    DB-->>Auth: User created
    Auth->>DB: Create session
    DB-->>Auth: Session token
    Auth-->>UI: Set session cookie
    UI->>User: Redirect to home
```

### Subscription Flow

```mermaid
sequenceDiagram
    participant User
    participant UI
    participant Polar as Polar.sh
    participant Webhook
    participant DB as PostgreSQL

    User->>UI: Click "Upgrade to Pro"
    UI->>Polar: Initiate checkout
    Polar->>User: Payment form
    User->>Polar: Complete payment
    Polar->>Webhook: Order paid event
    Webhook->>DB: Update user status to "pro_user"
    DB-->>Webhook: Status updated
    Webhook-->>Polar: Webhook processed
    Polar-->>UI: Redirect to success page
    UI->>User: Show Pro features
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- pnpm (or npm/yarn)
- PostgreSQL database
- OpenAI API key
- GitHub OAuth app (for authentication)
- Polar.sh account (for subscriptions)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd chatbot
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   # Database
   DATABASE_URL="postgresql://user:password@localhost:5432/chatbot"

   # Authentication
   BETTER_AUTH_SECRET="your-secret-key-here"
   BETTER_AUTH_URL="http://localhost:3000"
   
   # GitHub OAuth
   GITHUB_CLIENT_ID="your-github-client-id"
   GITHUB_CLIENT_SECRET="your-github-client-secret"
   
   # OpenAI
   OPENAI_API_KEY="your-openai-api-key"
   
   # Polar.sh
   POLAR_ACCESS_TOKEN="your-polar-access-token"
   POLAR_WEBHOOK_SECRET="your-polar-webhook-secret"
   ```

4. **Set up the database**
   ```bash
   # Generate Prisma client
   pnpm prisma generate
   
   # Run migrations
   pnpm prisma migrate dev
   ```

5. **Run the development server**
   ```bash
   pnpm dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📝 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `BETTER_AUTH_SECRET` | Secret key for Better Auth | Yes |
| `BETTER_AUTH_URL` | Base URL of your application | Yes |
| `GITHUB_CLIENT_ID` | GitHub OAuth client ID | Yes |
| `GITHUB_CLIENT_SECRET` | GitHub OAuth client secret | Yes |
| `OPENAI_API_KEY` | OpenAI API key | Yes |
| `POLAR_ACCESS_TOKEN` | Polar.sh API access token | Yes |
| `POLAR_WEBHOOK_SECRET` | Polar.sh webhook secret | Yes |

## 🗄️ Database Models

### User
- `id`: Unique user identifier
- `name`: User's display name
- `email`: User's email address
- `status`: Subscription tier (`free_user` or `pro_user`)
- `image`: Profile image URL
- `emailVerified`: Email verification status

### Message
- `id`: Unique message identifier
- `type`: Message type (`RESULT` or `ERROR`)
- `role`: Message role (`USER`, `ASSISTANT`, or `SYSTEM`)
- `content`: Message content
- `userId`: Foreign key to User
- `createdAt`: Timestamp

### Usage
- `key`: User ID (primary key)
- `points`: Remaining usage points
- `expire`: Expiration timestamp

## 🔧 Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run Biome linter
- `pnpm format` - Format code with Biome

## 🎨 UI Components

The application uses a component-based architecture with:

- **Radix UI Primitives**: Accessible, unstyled components
- **Custom UI Components**: Built on top of Radix UI
- **LobeHub UI**: Pre-built AI chat components
- **Shimmer Effects**: Loading state animations
- **Auto-scrolling**: Conversation view with scroll-to-bottom

## 🔐 Security Features

- **Session-based Authentication**: Secure session management
- **Rate Limiting**: Prevents abuse with usage tracking
- **CSRF Protection**: Built into Better Auth
- **SQL Injection Prevention**: Prisma ORM parameterized queries
- **Environment Variables**: Sensitive data in `.env`

## 📈 Performance Optimizations

- **React Compiler**: Automatic React optimizations
- **Server Components**: Reduced client-side JavaScript
- **Streaming Responses**: Real-time token streaming
- **Query Prefetching**: tRPC query prefetching on server
- **Code Splitting**: Automatic with Next.js

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is private and proprietary.

## 🙏 Acknowledgments

- [Vercel AI SDK](https://sdk.vercel.ai/) for AI integration
- [Better Auth](https://www.better-auth.com/) for authentication
- [tRPC](https://trpc.io/) for type-safe APIs
- [Prisma](https://www.prisma.io/) for database ORM
- [Polar.sh](https://polar.sh/) for subscription management
- [Radix UI](https://www.radix-ui.com/) for accessible components

