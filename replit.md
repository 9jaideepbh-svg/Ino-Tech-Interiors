# Inotech Interiors - Business Website

## Overview

A modern portfolio and inquiry website for Inotech Interiors, a company specializing in structural glazing, ACP cladding, and aluminum work with 20+ years of experience. The website showcases projects, services, and provides contact functionality with WhatsApp integration.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight alternative to React Router)
- **State Management**: TanStack React Query for server state
- **Styling**: Tailwind CSS with shadcn/ui component library
- **Animations**: Framer Motion for page transitions and interactive elements
- **Build Tool**: Vite with hot module replacement

### Backend Architecture
- **Runtime**: Node.js with Express
- **Language**: TypeScript with ES modules
- **API Design**: RESTful endpoints defined in `shared/routes.ts` with Zod validation
- **Authentication**: Replit Auth integration with OpenID Connect and Passport.js
- **Session Management**: PostgreSQL-backed sessions via connect-pg-simple

### Data Storage
- **Database**: PostgreSQL
- **ORM**: Drizzle ORM with type-safe schema definitions
- **Schema Location**: `shared/schema.ts` for business entities, `shared/models/auth.ts` for auth tables
- **Migrations**: Drizzle Kit with `db:push` command

### Project Structure
```
├── client/          # React frontend application
│   └── src/
│       ├── components/  # UI components including shadcn/ui
│       ├── pages/       # Route pages (Home, Projects, Contact, About)
│       ├── hooks/       # Custom React hooks
│       └── lib/         # Utilities and query client
├── server/          # Express backend
│   ├── routes.ts    # API route definitions
│   ├── storage.ts   # Database access layer
│   └── replit_integrations/  # Auth integration
├── shared/          # Shared code between client/server
│   ├── schema.ts    # Drizzle database schema
│   ├── routes.ts    # API contract definitions
│   └── models/      # Additional data models
└── migrations/      # Database migrations
```

### Key Design Patterns
- **Shared API Contracts**: Routes defined once in `shared/routes.ts` with Zod schemas for type safety across client and server
- **Repository Pattern**: `DatabaseStorage` class in `server/storage.ts` abstracts database operations
- **Component Composition**: shadcn/ui components provide consistent, customizable UI primitives

## External Dependencies

### Database
- **PostgreSQL**: Primary database accessed via `DATABASE_URL` environment variable
- **Drizzle ORM**: Type-safe database queries and schema management

### Authentication
- **Replit Auth**: OpenID Connect authentication via Replit's identity provider
- **Required Environment Variables**: `SESSION_SECRET`, `ISSUER_URL`, `REPL_ID`

### Third-Party Services
- **WhatsApp Business**: Direct link integration to `+91 9845284778` for customer inquiries
- **Google Fonts**: Playfair Display (headlines) and Lato (body text)

### UI Libraries
- **shadcn/ui**: Radix-based component library (accordion, dialog, dropdown, toast, etc.)
- **Framer Motion**: Animation library for transitions and interactions
- **Lucide React**: Icon library

### Build & Development
- **Vite**: Frontend bundler with React plugin
- **esbuild**: Server bundling for production
- **tsx**: TypeScript execution for development