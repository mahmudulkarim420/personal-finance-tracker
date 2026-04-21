# 💎 Obsidian Lens

**Private Wealth Management & Admin Analytics**

An elite personal finance solution built with modern technology and premium Glassmorphism design. Tracks income/expense and provides a powerful system monitoring dashboard for administrators.

---

## 🌟 Project Highlights

| Section                | Key Features                                                                        |
| ---------------------- | ----------------------------------------------------------------------------------- |
| **Personal Dashboard** | Real-time expense tracking, budget velocity analytics, interactive charts           |
| **Admin Control**      | Full system overview, user activity monitoring, server-side data analytics          |
| **Budgeting Engine**   | Intelligent category-based budgeting with auto-revalidation and overflow alerts     |
| **Manual Injection**   | Advanced transaction modal with dynamic category syncing and income/expense toggles |
| **Command Bar (⌘K)**   | Lightning-fast navigation and global search functionality                           |

---

## 🛠️ Tech Stack

### Core Architecture

- **Next.js 15** (App Router) - Server-side efficiency and seamless routing
- **Prisma ORM** - Type-safe database operations and scalable schema management
- **PostgreSQL** - Relational data storage for financial integrity
- **Clerk Auth** - Secure, enterprise-grade user management and role-based access

### Frontend & UI/UX

- **Tailwind CSS** - Professional-grade styling with custom "Obsidian" dark theme
- **Framer Motion** - Smooth hardware-accelerated animations and transitions
- **Lucide Icons** - Minimalist and consistent iconography
- **Sonner** - Modern, non-intrusive toast notifications

---

## 📂 System Architecture

```
src/
├── app/               # Dashboard, Admin, and Auth route groups
├── actions/           # Server Actions for Budgets, Transactions, and Admin
├── components/        # Dynamic UI components (Sidebar, Modals, Charts)
├── lib/               # Shared utilities (Prisma client, Clerk helper)
├── hooks/             # Custom React hooks for global state & role-checking
├── schema/            # Zod validation schemas
├── types/             # TypeScript type definitions
└── prisma/            # Database schemas (User, Budget, Transaction, Goal)
```

---

## 🚀 Installation & Setup

### 1. Clone & Install

```bash
git clone https://github.com/mahmudulkarim420/personal-finance-tracker.git
cd personal-finance-tracker
pnpm install
```

### 2. Environment Configuration

Create a `.env` file and add your credentials:

```env
DATABASE_URL="your_postgresql_url"
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="your_clerk_publishable_key"
CLERK_SECRET_KEY="your_clerk_secret_key"
```

### 3. Database Migration

```bash
npx prisma generate
npx prisma db push
```

### 4. Start Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

---

## 🛡️ Admin Capabilities

- **User Management** - View all registered users and their financial health
- **Global Stats** - Real-time data aggregation across the entire platform
- **Role Protection** - Exclusive access to admin routes via Clerk metadata validation

---

## 🎨 Design Philosophy

**Obsidian Theme:** A sophisticated dark palette with emerald and purple accents, featuring glassmorphism effects and fluid animations for a premium wealth management experience.

---

## 👨‍💻 Developer

**Mahmudul Karim** - Full Stack Developer | Next.js & MERN Specialist

---

_Built with precision for modern financial tracking._
