# BrightPath CRM — Master Execution Plan & Project Context

> **Project Stack**: React 18+ • TypeScript • Vite • Supabase (PostgreSQL & Auth) • Git / GitHub • Vercel  
> **Target Business**: BrightPath Academy (Fictional Coaching Institute)  
> **Development Model**: Feature-by-Feature Lifecycle:  
> `Develop ➔ Test Locally ➔ Verify ➔ Stage / Deploy ➔ Retest Live ➔ Next Feature`

---

## 1. Project Status Tracker

| Phase | Module / Feature Focus | Status | Git Milestone | Deployed / Verified |
| :---: | :--- | :---: | :--- | :---: |
| **0** | Project & Environment Inspection | ✅ **Completed** | — | Verified clean state |
| **1** | Project Scaffolding & Visual Shell | ✅ **Completed** | `feat: phase 1 - scaffolding & layout` | Localhost (Vite dev server) |
| **2** | Supabase Client & Env Validation | ✅ **Completed** | `feat: phase 2 - supabase client & env` | Localhost (Vite dev server) |
| **3** | Database Migrations, RLS & Seed SQL | ⏳ **Pending** | `feat: phase 3 - database migrations & rls` | Supabase SQL Editor |
| **4** | Authentication, Profiles & Role Lifecycle | ⏳ **Pending** | `feat: phase 4 - auth & role guards` | Localhost / Supabase |
| **5** | Lead Management & Status Workflow | ⏳ **Pending** | `feat: phase 5 - lead management` | Localhost / Supabase |
| **6** | Follow-Up Engine & Overdue Detection | ⏳ **Pending** | `feat: phase 6 - follow-ups & overdue` | Localhost / Supabase |
| **7** | Activity History & Audit Trail | ⏳ **Pending** | `feat: phase 7 - activity history` | Localhost / Supabase |
| **8** | Reconciled Dashboard & Visual Reports | ⏳ **Pending** | `feat: phase 8 - dashboard & kpis` | Localhost / Supabase |
| **9** | Responsive Polish, Accessibility & Errors | ⏳ **Pending** | `feat: phase 9 - a11y & error states` | Localhost |
| **10**| Production Build, GitHub Sync & Vercel | ⏳ **Pending** | `feat: phase 10 - vercel deployment` | Production Vercel URL |

---

## 2. Phase-by-Phase Execution Details

---

### Phase 1: Project Scaffolding & Visual Foundation

#### Scope & Objectives
Initialize the React 18+ TypeScript application using Vite inside the project repository, set up local Git version control, establish the design system tokens, and implement the persistent responsive application shell.

#### Where & How
- **Directory**: `d:\AI documents\brightpath_crm`
- **Files to Create**:
  - `package.json`, `tsconfig.json`, `vite.config.ts`, `index.html`
  - `.gitignore` (ignoring `node_modules`, `dist`, `.env`, `.env.local`, `*.local`)
  - `src/index.css` (Tailored design system: deep navy `#0f172a`, slate `#1e293b`, royal blue `#2563eb`, neutral accents, status colors, micro-transitions)
  - `src/components/layout/Sidebar.tsx` (Desktop sidebar navigation)
  - `src/components/layout/TopBar.tsx` (Header bar with user profile placeholder and action controls)
  - `src/components/layout/MobileNav.tsx` (Collapsible mobile navigation drawer)
  - `src/components/layout/AppLayout.tsx` (Unified application frame with `<Outlet />`)
  - `src/pages/DashboardPage.tsx`, `LeadsPage.tsx`, `FollowUpsPage.tsx`, `SettingsPage.tsx` (Page shells)
  - `src/App.tsx`, `src/main.tsx`

#### Step-by-Step Flow
1. Run `git init` in `brightpath_crm`.
2. Scaffold React + TypeScript with Vite.
3. Install dependencies: `react-router-dom`, `lucide-react`.
4. Establish core design variables in `src/index.css`.
5. Configure `react-router-dom` in `src/App.tsx` with routes:
   - `/` $\rightarrow$ Dashboard
   - `/leads` $\rightarrow$ Leads List
   - `/follow-ups` $\rightarrow$ Follow-up Planner
   - `/settings` $\rightarrow$ User Settings
6. Build `AppLayout` with responsive sidebar and header.

#### Local Testing Checklist
- [ ] Run `npm run dev` and confirm Vite starts without warnings.
- [ ] Test navigation links; verify active state highlighting and zero full-page reloads.
- [ ] Test responsive viewports (Desktop 1440px, Tablet 768px, Mobile 375px).
- [ ] Run `npm run build` to confirm zero TypeScript compilation errors.

