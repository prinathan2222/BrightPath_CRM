-- ==============================================================================
-- BRIGHTPATH CRM — MASTER CONSOLIDATED DATABASE SETUP
-- Apply this file in the Supabase Dashboard -> SQL Editor -> Run
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. TABLES & CONSTRAINTS
-- ------------------------------------------------------------------------------

-- Profiles Table (Linked to Supabase Auth)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('admin', 'manager', 'counsellor')) DEFAULT 'counsellor',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Leads Table
CREATE TABLE IF NOT EXISTS public.leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name TEXT NOT NULL,
    email TEXT,
    phone TEXT NOT NULL,
    course_interest TEXT NOT NULL,
    source TEXT NOT NULL CHECK (source IN ('Website', 'Walk-in', 'Referral', 'Social Media', 'Other')),
    status TEXT NOT NULL CHECK (status IN ('New', 'Contacted', 'Qualified', 'Converted', 'Lost')) DEFAULT 'New',
    loss_reason TEXT,
    notes TEXT,
    assigned_to UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT check_loss_reason CHECK (status != 'Lost' OR (loss_reason IS NOT NULL AND length(trim(loss_reason)) > 0))
);

-- Follow-ups Table
CREATE TABLE IF NOT EXISTS public.follow_ups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id UUID NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
    assigned_to UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    due_at TIMESTAMPTZ NOT NULL,
    note TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('pending', 'completed', 'cancelled')) DEFAULT 'pending',
    completed_at TIMESTAMPTZ,
    created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Activities Table (Audit Log)
CREATE TABLE IF NOT EXISTS public.activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id UUID NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
    actor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    activity_type TEXT NOT NULL CHECK (activity_type IN ('lead_created', 'status_changed', 'note_added', 'follow_up_scheduled', 'follow_up_completed')),
    description TEXT NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 2. INDEXES
-- ------------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_leads_status ON public.leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_source ON public.leads(source);
CREATE INDEX IF NOT EXISTS idx_leads_assigned_to ON public.leads(assigned_to);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON public.leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_follow_ups_due_at ON public.follow_ups(due_at);
CREATE INDEX IF NOT EXISTS idx_follow_ups_status ON public.follow_ups(status);
CREATE INDEX IF NOT EXISTS idx_follow_ups_lead_id ON public.follow_ups(lead_id);
CREATE INDEX IF NOT EXISTS idx_activities_lead_id ON public.activities(lead_id);

-- ------------------------------------------------------------------------------
-- 3. AUTOMATIC TRIGGERS
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_profiles_updated_at ON public.profiles;
CREATE TRIGGER trg_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trg_leads_updated_at ON public.leads;
CREATE TRIGGER trg_leads_updated_at
    BEFORE UPDATE ON public.leads
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Auto-provision Profile on new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, role)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
        'counsellor'
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ------------------------------------------------------------------------------
-- 4. ROW LEVEL SECURITY (RLS)
-- ------------------------------------------------------------------------------
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.follow_ups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.is_admin_or_manager()
RETURNS BOOLEAN
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role IN ('admin', 'manager')
    );
END;
$$ LANGUAGE plpgsql STABLE;

-- Profiles Policies
DROP POLICY IF EXISTS "profiles_select_all_authenticated" ON public.profiles;
CREATE POLICY "profiles_select_all_authenticated"
    ON public.profiles FOR SELECT
    TO authenticated
    USING (true);

DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;
CREATE POLICY "profiles_update_own"
    ON public.profiles FOR UPDATE
    TO authenticated
    USING (id = auth.uid())
    WITH CHECK (
        id = auth.uid() 
        AND (role = (SELECT role FROM public.profiles WHERE id = auth.uid()))
    );

DROP POLICY IF EXISTS "profiles_admin_manager_update" ON public.profiles;
CREATE POLICY "profiles_admin_manager_update"
    ON public.profiles FOR UPDATE
    TO authenticated
    USING (public.is_admin_or_manager())
    WITH CHECK (public.is_admin_or_manager());

DROP POLICY IF EXISTS "profiles_insert_own" ON public.profiles;
CREATE POLICY "profiles_insert_own"
    ON public.profiles FOR INSERT
    TO authenticated
    WITH CHECK (id = auth.uid() OR public.is_admin_or_manager());

-- Leads Policies
DROP POLICY IF EXISTS "leads_select_policy" ON public.leads;
CREATE POLICY "leads_select_policy"
    ON public.leads FOR SELECT
    TO authenticated
    USING (
        public.is_admin_or_manager() 
        OR assigned_to = auth.uid() 
        OR created_by = auth.uid()
        -- Allow viewing unassigned demo leads
        OR assigned_to IS NULL
    );

DROP POLICY IF EXISTS "leads_insert_policy" ON public.leads;
CREATE POLICY "leads_insert_policy"
    ON public.leads FOR INSERT
    TO authenticated
    WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "leads_update_policy" ON public.leads;
CREATE POLICY "leads_update_policy"
    ON public.leads FOR UPDATE
    TO authenticated
    USING (
        public.is_admin_or_manager() 
        OR assigned_to = auth.uid() 
        OR created_by = auth.uid()
        OR assigned_to IS NULL
    )
    WITH CHECK (
        public.is_admin_or_manager() 
        OR assigned_to = auth.uid() 
        OR created_by = auth.uid()
        OR assigned_to IS NULL
    );

