export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type UserRole = 'admin' | 'manager' | 'counsellor';

export type LeadStatus = 'New' | 'Contacted' | 'Qualified' | 'Converted' | 'Lost';

export type FollowUpStatus = 'pending' | 'completed' | 'cancelled';

export type LeadSource = 'Website' | 'Walk-in' | 'Referral' | 'Social Media' | 'Other';

export type ActivityType = 
  | 'lead_created' 
  | 'status_changed' 
  | 'note_added' 
  | 'follow_up_scheduled' 
  | 'follow_up_completed';

export interface Profile {
  id: string;
  full_name: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface Lead {
  id: string;
  full_name: string;
  email: string | null;
  phone: string;
  course_interest: string;
  source: LeadSource;
  status: LeadStatus;
  loss_reason: string | null;
  notes: string | null;
  assigned_to: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
  // Joined relation fields
  assignee?: Profile | null;
}

export interface FollowUp {
  id: string;
  lead_id: string;
  assigned_to: string;
  due_at: string;
  note: string;
  status: FollowUpStatus;
  completed_at: string | null;
  created_by: string | null;
  created_at: string;
  // Joined relation fields
  lead?: Lead | null;
  assignee?: Profile | null;
}

export interface Activity {
  id: string;
  lead_id: string;
  actor_id: string | null;
  activity_type: ActivityType;
  description: string;
  metadata: Json;
  created_at: string;
  // Joined relation fields
  actor?: Profile | null;
}

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, 'created_at' | 'updated_at'> & {
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<Profile, 'id' | 'created_at' | 'updated_at'>> & {
          updated_at?: string;
        };
      };
      leads: {
        Row: Lead;
        Insert: Omit<Lead, 'id' | 'created_at' | 'updated_at' | 'assignee'> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<Lead, 'id' | 'created_at' | 'updated_at' | 'assignee'>> & {
          updated_at?: string;
        };
      };
      follow_ups: {
        Row: FollowUp;
        Insert: Omit<FollowUp, 'id' | 'created_at' | 'lead' | 'assignee'> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Omit<FollowUp, 'id' | 'created_at' | 'lead' | 'assignee'>>;
      };
      activities: {
        Row: Activity;
        Insert: Omit<Activity, 'id' | 'created_at' | 'actor'> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Omit<Activity, 'id' | 'created_at' | 'actor'>>;
      };
    };
  };
}