#### Git Milestone
```bash
git add .
git commit -m "feat: phase 1 - project scaffolding, visual foundation and navigation shell"
```

---

### Phase 2: Supabase Client Setup & Environment Validation

#### Scope & Objectives
Establish a robust, single-instance Supabase client module that validates required environment variables at runtime and provides an informative setup screen if credentials are not yet configured.

#### Where & How
- **Files to Create**:
  - `.env.example` (Template with placeholder values)
  - `.env` (Local gitignored file for credentials)
  - `src/lib/supabaseClient.ts` (Client factory with URL/Key validation)
  - `src/components/common/ConfigWarningBanner.tsx` (Graceful onboarding fallback component)

#### Step-by-Step Flow
1. Install `@supabase/supabase-js`.
2. Create `.env.example` containing:
   ```env
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-public-client-anon-key
   ```
3. Implement `src/lib/supabaseClient.ts` checking `import.meta.env.VITE_SUPABASE_URL` and `import.meta.env.VITE_SUPABASE_ANON_KEY`.
4. If missing, render an informative developer onboarding screen detailing how to acquire keys from the Supabase dashboard rather than crashing.
5. Verify `.env` is properly excluded by `.gitignore`.

#### Local Testing Checklist
- [ ] Verify application loads fallback configuration guide when `.env` is absent or incomplete.
- [ ] Verify valid keys initialize `supabase` client successfully.
- [ ] Confirm `git status` does not track `.env`.

#### Git Milestone
```bash
git add .
git commit -m "feat: phase 2 - supabase client and environment validation"
```

---

### Phase 3: Database Schema, Migrations & Row Level Security (RLS)

#### Scope & Objectives
Formulate the full PostgreSQL relational schema with UUID primary keys, foreign keys, check constraints, database indexes, role-based RLS policies, and safe seed data.

#### Where & How
- **Files to Create**:
  - `supabase/migrations/20261025_001_initial_schema.sql` (Tables: `profiles`, `leads`, `follow_ups`, `activities`)
  - `supabase/migrations/20261025_002_row_level_security.sql` (RLS policies for `counsellor`, `manager`, `admin`)
  - `supabase/migrations/20261025_003_seed_data.sql` (Fictional institute demo data)
  - `src/types/database.types.ts` (Full TypeScript interfaces)

#### Relational Data Model
1. **`profiles`**:
   - `id`: `UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE`
   - `full_name`: `TEXT NOT NULL`
   - `role`: `TEXT NOT NULL CHECK (role IN ('admin', 'manager', 'counsellor')) DEFAULT 'counsellor'`
   - `created_at`, `updated_at`: `TIMESTAMPTZ NOT NULL DEFAULT NOW()`
2. **`leads`**:
   - `id`: `UUID PRIMARY KEY DEFAULT gen_random_uuid()`
   - `full_name`: `TEXT NOT NULL`
   - `email`: `TEXT`
   - `phone`: `TEXT NOT NULL`
   - `course_interest`: `TEXT NOT NULL`
   - `source`: `TEXT NOT NULL` (Website, Referral, Walk-in, Social Media)
   - `status`: `TEXT NOT NULL CHECK (status IN ('New', 'Contacted', 'Qualified', 'Converted', 'Lost')) DEFAULT 'New'`
   - `loss_reason`: `TEXT` (Mandatory if `status = 'Lost'`)
   - `notes`: `TEXT`
   - `assigned_to`: `UUID REFERENCES profiles(id) ON DELETE SET NULL`
   - `created_by`: `UUID REFERENCES profiles(id) ON DELETE SET NULL`
   - `created_at`, `updated_at`: `TIMESTAMPTZ NOT NULL DEFAULT NOW()`
3. **`follow_ups`**:
   - `id`: `UUID PRIMARY KEY DEFAULT gen_random_uuid()`
   - `lead_id`: `UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE`
   - `assigned_to`: `UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE`
   - `due_at`: `TIMESTAMPTZ NOT NULL`
   - `note`: `TEXT NOT NULL`
   - `status`: `TEXT NOT NULL CHECK (status IN ('pending', 'completed', 'cancelled')) DEFAULT 'pending'`
   - `completed_at`: `TIMESTAMPTZ`
   - `created_by`: `UUID REFERENCES profiles(id) ON DELETE SET NULL`
   - `created_at`: `TIMESTAMPTZ NOT NULL DEFAULT NOW()`
