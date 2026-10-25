-- ==============================================================================
-- BrightPath CRM — Migration 003: Safe Fictional Demo Seed Data
-- ==============================================================================

-- Inserts fictional demo leads only if the table is currently empty
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

        -- Update the Lost lead with mandatory loss reason
        UPDATE public.leads 
        SET loss_reason = 'Candidate was looking for free resources and not ready for paid certification enrollment'
        WHERE email = 'vikram.m@demo.brightpath.academy';

        RAISE NOTICE 'Demo seed data successfully inserted.';
    ELSE
        RAISE NOTICE 'Leads table already contains data. Skipping demo seed insertion.';
    END IF;
END $$;
