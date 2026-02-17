# Next.js App Router - Social Marketplace Architecture

## Project Structure

```
├── app/                          # Next.js App Router (routes + layouts)
│   ├── (auth)/                   # Auth route group (shared layout)
│   │   ├── login/
│   │   ├── signup/
│   │   └── layout.tsx            # Auth-specific layout (centered, no nav)
│   │
│   ├── (public)/                 # Public route group
│   │   ├── page.tsx              # Landing page
│   │   ├── trainers/
│   │   │   ├── page.tsx          # Trainer directory
│   │   │   └── [id]/
│   │   │       └── page.tsx      # Public trainer profile
│   │   ├── about/
│   │   └── layout.tsx            # Public layout (header, footer)
│   │
│   ├── (dashboard)/              # Protected route group
│   │   ├── dashboard/
│   │   │   ├── page.tsx          # Main dashboard
│   │   │   ├── bookings/
│   │   │   ├── messages/
│   │   │   └── settings/
│   │   ├── trainer/              # Trainer-specific routes
│   │   │   ├── profile/
│   │   │   ├── clients/
│   │   │   └── earnings/
│   │   └── layout.tsx            # Dashboard layout (sidebar, auth check)
│   │
│   ├── api/                      # API routes
│   │   ├── webhooks/
│   │   │   └── stripe/
│   │   └── upload/
│   │
│   ├── actions/                  # Server Actions
│   │   ├── auth.ts
│   │   ├── bookings.ts
│   │   ├── messages.ts
│   │   └── profiles.ts
│   │
│   ├── layout.tsx                # Root layout
│   ├── globals.css
│   └── providers.tsx             # Client-side providers
│
├── components/                   # React components
│   ├── ui/                       # Shadcn/base UI components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   └── ...
│   │
│   ├── auth/                     # Auth-specific components
│   │   ├── login-form.tsx
│   │   ├── signup-form.tsx
│   │   └── auth-guard.tsx
│   │
│   ├── dashboard/                # Dashboard components
│   │   ├── sidebar.tsx
│   │   ├── stats-card.tsx
│   │   └── recent-bookings.tsx
│   │
│   ├── trainers/                 # Trainer-related components
│   │   ├── trainer-card.tsx
│   │   ├── trainer-filters.tsx
│   │   └── booking-modal.tsx
│   │
│   ├── chat/                     # Real-time chat components
│   │   ├── chat-list.tsx
│   │   ├── chat-window.tsx
│   │   ├── message-input.tsx
│   │   └── message-bubble.tsx
│   │
│   └── shared/                   # Shared/common components
│       ├── header.tsx
│       ├── footer.tsx
│       ├── avatar.tsx
│       └── loading-spinner.tsx
│
├── lib/                          # Core utilities & configs
│   ├── supabase/
│   │   ├── client.ts             # Client-side Supabase client
│   │   ├── server.ts             # Server-side Supabase client
│   │   ├── middleware.ts         # Auth middleware
│   │   └── types.ts              # Generated DB types
│   │
│   ├── validations/              # Zod schemas
│   │   ├── auth.ts
│   │   ├── booking.ts
│   │   └── profile.ts
│   │
│   ├── utils/
│   │   ├── cn.ts                 # Tailwind class merger
│   │   ├── date.ts               # Date formatting
│   │   └── currency.ts           # Price formatting
│   │
│   └── constants.ts              # App-wide constants
│
├── services/                     # Business logic layer
│   ├── auth.service.ts           # Auth operations
│   ├── booking.service.ts        # Booking CRUD + logic
│   ├── message.service.ts        # Chat/messaging logic
│   ├── payment.service.ts        # Stripe integration
│   ├── profile.service.ts        # User/trainer profiles
│   ├── notification.service.ts   # Push/email notifications
│   └── storage.service.ts        # File upload/download
│
├── types/                        # TypeScript types
│   ├── database.ts               # Supabase generated types
│   ├── models.ts                 # Domain models
│   ├── api.ts                    # API request/response types
│   └── index.ts                  # Type exports
│
├── hooks/                        # Custom React hooks (UI logic only)
│   ├── use-user.ts               # Access user from context
│   ├── use-chat-subscription.ts  # Subscribe to realtime updates
│   ├── use-optimistic.ts         # Optimistic UI updates
│   └── use-form-state.ts         # Form state management
│
├── config/                       # Configuration files
│   ├── site.ts                   # Site metadata
│   └── navigation.ts             # Nav menu configs
│
├── supabase/                     # Supabase migrations & seeds
│   ├── migrations/
│   └── seed.sql
│
├── public/                       # Static assets
│   ├── images/
│   └── icons/
│
├── middleware.ts                 # Next.js middleware (auth)
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

## Folder Responsibilities

### `/app` - Next.js App Router
- **Route groups** `(auth)`, `(public)`, `(dashboard)` organize routes with shared layouts
- Each folder = a route segment
- `layout.tsx` = shared UI for route group
- `page.tsx` = actual page component
- `/actions` = Server Actions for mutations (form submissions, data updates)

### `/components` - React Components
- **Feature-based organization** (auth, dashboard, trainers, chat)
- `/ui` = reusable primitive components (buttons, cards, dialogs)
- `/shared` = components used across multiple features
- Client Components when needed (interactivity, hooks)

### `/lib` - Core Utilities & Configuration
- **Supabase clients** (client-side vs server-side)
- **Validations** (Zod schemas for type-safe forms)
- **Utils** (helpers, formatters, class name mergers)
- Low-level, framework-agnostic code

### `/services` - Business Logic Layer
- **Single responsibility** per service
- Database queries + business rules
- Called from Server Actions or Server Components
- Keeps components thin, logic testable
- Example: `booking.service.ts` handles availability checks, conflict detection, booking creation

### `/types` - TypeScript Definitions
- **database.ts** = generated from Supabase schema
- **models.ts** = domain models (User, Trainer, Booking)
- **api.ts** = request/response shapes
- Centralized type definitions

### `/hooks` - Custom React Hooks (UI Logic Only)
- **NO database access** - hooks should NOT call services directly
- UI state management, form handling, optimistic updates
- Subscribe to real-time events (but data fetching happens in Server Components)
- Example: `use-chat-subscription.ts` subscribes to Supabase realtime, but initial data comes from Server Component

### `/config` - App Configuration
- Site metadata, navigation menus
- Environment-agnostic settings
- Easy to modify without touching code

## Key Patterns

1. **Route Groups** - Organize routes with shared layouts without affecting URLs
2. **Server Actions** - Type-safe mutations, no API routes needed for most cases
3. **Service Layer** - Business logic separated from UI, easily testable
4. **Type Safety** - Generated types from Supabase, Zod validation
5. **Feature Folders** - Components organized by feature, not by type

## Data Flow

```
User Interaction
    ↓
Client Component
    ↓
Server Action (app/actions)
    ↓
Service Layer (services/)
    ↓
Supabase (lib/supabase)
    ↓
Database
```

**OR for reads:**

```
Server Component
    ↓
Service Layer (services/)
    ↓
Supabase (lib/supabase)
    ↓
Database
    ↓
Props to Client Component
    ↓
Hooks (UI state only)
```

**Hooks responsibility:**
- ✅ Local UI state (modals, forms, toggles)
- ✅ Subscribe to realtime updates (data already loaded)
- ✅ Optimistic UI updates
- ❌ NO database queries
- ❌ NO service calls
- ❌ NO data fetching

This structure scales from MVP to production while keeping code organized and maintainable.