4. **`activities`**:
   - `id`: `UUID PRIMARY KEY DEFAULT gen_random_uuid()`
   - `lead_id`: `UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE`
   - `actor_id`: `UUID REFERENCES profiles(id) ON DELETE SET NULL`
   - `activity_type`: `TEXT NOT NULL` (`lead_created`, `status_changed`, `note_added`, `follow_up_scheduled`, `follow_up_completed`)
   - `description`: `TEXT NOT NULL`
   - `metadata`: `JSONB DEFAULT '{}'::jsonb`
   - `created_at`: `TIMESTAMPTZ NOT NULL DEFAULT NOW()`

#### RLS Policy Specifications
- **`profiles`**: All authenticated users can view staff names; users can only update their own `full_name`. Direct modification of `role` is forbidden by RLS.
- **`leads`**:
  - Counsellor: `SELECT`, `INSERT`, `UPDATE` where `assigned_to = auth.uid() OR created_by = auth.uid()`.
  - Manager / Admin: `SELECT`, `INSERT`, `UPDATE` on all rows.
- **`follow_ups` & `activities`**: Access permitted only if the user has access to the underlying `lead_id`.

#### Local / Remote Testing Checklist
- [ ] Apply migration in Supabase SQL Editor; verify all 4 tables appear with proper columns and constraints.
- [ ] Test status constraint violation (e.g. inserting status `'Unknown'`); verify Postgres error.
- [ ] Verify RLS enabled on all 4 tables.

#### Git Milestone
```bash
git add .
git commit -m "feat: phase 3 - database schema, migrations, rls policies and types"
```

---

### Phase 4: Authentication, Profile Synchronization & Role Guards

#### Scope & Objectives
Implement user sign-in, sign-out, session restoration, auto-provisioning of `profiles` rows upon user creation, and role-based route protection.

#### Where & How
- **Files to Create / Modify**:
  - `src/features/auth/AuthContext.tsx` (Session and user profile state management)
  - `src/features/auth/LoginPage.tsx` (Sign-in form with email/password validation)
  - `src/components/auth/ProtectedRoute.tsx` (Client-side route guard)
  - `src/services/authService.ts` (API methods for signIn, signOut, getProfile)

#### Step-by-Step Flow
1. Implement `AuthContext` to manage `session`, `profile`, `loading`, and `role`.
2. Automatically synchronize/insert a default `profiles` row (`role = 'counsellor'`) upon initial authentication.
3. Build `LoginPage` with input validation, password toggle, and error alert banners.
4. Integrate `ProtectedRoute` to wrap private routes (`/`, `/leads`, `/follow-ups`).
5. Add user indicator and Sign Out button in `TopBar`.

#### Local Testing Checklist
- [ ] Sign in with valid user; verify redirect to Dashboard and profile name rendered in header.
- [ ] Test invalid password; verify clean error message without crash.
- [ ] Test session persistence across full browser refresh.
- [ ] Sign out; verify immediate redirect to `/login` and cache purge.

#### Git Milestone
```bash
git add .
git commit -m "feat: phase 4 - authentication, profile sync and role guards"
```

---

### Phase 5: Lead Management & Status Workflow

#### Scope & Objectives
Implement the complete student enquiry management lifecycle: search, multi-faceted filtering, sorting, lead creation, editing, and status updates (with mandatory loss reason).

#### Where & How
- **Files to Create**:
  - `src/services/leadsService.ts` (Typed Supabase CRUD operations)
  - `src/features/leads/LeadsListPage.tsx` (Main view)
  - `src/features/leads/LeadTable.tsx` (Data table with sortable columns and status badges)
  - `src/features/leads/LeadFormModal.tsx` (Create / Edit modal with phone and email validation)
  - `src/features/leads/LossReasonModal.tsx` (Mandatory reason prompt on Lost transition)
  - `src/features/leads/LeadFilterBar.tsx` (Filters for Status, Source, and Assignee)
  - `src/features/leads/LeadDetailPage.tsx` (Lead overview, contact info, notes, and sub-tabs)
  - `src/components/common/StatusBadge.tsx` (Semantic badges for New, Contacted, Qualified, Converted, Lost)

