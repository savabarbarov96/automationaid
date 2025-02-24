export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      contact_submissions: {
        Row: {
          company: string
          contact_other: string | null
          contact_preference: string
          created_at: string
          email: string
          id: string
          message: string
          name: string
          phone: string
          purpose: string
          user_id: string | null
        }
        Insert: {
          company: string
          contact_other?: string | null
          contact_preference?: string
          created_at?: string
          email: string
          id?: string
          message: string
          name?: string
          phone: string
          purpose?: string
          user_id?: string | null
        }
        Update: {
          company?: string
          contact_other?: string | null
          contact_preference?: string
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
          phone?: string
          purpose?: string
          user_id?: string | null
        }
        Relationships: []
      }
      legal_documents: {
        Row: {
          content: string | null
          id: number
          title: string
        }
        Insert: {
          content?: string | null
          id?: number
          title: string
        }
        Update: {
          content?: string | null
          id?: number
          title?: string
        }
        Relationships: []
      }
      notification_settings: {
        Row: {
          created_at: string
          discord: boolean | null
          discord_webhook_url: string | null
          email: boolean | null
          id: string
          slack: boolean | null
          slack_webhook_url: string | null
          updated_at: string
          user_id: string | null
          viber: boolean | null
        }
        Insert: {
          created_at?: string
          discord?: boolean | null
          discord_webhook_url?: string | null
          email?: boolean | null
          id?: string
          slack?: boolean | null
          slack_webhook_url?: string | null
          updated_at?: string
          user_id?: string | null
          viber?: boolean | null
        }
        Update: {
          created_at?: string
          discord?: boolean | null
          discord_webhook_url?: string | null
          email?: boolean | null
          id?: string
          slack?: boolean | null
          slack_webhook_url?: string | null
          updated_at?: string
          user_id?: string | null
          viber?: boolean | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          id: string
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          id: string
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          id?: string
          username?: string | null
        }
        Relationships: []
      }
      research: {
        Row: {
          id: number
          research: string | null
          topic: string
        }
        Insert: {
          id?: number
          research?: string | null
          topic: string
        }
        Update: {
          id?: number
          research?: string | null
          topic?: string
        }
        Relationships: []
      }
      webhook_integrations: {
        Row: {
          body: Json | null
          created_at: string
          description: string | null
          id: string
          is_active: boolean | null
          last_run: string | null
          method: string
          name: string
          schedule: string | null
          url: string
          user_id: string
        }
        Insert: {
          body?: Json | null
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          last_run?: string | null
          method?: string
          name?: string
          schedule?: string | null
          url: string
          user_id: string
        }
        Update: {
          body?: Json | null
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          last_run?: string | null
          method?: string
          name?: string
          schedule?: string | null
          url?: string
          user_id?: string
        }
        Relationships: []
      }
      webhook_logs: {
        Row: {
          created_at: string | null
          id: string
          request_data: Json | null
          response_data: Json | null
          status: string
          user_id: string
          webhook_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          request_data?: Json | null
          response_data?: Json | null
          status: string
          user_id: string
          webhook_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          request_data?: Json | null
          response_data?: Json | null
          status?: string
          user_id?: string
          webhook_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "webhook_logs_webhook_id_fkey"
            columns: ["webhook_id"]
            isOneToOne: false
            referencedRelation: "webhook_integrations"
            referencedColumns: ["id"]
          },
        ]
      }
      webhooks: {
        Row: {
          created_at: string | null
          id: string
          method: string
          name: string
          url: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          method?: string
          name: string
          url: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          method?: string
          name?: string
          url?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
