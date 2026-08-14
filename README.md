# CoxBay Resort - Client

**Live Demo:** https://coxbay-client.vercel.app

---

## Project Overview

CoxBay Resort is a full-stack luxury resort room reservation platform built with a modern tech stack. The client is a Next.js 16 application (App Router) with React 19, TypeScript, and Tailwind CSS v4. It provides a seamless booking experience for customers and comprehensive dashboards for staff with role-based access control.

The application features a public-facing website with room browsing, facility exploration, and a checkout flow, alongside staff dashboards tailored to specific roles (Super Admin, Resort Manager, Room Manager, Booking Manager, Customer Support, Marketing Manager, Finance) and a customer dashboard for managing bookings, reviews, payments, and profile.

---

## Technologies

| Category | Technologies |
|----------|-------------|
| **Framework** | Next.js 16 (App Router), React 19 |
| **Language** | TypeScript 5 |
| **Styling** | Tailwind CSS v4 (PostCSS plugin) |
| **UI Components** | Custom components with Lucide React icons |
| **State Management** | React Context (AuthProvider) |
| **API Layer** | Custom fetch wrapper with auto token refresh |
| **Authentication** | JWT (access + refresh tokens in localStorage) |
| **Role-Based Access** | RBAC with permissions and role hierarchy |
| **Linting** | ESLint 9 with Next.js config |
| **Deployment** | Vercel |

---

## Installation & Setup

```bash
# Navigate to client directory
cd client

# Install dependencies
npm install

# Create environment file (copy from example if available)
cp .env.local.example .env.local  # or create manually
```

### Environment Variables

Create a `.env.local` file in the `client/` directory with the following:

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_BASE_URL` | Backend API base URL (must include `/api/v1`) | `http://localhost:5000/api/v1` |

**Example:**
```
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api/v1
```

> **Note:** The backend server must be running separately in the `server/` directory on port 5000.

---

## Local Development

```bash
# Start development server (port 3000)
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Run linter
npm run lint
```

The development server will be available at `http://localhost:3000`.

---

## User Roles & Responsibilities

| Role | Dashboard Path | Key Responsibilities |
|------|---------------|---------------------|
| **Super Admin** | `/admin/dashboard` | Full system access: staff management, all dashboards, resort settings, pricing, bookings, payments, refunds, amenities, facilities, room types, rooms, coupons, CMS, reviews |
| **Resort Manager** | `/resort-manager/dashboard` | Resort operations: bookings, customers, rooms, room types, amenities, facilities, coupons, reviews, resort settings, CMS, pricing, payments, refunds |
| **Room Manager** | `/room-manager/dashboard` | Room inventory: rooms, room types, amenities |
| **Booking Manager** | `/booking-manager/dashboard` | Booking operations: bookings, customers |
| **Customer Support** | `/customer-support/dashboard` | Guest support: customers, bookings, reviews |
| **Marketing Manager** | `/marketing-manager/dashboard` | Marketing: coupons, CMS content |
| **Finance** | `/finance/dashboard` | Financials: payments, refunds, pricing |
| **Customer** | `/customer/bookings` | Personal bookings, profile, notifications, reviews, payments, refunds |

> **Super Admin** bypasses all authorization checks. Staff roles are defined in `src/lib/auth/roles.ts`.

---

## Main Features

### Public Website
- **Home Page** — Hero section, featured rooms, offers/packages, facilities showcase, guest reviews, facilities directory, gallery
- **Rooms Listing** — Browse all active room types with filtering
- **Room Details** — Individual room view with images, amenities, pricing, and booking CTA
- **Facilities Page** — Complete list of resort facilities with descriptions and hours
- **Authentication** — Login, registration, Google OAuth callback
- **Checkout Flow** — Room selection → checkout → payment result page

### Customer Dashboard (`/customer/`)
- **Bookings** — View and manage personal bookings
- **Profile** — Update personal information
- **Notifications** — View system notifications
- **Reviews** — Submit and manage reviews
- **Payments** — View payment history
- **Refunds** — Track refund requests

### Staff Dashboards (Role-Scoped)

#### Super Admin (`/admin/dashboard/`)
- Staff management
- All resort manager features
- System-wide oversight

#### Resort Manager (`/resort-manager/dashboard/`)
- Bookings management
- Customer management
- Rooms & room types
- Amenities & facilities
- Coupons & promotions
- Reviews moderation
- Resort settings
- CMS content management
- Pricing rules
- Payments & refunds overview

#### Room Manager (`/room-manager/dashboard/`)
- Rooms management
- Room types management
- Amenities management

#### Booking Manager (`/booking-manager/dashboard/`)
- Bookings management
- Customer management

#### Customer Support (`/customer-support/dashboard/`)
- Customer management
- Bookings management
- Reviews management

#### Marketing Manager (`/marketing-manager/dashboard/`)
- Coupons management
- CMS content management

#### Finance (`/finance/dashboard/`)
- Payments management
- Refunds management
- Pricing rules

### Technical Features
- **JWT Authentication** with automatic token refresh on 401 responses
- **Role-Based Access Control (RBAC)** with permissions and role hierarchy
- **Server-Side Rendering** with Next.js App Router
- **Responsive Design** with Tailwind CSS v4
- **Skeleton Loading States** for all dashboard data tables
- **Optimistic UI Updates** where applicable
- **Type-Safe API Layer** with Zod-validated responses (via backend)

---

## Project Structure (Key Paths)

```
client/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── admin/              # Super Admin dashboard
│   │   ├── resort-manager/     # Resort Manager dashboard
│   │   ├── room-manager/       # Room Manager dashboard
│   │   ├── booking-manager/    # Booking Manager dashboard
│   │   ├── customer-support/   # Customer Support dashboard
│   │   ├── marketing-manager/  # Marketing Manager dashboard
│   │   ├── finance/            # Finance dashboard
│   │   ├── customer/           # Customer dashboard
│   │   ├── dashboard/          # Shared dashboard layouts
│   │   ├── rooms/              # Public room pages
│   │   ├── login/              # Authentication pages
│   │   ├── checkout/           # Booking checkout flow
│   │   ├── layout.tsx          # Root layout with AuthProvider
│   │   └── page.tsx            # Home page
│   ├── components/
│   │   ├── ui/                 # Reusable UI components
│   │   ├── layout/             # Navbar, Footer
│   │   ├── home/               # Home page sections
│   │   └── dashboard/          # Dashboard components & skeletons
│   ├── lib/
│   │   ├── api/                # API clients (auth, rooms, bookings, etc.)
│   │   ├── auth/               # Roles, permissions utilities
│   │   └── context/            # AuthContext (React Context)
│   └── globals.css             # Global styles + Tailwind
├── .env.local                  # Environment variables
├── package.json
├── tsconfig.json
├── next.config.ts
��── eslint.config.mjs
```

---

## API Integration

The client communicates with the Express + Prisma backend via a typed API layer in `src/lib/api/`. Each feature has its own module (e.g., `rooms.ts`, `bookings.ts`, `auth.ts`) exporting typed functions that return `ApiResponse<T>` with pagination metadata.

Authentication tokens are stored in `localStorage` and automatically attached to requests. On 401 responses, the client attempts a silent token refresh via `/auth/refresh-token`.

---

## Deployment

The client is deployed on **Vercel** at https://coxbay-client.vercel.app

Ensure the production `NEXT_PUBLIC_API_BASE_URL` points to your deployed backend API.