#### Step-by-Step Flow
1. Implement `leadsService.ts` with pagination/filtering.
2. Build `LeadTable` displaying Name, Phone, Email, Course, Source, Status, Assignee, Next Follow-up, Created At.
3. Build `LeadFormModal` with form state, validation, and loading indicators.
4. Add status change workflow: changing status to `Lost` opens `LossReasonModal` to enforce reason capture.
5. Create an automated activity log entry on lead creation and status changes.

#### Local Testing Checklist
- [ ] Create a lead; verify row appears in table and persists after browser reload.
- [ ] Edit lead details (phone, course interest); verify instant update in Supabase.
- [ ] Test search input against student name and phone.
- [ ] Filter by status `New` and source `Website`; verify table filters accurately.
- [ ] Transition lead to `Lost`; verify modal demands loss reason before saving.

#### Git Milestone
```bash
git add .
git commit -m "feat: phase 5 - lead management, search, filters and status transitions"
```

---

### Phase 6: Follow-Up Engine & Overdue Detection

#### Scope & Objectives
Implement scheduling, tracking, and completion for student follow-ups with accurate real-time overdue detection.

#### Where & How
- **Files to Create**:
  - `src/services/followUpsService.ts` (Follow-up queries and status updates)
  - `src/features/followups/FollowUpsPage.tsx` (Tabbed planner: Today, Overdue, Upcoming, Completed)
  - `src/features/followups/FollowUpModal.tsx` (Scheduler dialog with datetime picker)
  - `src/features/followups/FollowUpCard.tsx` (Follow-up card with quick completion action)
  - `src/components/common/OverdueBadge.tsx`

#### Step-by-Step Flow
1. Implement `followUpsService.ts` fetching follow-ups with associated lead info.
2. Implement date calculation:
   $$\text{Overdue} \iff \text{status} = \text{'pending'} \land \text{due\_at} < \text{NOW()}$$
3. Build "Mark as Completed" action: updates status to `completed`, writes `completed_at`, and triggers an activity record.
4. Provide direct link on follow-up card opening the parent lead's details.

#### Local Testing Checklist
- [ ] Schedule follow-up in the future; verify it appears in "Upcoming" tab.
- [ ] Schedule follow-up in the past; verify it appears in "Overdue" tab with red overdue badge.
- [ ] Complete overdue follow-up; verify it moves to "Completed" and is removed from overdue counters.

#### Git Milestone
```bash
git add .
git commit -m "feat: phase 6 - follow-up engine, date logic and overdue detection"
```

---

### Phase 7: Activity History & Audit Trail

#### Scope & Objectives
Build a chronological audit timeline documenting all interactions and state changes for each student lead.

#### Where & How
- **Files to Create**:
  - `src/services/activitiesService.ts`
  - `src/features/activities/ActivityTimeline.tsx`
  - `src/features/activities/ActivityItem.tsx`

#### Step-by-Step Flow
1. Connect automatic logging across `leadsService` and `followUpsService`:
   - `lead_created`: Lead initially captured.
   - `status_changed`: Previous status $\to$ New status.
   - `follow_up_scheduled`: Date and note logged.
   - `follow_up_completed`: Follow-up resolution recorded.
2. Build `ActivityTimeline` component integrated into `LeadDetailPage`.
3. Display actor name, humanized relative timestamp, action badge, and description.

#### Local Testing Checklist
- [ ] Perform sequential lead actions (create $\to$ edit note $\to$ change status $\to$ complete follow-up).
- [ ] Verify timeline renders all entries in reverse chronological order.
- [ ] Confirm events persist in Supabase `activities` table.

#### Git Milestone
```bash
git add .
git commit -m "feat: phase 7 - activity history and audit trail"
```

---

### Phase 8: Reconciled Dashboard & Visual Reports

#### Scope & Objectives
Construct an analytics dashboard where every displayed metric reconciles with underlying database records.

#### Where & How
- **Files to Create**:
  - `src/features/dashboard/DashboardPage.tsx`
  - `src/features/dashboard/MetricCard.tsx`
  - `src/features/dashboard/StatusDistributionChart.tsx`
  - `src/features/dashboard/SourceDistributionChart.tsx`
  - `src/features/dashboard/RecentLeadsWidget.tsx`
  - `src/features/dashboard/OverdueFollowUpsWidget.tsx`

