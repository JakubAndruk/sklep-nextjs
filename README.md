# DevstockHub

A full-stack e-commerce web application for computer peripherals, built with Next.js (App Router), Prisma, and PostgreSQL. Developed as a credit project ("Praca zaliczeniowa 3").

## Tech Stack

- **Framework:** Next.js (App Router, Server Components + Client Components)
- **Database:** PostgreSQL, running locally via Docker Compose
- **ORM:** Prisma
- **Authentication:** NextAuth.js (session-based auth, custom `auth.ts` config)
- **Forms & Validation:** react-hook-form, Zod
- **Styling:** Tailwind CSS
- **State Management:** React Context (Cart, Notifications)

## Features

- Browsable product catalog with category (multi-select) and price-range filtering, sorting (newest, price ascending/descending), and pagination
- Product detail pages with an image gallery, expandable/collapsible description, breadcrumb navigation, and a randomized delivery-date estimate
- Home page with a category carousel (Hero section), category grid, and horizontally scrollable rows for recommended products and brands
- Global cart system backed by the database, with quantity editing, per-item notes, item removal, and a running order summary
- Full checkout flow: address selection (with a new-address form), shipping and payment method selection, and order summary, tied to the authenticated user and their cart
- User authentication (login/register) with field validation, unique email enforcement, and protected routes for all pages except login/register
- User profile page with account details, transaction/order history, and logout
- Order confirmation and order detail views
- Toast-style notification system shown consistently across all pages (e.g. on "add to cart", auth success/failure)
- Rate limiting on sensitive API routes
- Deployed on Vercel with a production PostgreSQL database

## Project Structure

```
src/
  auth.ts                    # NextAuth configuration
  proxy.ts                   # Route protection / middleware logic

  app/
    layout.tsx                # Root layout: SessionProvider, NotificationProvider, CartProvider
    page.tsx                  # Home page (Server Component)
    not-found.tsx
    products/
      page.tsx                # Product listing (filters via searchParams)
      loading.tsx
      [id]/page.tsx            # Product detail page
    cart/page.tsx
    checkout/page.tsx
    orders/[id]/page.tsx
    profile/page.tsx
    login/page.tsx
    register/page.tsx
    contact/page.tsx
    api/
      products/                 # GET list, GET :id, GET recommended
      categories/                # GET /api/categories
      brands/                    # GET /api/brands
      user/[id]/                 # GET /api/user/:id
      cart/                      # Cart CRUD + /api/cart/[itemId]
      addresses/                 # Address CRUD + /api/addresses/[id]
      orders/                    # Order creation/history + /api/orders/[id]
      auth/
        register/                 # POST /api/auth/register
        [...nextauth]/            # NextAuth handler

  components/
    layout/                   # Header, Footer, Main
    home/                     # HeroSection, CategoryGrid, RecommendationSection, BrandGrid
    filters/                  # CategoryFilter, PriceFilter, SortAndShow, Pagination
    products/                 # ProductCard, ProductPurchasePanel, ProductGallery, ExpandableDescription, ShippingInfo
    cart/                     # CartItemDetails, CartItemRow, CartSummary, CartPageClient, NoteEditor
    checkout/                 # AddressSelector, CheckoutSummary, CheckoutOrderItems, PaymentMethodCard, ShippingCard
    forms/                    # LoginForm, RegisterForm, NewAddressForm, FormField, CheckboxField, CountrySelect
    profile/                  # ProfileSidebar, TransactionList
    orders/                   # OrderSummaryCard
    icons/                    # UI, category, and payment-method icon components
    ui/                       # RevealRow, Select, Button, Input, Notification, Breadcrumb, shared primitives

  context/
    CartContext.tsx           # Cart state, backed by /api/cart
    NotificationContext.tsx   # Global toast notification queue

  hooks/
    useAsyncAction.ts         # Shared async/loading state wrapper
    useOverflowCheck.ts       # Detects horizontal overflow for scrollable rows
    useDebouncedCallback.ts   # Debounces rapid input (e.g. price filter)

  lib/
    db/                       # Prisma data access: products, categories, brands, cart, orders, addresses, users, pricing
    api/                      # Client-side fetch wrappers: cart, orders, addresses, shared http-client
    validators/               # Zod schemas: products, cart, orders, address, auth
    constants/                # countries, paymentMethods
    utils/                    # format.ts, response.ts, rateLimit.ts

  generated/prisma/            # Prisma Client output (generated, not hand-edited)

  types/                       # Shared TypeScript types, next-auth type augmentation

prisma/
  schema.prisma                # Product, Category, User, Order, OrderItem, Brand, Address models
  seed.ts                       # Seed script for initial data

docker-compose.yml              # Local PostgreSQL instance
.env                             # Environment variables
```

