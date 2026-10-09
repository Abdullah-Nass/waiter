# Waiter — Restaurant Ordering System

A real-time, bilingual (Arabic/English) restaurant ordering system built with Next.js 15, Socket.io, and PostgreSQL. Waiters take orders from a menu and send them to the kitchen instantly. Kitchen staff manage order progress in a live three-column board. Admins manage the menu and staff accounts.

---

## Features

### Roles

Three roles with layout-level route protection:

| Role        | Can do                                                                                                      |
| ----------- | ----------------------------------------------------------------------------------------------------------- |
| **WAITER**  | Browse menu, add items to cart, submit orders, view their order history with live status updates            |
| **KITCHEN** | View incoming orders in real time, move orders through SENT → IN_PROGRESS → READY, toggle item availability |
| **ADMIN**   | Observe everything and edit menu items (name, description, price), manage categories, manage staff accounts |

### Real-time

- New orders appear on the kitchen board instantly via Socket.io — no refresh needed
- Kitchen status changes (IN_PROGRESS / READY) notify the waiter as a toast alert anywhere in the app
- Menu item availability toggled by kitchen propagates live to all connected clients
- New-order sound on the kitchen board (with browser autoplay unlock on first interaction)

### i18n

- Full EN/AR support with `next-intl` and localized routing (`/en/...` · `/ar/...`)
- Automatic RTL/LTR layout switching
- Bilingual menu data stored at the DB level (`nameAr` / `nameEn`, `descAr` / `descEn`) — not just UI strings
- Per-page SEO metadata in both languages

### Other

- Cart persists across page refreshes via `localStorage` scoped to waiter ID
- Single Server Action atomically creates `Order` + `OrderItem` records on checkout
- All interactive elements have `aria-label` attributes
- Role-based protected layouts

---

## Tech Stack

| Layer     | Choice                                                  |
| --------- | ------------------------------------------------------- |
| Framework | Next.js 15 App Router                                   |
| Language  | TypeScript (strict)                                     |
| Styling   | Tailwind CSS                                            |
| Database  | PostgreSQL via Neon                                     |
| ORM       | Prisma 7                                                |
| Auth      | Better Auth (email/password)                            |
| Real-time | Socket.io on a custom Node.js server                    |
| State     | Zustand (per-request provider pattern) + TanStack Query |
| Forms     | React Hook Form + Zod                                   |
| i18n      | next-intl                                               |
| Testing   | Vitest + React Testing Library                          |

---

## Architecture decisions

### Role-based routing

Authentication and role redirection are handled in the `(protected)` layout — a single server component that checks the session and redirects unauthenticated users to `/login`. Authenticated users are redirected to their role's home page via a `ROLE_HOME` map (`ADMIN → /staff`, `WAITER → /menu`, `KITCHEN → /kitchen`), so no role can accidentally land on another role's default page. Individual pages do their own role checks for finer-grained access control.

---

## Testing

30+ automated tests written with **Vitest** and **React Testing Library**:

- **Zustand cart store** — isolated unit tests for `addItem`, `clearCart`, and cart totals
- **UI components** — bilingual, role-aware components tested with mocked hooks, covering rendering per role and per locale

---

## Project structure

```text
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
├── public/
│   └── sounds/
│       └── notification.mp3
├── src/
│   ├── app/
│   │   ├── [locale]/
│   │   │   ├── (auth)/                  # Login page + layout
│   │   │   │   ├── login/page.tsx
│   │   │   │   ├── layout.tsx
│   │   │   │   └── loading.tsx
│   │   │   ├── (protected)/             # All authenticated routes
│   │   │   │   ├── checkout/page.tsx
│   │   │   │   ├── kitchen/page.tsx
│   │   │   │   ├── menu/page.tsx
│   │   │   │   ├── my-orders/page.tsx   # Waiter order history
│   │   │   │   ├── staff/page.tsx       # Admin staff management
│   │   │   │   ├── layout.tsx           # Blocks unauthenticated users + redirects each role to their home page
│   │   │   │   └── loading.tsx
│   │   │   └── layout.tsx               # Root layout — NextIntlClientProvider
│   │   └── api/
│   │       ├── auth/[...all]/route.ts   # Better Auth handler
│   │       ├── menu/route.ts            # GET categories with items
│   │       ├── order/route.ts           # GET active orders for kitchen
│   │       └── staff/route.ts           # GET staff list
│   ├── components/
│   │   ├── auth/                        # Login form + logout
│   │   ├── checkout/                    # Cart list, cart items, checkout form
│   │   ├── common/                      # Navbar, language switcher, skeletons,
│   │   │                                # shared orders column + container, time-ago
│   │   ├── hooks/                       # use-kitchen-socket, use-waiter-socket,
│   │   │                                # use-page-title, use-unlock-audio
│   │   ├── kitchen/                     # Order card + status button
│   │   ├── menu/                        # Menu container, item drawer per role,
│   │   │                                # add/edit/delete modals for items and categories
│   │   ├── staff/                       # Staff table, add/delete staff modals
│   │   └── ui/                          # shadcn/ui primitives
│   ├── i18n/
│   │   ├── request.ts                   # next-intl server config
│   │   └── routing.ts                   # Locale routing definition
│   ├── lib/
│   │   ├── actions/                     # Server Actions
│   │   │   ├── admin.ts                 # Staff CRUD
│   │   │   ├── auth.ts                  # Sign in / sign out
│   │   │   ├── kitchen.ts               # Order status updates
│   │   │   ├── menu-items.ts            # Menu + category mutations
│   │   │   └── orders.ts                # Place order
│   │   ├── api/                         # Client-side fetch functions
│   │   │   ├── menu.ts
│   │   │   ├── order.ts
│   │   │   └── staff.ts
│   │   ├── prisma/db.ts                 # Prisma singleton
│   │   ├── socket/
│   │   │   ├── server.ts                # getIO() — used by Server Actions
│   │   │   └── client.ts                # getSocket() — singleton for client components
│   │   ├── stores/cart.ts               # Zustand cart store factory
│   │   ├── auth.ts                      # Better Auth config
│   │   ├── auth-client.ts               # Better Auth client
│   │   ├── permissions.ts               # ROLE_HOME map — ADMIN → /staff, WAITER → /menu, KITCHEN → /kitchen
│   │   ├── utils.ts
│   │   └── validation.ts                # Shared Zod schemas
│   ├── messages/
│   │   ├── en.json
│   │   └── ar.json
│   ├── providers/
│   │   ├── cart-provider.tsx            # Zustand per-request provider
│   │   └── query-provider.tsx           # TanStack Query provider
│   └── types/
│       ├── menu.d.ts
│       ├── socket.d.ts
│       └── types.ts
└── server.ts                            # Custom Node.js + Socket.io server
```

---

## Socket.io event reference

| Event                    | Direction             | Payload                            | Trigger                      |
| ------------------------ | --------------------- | ---------------------------------- | ---------------------------- |
| `order:new`              | Server → Kitchen room | `order` object                     | Waiter submits order         |
| `order:updated`          | Server → All clients  | `{ orderId, status }`              | Kitchen changes status       |
| `order:statusChanged`    | Server → Waiter room  | `{ orderId, tableNumber, status }` | Kitchen changes status       |
| `menu:item-availability` | Server → All clients  | `{ id, available }`                | Kitchen toggles availability |