#### Metric Formulations
- **Total Accessible Leads**: $N_{\text{total}} = \text{COUNT}(\text{leads})$
- **New Leads**: $N_{\text{new}} = \text{COUNT}(\text{leads WHERE status = 'New'})$
- **Converted Leads**: $N_{\text{converted}} = \text{COUNT}(\text{leads WHERE status = 'Converted'})$
- **Conversion Rate**:
  $$\text{Rate} = \begin{cases} \left(\frac{N_{\text{converted}}}{N_{\text{total}}} \times 100\right)\% & N_{\text{total}} > 0 \\ 0\% & N_{\text{total}} = 0 \end{cases}$$
- **Overdue Follow-ups**: $\text{COUNT}(\text{follow\_ups WHERE status = 'pending' AND due\_at} < \text{NOW()})$

#### Step-by-Step Flow
1. Implement real-time aggregations from Supabase scoped to user's permissions.
2. Render KPI cards with direct drill-down links to pre-filtered leads table.
3. Render visual status and source distribution charts.
4. Display urgency widgets for Overdue Follow-ups and Recent Enquiries.

#### Local Testing Checklist
- [ ] Verify Total Leads card count matches row count in `/leads`.
- [ ] Verify Converted Leads count matches filtered leads table.
- [ ] Test zero-leads state; confirm conversion rate renders `0%` cleanly without `NaN`.
- [ ] Confirm no hardcoded mock numbers exist.

#### Git Milestone
```bash
git add .
git commit -m "feat: phase 8 - reconciled dashboard metrics and visual reports"
```

---

### Phase 9: Responsive Polish, Accessibility & Error Handling

#### Scope & Objectives
Refine UI polish, mobile viewport responsiveness, keyboard navigation, and resilient network error feedback.

#### Where & How
- **Files to Modify**:
  - `src/index.css` (Focus outlines, responsive breakpoints, animations)
  - `src/components/common/Toast.tsx` (Global toast notifications)
  - Form components (ARIA labels, error messages, disabled submit states during network requests)

#### Step-by-Step Flow
1. Implement visible focus indicators (`:focus-visible`).
2. Add subtle CSS transitions on cards, buttons, and modal dialogs.
3. Ensure touch-friendly drawer behavior on mobile screens ($\le 768\text{px}$).
4. Add global toast handler for network dropouts, permission denials, and success confirmations.

#### Local Testing Checklist
- [ ] Full keyboard navigation test (Tab, Enter, Escape on modals).
- [ ] Inspect mobile layout at 375px width (forms and tables remain usable without horizontal overflow).
- [ ] Disconnect network during save; verify actionable error toast displays without console crash.

#### Git Milestone
```bash
git add .
git commit -m "feat: phase 9 - mobile responsiveness, accessibility and error handling"
```

---

### Phase 10: Production Build, GitHub Sync & Vercel Deployment

#### Scope & Objectives
Execute the production build, finalize documentation, sync Git with GitHub, deploy the frontend on Vercel, and verify all live features.

#### Where & How
- **Files to Create**:
  - `vercel.json` (SPA routing rewrite rules)
  - `README.md` (Setup instructions, tech stack, RLS explanation, deployment guide, limitations)

#### Step-by-Step Flow
1. Configure `vercel.json`:
   ```json
   {
     "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
   }
   ```
2. Run `npm run build` locally and ensure zero warnings or errors.
3. Connect local Git repository to GitHub remote:
   ```bash
   git remote add origin https://github.com/<your-username>/brightpath-crm.git
   git push -u origin main
   ```
4. Connect GitHub repository to Vercel.
5. Add production environment variables in Vercel:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
6. Trigger production deployment and verify build logs.

#### Live Post-Deployment Checklist
- [ ] Open deployed production Vercel URL.
- [ ] Sign in with test account.
- [ ] Create a student lead; verify it persists to Supabase.
- [ ] Schedule a follow-up and mark it complete.
- [ ] Confirm Dashboard numbers update dynamically.
- [ ] Test deep linking (refresh on `/leads` to ensure SPA rewrites route correctly).
- [ ] Test live URL on a mobile device.

---

## 3. Security & Governance Rules

1. **Client-Side Secrets Protection**: Only `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are allowed in browser code. `service_role` keys or direct DB passwords must never enter Git or client code.
2. **True Security Boundary**: Client-side route guards are for UX only; Row Level Security in PostgreSQL is the definitive security boundary.
3. **Role Elevation Prevention**: Users cannot change their own `role` in `profiles`. Role assignments require direct administrative action or designated database functions.
4. **Data Integrity**: Database constraints (`CHECK`, `NOT NULL`, foreign keys) enforce data validity independently of frontend validation.

---
*Generated context file for BrightPath CRM development.*