## Data Model

Core Prisma entities:

- **Product** — id, name, description, price, stock, imageUrl, categoryId (FK), brandId (FK), colors, images
- **Category** — id, name, description, image, exploreInfo
- **Brand** — id, name, logoUrl
- **User** — id, firstName, email (unique), passwordHash, addresses
- **Address** — id, userId (FK), address fields (used at checkout)
- **Order** — id, userId (FK), createdAt, status, totalAmount
- **OrderItem** — id, orderId (FK), productId (FK), quantity, priceAtPurchase

## Getting Started

### Prerequisites

- Node.js 18+
- Docker (for the local PostgreSQL instance)

### 1. Clone and install

```bash
git clone <repository-url>
cd sklep-nextjs
npm install
```

### 2. Environment variables

Create a `.env` file in the project root:

```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/devstockhub"
NEXTAUTH_SECRET="your-generated-secret"
NEXTAUTH_URL="http://localhost:3000"
```

### 3. Start the database

```bash
docker-compose up -d
```

### 4. Run Prisma migrations and seed the database

```bash
npx prisma migrate dev
npx prisma db seed
```

### 5. Run the development server

```bash
npm run dev
```

The app will be available at [http://localhost:3000](http://localhost:3000).

## Test Account

The seed script creates a ready-to-use test account so you can log in immediately without registering:

| Field        | Value            |
| ------------ | ---------------- |
| Email        | test@example.com |
| Phone number | +48123456789     |
| Password     | Password123      |

Go to `/login` and sign in with the email and password above. This account is created by `prisma/seed.ts`, so it is only available after running `npx prisma db seed` against your database (local or production).

## API Overview

| Endpoint                    | Method     | Description                                               |
| --------------------------- | ---------- | --------------------------------------------------------- |
| `/api/products`             | GET        | List products (category, price, sort, pagination filters) |
| `/api/products/:id`         | GET        | Get full product detail                                   |
| `/api/products/recommended` | GET        | Get randomized recommended products across categories     |
| `/api/categories`           | GET        | List all categories                                       |
| `/api/brands`               | GET        | List all brands                                           |
| `/api/user/:id`             | GET        | Get user profile data                                     |
| `/api/cart`                 | GET        | Get the authenticated user's cart                         |
| `/api/cart`                 | POST       | Add a product (with quantity/color) to the cart           |
| `/api/cart`                 | DELETE     | Remove multiple cart items by id (used before checkout)   |
| `/api/cart/:itemId`         | PATCH      | Update a cart item's quantity or note                     |
| `/api/cart/:itemId`         | DELETE     | Remove a single cart item                                 |
| `/api/addresses`            | GET        | List the authenticated user's addresses                   |
| `/api/addresses`            | POST       | Create a new address                                      |
| `/api/addresses/:id`        | PATCH      | Update an existing address                                |
| `/api/addresses/:id`        | DELETE     | Delete an address                                         |
| `/api/orders`               | GET        | Get the authenticated user's order history                |
| `/api/orders`               | POST       | Create an order from the current cart (checkout)          |
| `/api/orders/:id`           | GET        | Get a single order's detail                               |
| `/api/auth/register`        | POST       | Register a new user (unique email enforced)               |
| `/api/auth/[...nextauth]`   | GET / POST | NextAuth session/login handlers                           |

All endpoints except `/api/auth/register` and `/api/auth/[...nextauth]` require an authenticated session (checked via `auth()` from `@/auth`) and return `401 Unauthorized` otherwise. Responses are wrapped in a consistent `apiSuccess`/`apiError` shape (`lib/utils/response.ts`).

## Deployment

The application is deployed on Vercel, connected to a hosted PostgreSQL database. The seed script is run against the production database to populate initial catalog data.

- **Live app:** https://sklep-nextjs-one.vercel.app/
- **Source code:** https://github.com/JakubAndruk/sklep-nextjs/tree/next-js-store

## Notes

- All product, category, and brand images are hosted externally (e.g. via imgbb.com); only their URLs are stored in the database.
- Route protection is handled in `proxy.ts`; every route except `/login` and `/register` requires an authenticated session.
- Cart data is fully managed server-side; the client never computes totals or persists cart state locally.
- Sensitive API routes are rate-limited via `lib/utils/rateLimit.ts`.
