# SRMDOCSAFE AI - Frontend Architecture (Phase 4)

## 1. Complete Frontend Architecture
Built on **React 18** with **Vite** for blazing fast HMR.
- **Styling**: Tailwind CSS (Utility-first) for responsive, scalable, and dynamic dark mode design.
- **State Management**: Zustand (Minimalist, boilerplate-free state).
- **Routing**: React Router DOM v6 (Nested routes, layout preservation).
- **Network & Data Fetching**: Axios for API calls. (Future enhancement: React Query for caching).
- **Animations**: Framer Motion for premium, un-janky micro-interactions.
- **Forms**: React Hook Form + Zod for robust, schema-driven client-side validation.

## 2. UI Design Philosophy (SaaS Premium)
The goal is to feel like **Notion AI meets Perplexity**.
- **Colors**: Deep dark modes (`bg-slate-900`) layered with glassmorphic cards (`bg-white/5 backdrop-blur`). Light mode features clean whites and very soft grays.
- **Primary Color**: A vibrant indigo/violet (`#6366f1` / `#8b5cf6`) to denote "AI Magic".
- **Typography**: Inter (or similar neo-grotesque) for extreme legibility, tight tracking on headings for a modern tech feel.
- **Interactions**: Every button hover, route change, and modal open must feel *intentional* via Framer Motion. Smooth spring physics instead of linear CSS transitions.
- **Feedback**: Immediate skeleton loaders for pending data. Toast notifications for all async mutations. 

## 3. Component Hierarchy
```
src/
└── components/
    ├── ui/               (Atoms: Button, Input, Modal, Drawer, Toast, Skeleton)
    ├── shared/           (Molecules: Sidebar, Navbar, ProfileMenu, AI-ChatBubble)
    └── domain/           (Organisms: UploadArea, DocumentGrid, AnalyticsCharts)
```

## 4. Page Hierarchy
- **Public (`/`)**: Landing, Login, Signup.
- **Dashboard (`/app`)**:
  - `/app/dashboard` (Analytics widgets, quick actions)
  - `/app/documents` (Library grid/list)
  - `/app/documents/:id` (Viewer)
  - `/app/upload` (Upload Center)
  - `/app/chat` (Multi-doc RAG Chat interface)
  - `/app/notes` & `/app/quiz` (AI Generation outputs)
  - `/app/career` (Resume Builder & Insights)
  - `/app/settings` (Profile)

## 5. State Management Architecture (Zustand)
We split states logically to avoid unnecessary re-renders:
- `useAuthStore`: `user`, `token`, `isAuthenticated`, `login()`, `logout()`.
- `useDocumentStore`: `documents`, `isUploading`, `uploadProgress`, `fetchDocuments()`.
- `useChatStore`: `conversations`, `currentSessionId`, `isTyping`, `sendMessage()`.
- `useThemeStore`: `mode` ('dark' | 'light'), `toggleTheme()`.

## 6. Routing Architecture
We use a Layout-based routing strategy:
- `<PublicLayout>` wraps marketing/auth pages.
- `<ProtectedRoute>` intercepts unauthenticated users and redirects to `/login`.
- `<DashboardLayout>` wraps protected routes, providing the sticky Sidebar and Top Navbar.
