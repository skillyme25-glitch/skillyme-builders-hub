export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      admin_secrets: {
        Row: {
          id: number
          password_hash: string
          updated_at: string
        }
        Insert: {
          id?: number
          password_hash: string
          updated_at?: string
        }
        Update: {
          id?: number
          password_hash?: string
          updated_at?: string
        }
        Relationships: []
      }
      events: {
        Row: {
          attendees_label: string | null
          date_label: string | null
          id: string
          location: string | null
          sort_order: number
          time_label: string | null
          title: string | null
          type: string | null
        }
        Insert: {
          attendees_label?: string | null
          date_label?: string | null
          id?: string
          location?: string | null
          sort_order?: number
          time_label?: string | null
          title?: string | null
          type?: string | null
        }
        Update: {
          attendees_label?: string | null
          date_label?: string | null
          id?: string
          location?: string | null
          sort_order?: number
          time_label?: string | null
          title?: string | null
          type?: string | null
        }
        Relationships: []
      }
      faqs: {
        Row: {
          answer: string
          id: string
          question: string
          sort_order: number
        }
        Insert: {
          answer: string
          id?: string
          question: string
          sort_order?: number
        }
        Update: {
          answer?: string
          id?: string
          question?: string
          sort_order?: number
        }
        Relationships: []
      }
      mentor_sessions: {
        Row: {
          date_label: string | null
          focus: string | null
          id: string
          meet_url: string | null
          mentor_id: string | null
          past: boolean
          sort_order: number
        }
        Insert: {
          date_label?: string | null
          focus?: string | null
          id?: string
          meet_url?: string | null
          mentor_id?: string | null
          past?: boolean
          sort_order?: number
        }
        Update: {
          date_label?: string | null
          focus?: string | null
          id?: string
          meet_url?: string | null
          mentor_id?: string | null
          past?: boolean
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "mentor_sessions_mentor_id_fkey"
            columns: ["mentor_id"]
            isOneToOne: false
            referencedRelation: "mentors"
            referencedColumns: ["id"]
          },
        ]
      }
      mentors: {
        Row: {
          bio: string | null
          id: string
          industry: string | null
          initials: string | null
          name: string
          project_id: string | null
        }
        Insert: {
          bio?: string | null
          id?: string
          industry?: string | null
          initials?: string | null
          name: string
          project_id?: string | null
        }
        Update: {
          bio?: string | null
          id?: string
          industry?: string | null
          initials?: string | null
          name?: string
          project_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "mentors_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          active_today: boolean
          country: string | null
          country_flag: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          initials: string | null
          is_admin: boolean
          profile_complete: boolean
          role: string | null
          role_detail: string | null
          team_id: string | null
          updated_at: string
        }
        Insert: {
          active_today?: boolean
          country?: string | null
          country_flag?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          initials?: string | null
          is_admin?: boolean
          profile_complete?: boolean
          role?: string | null
          role_detail?: string | null
          team_id?: string | null
          updated_at?: string
        }
        Update: {
          active_today?: boolean
          country?: string | null
          country_flag?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          initials?: string | null
          is_admin?: boolean
          profile_complete?: boolean
          role?: string | null
          role_detail?: string | null
          team_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          created_at: string
          icon_key: string
          id: string
          name: string
          number: number
          one_liner: string
          slug: string
        }
        Insert: {
          created_at?: string
          icon_key?: string
          id?: string
          name: string
          number: number
          one_liner?: string
          slug: string
        }
        Update: {
          created_at?: string
          icon_key?: string
          id?: string
          name?: string
          number?: number
          one_liner?: string
          slug?: string
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          deadline_date_label: string | null
          deadline_title: string | null
          hours_remaining: number | null
          id: number
          project_brief: string[]
          total_window_hours: number | null
          updated_at: string
        }
        Insert: {
          deadline_date_label?: string | null
          deadline_title?: string | null
          hours_remaining?: number | null
          id?: number
          project_brief?: string[]
          total_window_hours?: number | null
          updated_at?: string
        }
        Update: {
          deadline_date_label?: string | null
          deadline_title?: string | null
          hours_remaining?: number | null
          id?: number
          project_brief?: string[]
          total_window_hours?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      teams: {
        Row: {
          created_at: string
          id: string
          letter: string
          name: string
          project_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          letter: string
          name: string
          project_id: string
        }
        Update: {
          created_at?: string
          id?: string
          letter?: string
          name?: string
          project_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "teams_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      weeks: {
        Row: {
          check_in_due: string | null
          check_in_status: string
          date_range: string
          deliverable_summary: string
          expectations: string[]
          id: string
          number: number
          reviewed_by: string[]
          status: string
          submission_due: string | null
          submission_status: string
          team_id: string | null
          theme: string
        }
        Insert: {
          check_in_due?: string | null
          check_in_status?: string
          date_range: string
          deliverable_summary?: string
          expectations?: string[]
          id?: string
          number: number
          reviewed_by?: string[]
          status?: string
          submission_due?: string | null
          submission_status?: string
          team_id?: string | null
          theme: string
        }
        Update: {
          check_in_due?: string | null
          check_in_status?: string
          date_range?: string
          deliverable_summary?: string
          expectations?: string[]
          id?: string
          number?: number
          reviewed_by?: string[]
          status?: string
          submission_due?: string | null
          submission_status?: string
          team_id?: string | null
          theme?: string
        }
        Relationships: [
          {
            foreignKeyName: "weeks_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      set_admin_password: { Args: { p: string }; Returns: undefined }
      verify_admin_password: { Args: { p: string }; Returns: boolean }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
