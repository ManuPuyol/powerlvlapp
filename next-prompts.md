Design the folder and architecture structure for a Next.js App Router project
for a social marketplace with:
- Public pages
- Auth
- Dashboard
- Trainer profiles
- Real-time chat

Include:
- app/ structure
- lib/
- services/
- components/
- types/
Explain briefly the responsibility of each folder.





Design the core domain model for the app.

We have:
- Users
- Trainers
- Clients
- Training plans
- Diet plans
- Contracts between client and trainer
- Messages (chat)
- Reviews

Return:
- Entity list
- Relationships
- Which tables belong to auth vs app domain



Generate the PostgreSQL schema for Supabase for the domain model.
Include:
- Tables
- Primary keys
- Foreign keys
- Indexes
- Timestamps
Use UUIDs.
Assume Supabase auth.users table exists.




Write Row Level Security (RLS) policies for Supabase:
- Users can only read/write their own private data
- Trainer profiles are public
- Contracts only visible to involved users
- Messages only visible to conversation members
Explain each policy.



Implement Supabase authentication in Next.js App Router.
Include:
- Login page
- Register page
- Protected routes
- Session handling
- Middleware for auth guard
Use server components where possible.



Implement public trainer profile pages with SEO.
Each trainer has:
- username in URL
- bio
- specialties
- price
Use SSG or ISR.
Explain which rendering strategy is best and why.



Implement trainer listing with:
- Search
- Filters (price, specialty)
- Pagination
Data comes from Supabase.
Optimized for performance.



Design the flow for a client hiring a trainer.
Include:
- Contract creation
- Status (pending, active, cancelled)
- Permissions
- API calls
- Database changes if needed



Implement real-time chat using Supabase Realtime.
Features:
- Conversations
- Messages
- Realtime subscription
- Optimistic UI
Explain architecture and give code example.



Design trainer dashboard:
- List active clients
- Assign training plans
- View progress
- Send messages
Use Next.js server components + Supabase.



Integrate Stripe payments for trainer subscriptions.
Include:
- Checkout flow
- Webhooks
- Supabase integration
- Contract activation on payment success



MVP 1:
- Auth
- Perfiles públicos
- Chat
- Contrato manual

MVP 2:
- Rutinas
- Dietas
- Seguimiento

MVP 3:
- Pagos
- Reviews
- Notificaciones

MVP 4:
- Feed social
- Likes
- Stories