DROP POLICY IF EXISTS "leads_delete_policy" ON public.leads;
CREATE POLICY "leads_delete_policy"
    ON public.leads FOR DELETE
    TO authenticated
    USING (public.is_admin_or_manager());

-- Follow_ups Policies
DROP POLICY IF EXISTS "follow_ups_select_policy" ON public.follow_ups;
CREATE POLICY "follow_ups_select_policy"
    ON public.follow_ups FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.leads
            WHERE leads.id = follow_ups.lead_id
            AND (
                public.is_admin_or_manager() 
                OR leads.assigned_to = auth.uid() 
                OR leads.created_by = auth.uid()
                OR leads.assigned_to IS NULL
            )
        )
    );

DROP POLICY IF EXISTS "follow_ups_insert_policy" ON public.follow_ups;
CREATE POLICY "follow_ups_insert_policy"
    ON public.follow_ups FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.leads
            WHERE leads.id = follow_ups.lead_id
            AND (
                public.is_admin_or_manager() 
                OR leads.assigned_to = auth.uid() 
                OR leads.created_by = auth.uid()
                OR leads.assigned_to IS NULL
            )
        )
    );

DROP POLICY IF EXISTS "follow_ups_update_policy" ON public.follow_ups;
CREATE POLICY "follow_ups_update_policy"
    ON public.follow_ups FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.leads
            WHERE leads.id = follow_ups.lead_id
            AND (
                public.is_admin_or_manager() 
                OR leads.assigned_to = auth.uid() 
                OR leads.created_by = auth.uid()
                OR leads.assigned_to IS NULL
            )
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.leads
            WHERE leads.id = follow_ups.lead_id
            AND (
                public.is_admin_or_manager() 
                OR leads.assigned_to = auth.uid() 
                OR leads.created_by = auth.uid()
                OR leads.assigned_to IS NULL
            )
        )
    );

DROP POLICY IF EXISTS "follow_ups_delete_policy" ON public.follow_ups;
CREATE POLICY "follow_ups_delete_policy"
    ON public.follow_ups FOR DELETE
    TO authenticated
    USING (public.is_admin_or_manager());

-- Activities Policies
DROP POLICY IF EXISTS "activities_select_policy" ON public.activities;
CREATE POLICY "activities_select_policy"
    ON public.activities FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.leads
            WHERE leads.id = activities.lead_id
            AND (
                public.is_admin_or_manager() 
                OR leads.assigned_to = auth.uid() 
                OR leads.created_by = auth.uid()
                OR leads.assigned_to IS NULL
            )
        )
    );

DROP POLICY IF EXISTS "activities_insert_policy" ON public.activities;
CREATE POLICY "activities_insert_policy"
    ON public.activities FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.leads
            WHERE leads.id = activities.lead_id
            AND (
                public.is_admin_or_manager() 
                OR leads.assigned_to = auth.uid() 
                OR leads.created_by = auth.uid()
                OR leads.assigned_to IS NULL
            )
        )
    );

-- ------------------------------------------------------------------------------
-- 5. FICTIONAL DEMO SEED DATA
-- ------------------------------------------------------------------------------
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM public.leads LIMIT 1) THEN
        INSERT INTO public.leads (
            full_name, email, phone, course_interest, source, status, notes
        ) VALUES 
        (
            'Aarav Sharma', 
            'aarav.sharma@demo.brightpath.academy', 
            '+91 98765 43210', 
            'Full Stack Web Development', 
            'Website', 
            'New', 
            'Interested in evening batch. Enquired through website lead form.'
        ),
        (
            'Priya Patel', 
            'priya.patel@demo.brightpath.academy', 
            '+91 98765 43211', 
            'Data Science & AI Bootcamp', 
            'Referral', 
            'Contacted', 
            'Spoke for 15 mins. Sent course syllabus via email.'
        ),
        (
            'Rohan Gupta', 
            'rohan.gupta@demo.brightpath.academy', 
            '+91 98765 43212', 
            'Cloud Engineering & DevOps', 
            'Social Media', 
            'Qualified', 
            'Has 2 years IT experience. Looking for certification assistance.'
        ),
        (
            'Ananya Iyer', 
            'ananya.iyer@demo.brightpath.academy', 
            '+91 98765 43213', 
            'UI/UX Design Masterclass', 
            'Walk-in', 
            'Converted', 
            'Enrolled in November weekend cohort. Registration confirmed.'
        ),
        (
            'Vikram Malhotra', 
            'vikram.m@demo.brightpath.academy', 
            '+91 98765 43214', 
            'Python for Beginners', 
            'Website', 
            'Lost', 
            'Looking for free workshops only at this time.'
        );

        -- Set loss reason for the Lost lead
        UPDATE public.leads 
        SET loss_reason = 'Candidate was looking for free resources only and not ready for paid certification enrollment'
        WHERE email = 'vikram.m@demo.brightpath.academy';

        RAISE NOTICE 'Demo leads successfully seeded.';
    END IF;
END $$;
