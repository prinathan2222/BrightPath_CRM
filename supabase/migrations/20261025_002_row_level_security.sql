-- ==============================================================================
-- BrightPath CRM — Migration 002: Row Level Security (RLS) Policies
-- ==============================================================================

-- 1. ENABLE ROW LEVEL SECURITY
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.follow_ups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;

-- 2. HELPER FUNCTION: Check if the calling user is admin or manager
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

-- 3. PROFILES POLICIES
-- Anyone authenticated can view profiles (to see names of assigned counsellors)
DROP POLICY IF EXISTS "profiles_select_all_authenticated" ON public.profiles;
CREATE POLICY "profiles_select_all_authenticated"
    ON public.profiles FOR SELECT
    TO authenticated
    USING (true);

-- Users can update their own profile, but cannot elevate their own role
DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;
CREATE POLICY "profiles_update_own"
    ON public.profiles FOR UPDATE
    TO authenticated
    USING (id = auth.uid())
    WITH CHECK (
        id = auth.uid() 
        AND (role = (SELECT role FROM public.profiles WHERE id = auth.uid()))
    );

-- Admins can update any profile (including role elevations)
DROP POLICY IF EXISTS "profiles_admin_manager_update" ON public.profiles;
CREATE POLICY "profiles_admin_manager_update"
    ON public.profiles FOR UPDATE
    TO authenticated
    USING (public.is_admin_or_manager())
    WITH CHECK (public.is_admin_or_manager());

-- Users can insert their own profile during registration
DROP POLICY IF EXISTS "profiles_insert_own" ON public.profiles;
CREATE POLICY "profiles_insert_own"
    ON public.profiles FOR INSERT
    TO authenticated
    WITH CHECK (id = auth.uid() OR public.is_admin_or_manager());

-- 4. LEADS POLICIES
-- Read access: Managers/Admins can read all leads. Counsellors can read assigned or created leads.
DROP POLICY IF EXISTS "leads_select_policy" ON public.leads;
CREATE POLICY "leads_select_policy"
    ON public.leads FOR SELECT
    TO authenticated
    USING (
        public.is_admin_or_manager() 
        OR assigned_to = auth.uid() 
        OR created_by = auth.uid()
    );

-- Insert access: Any authenticated staff member can create a lead
DROP POLICY IF EXISTS "leads_insert_policy" ON public.leads;
CREATE POLICY "leads_insert_policy"
    ON public.leads FOR INSERT
    TO authenticated
    WITH CHECK (auth.role() = 'authenticated');

-- Update access: Managers/Admins can update any lead. Counsellors can update assigned or created leads.
DROP POLICY IF EXISTS "leads_update_policy" ON public.leads;
CREATE POLICY "leads_update_policy"
    ON public.leads FOR UPDATE
    TO authenticated
    USING (
        public.is_admin_or_manager() 
        OR assigned_to = auth.uid() 
        OR created_by = auth.uid()
    )
    WITH CHECK (
        public.is_admin_or_manager() 
        OR assigned_to = auth.uid() 
        OR created_by = auth.uid()
    );

-- Delete access: Only managers and admins can delete leads
DROP POLICY IF EXISTS "leads_delete_policy" ON public.leads;
CREATE POLICY "leads_delete_policy"
    ON public.leads FOR DELETE
    TO authenticated
    USING (public.is_admin_or_manager());

-- 5. FOLLOW_UPS POLICIES
-- Follow-up access inherits permission from the associated lead
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
            )
        )
    );

DROP POLICY IF EXISTS "follow_ups_delete_policy" ON public.follow_ups;
CREATE POLICY "follow_ups_delete_policy"
    ON public.follow_ups FOR DELETE
    TO authenticated
    USING (public.is_admin_or_manager());

-- 6. ACTIVITIES POLICIES
-- Activities inherit visibility from the related lead
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
            )
        )
    );
