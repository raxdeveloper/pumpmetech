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
      challenges: {
        Row: {
          ai_confidence: number | null
          ai_reasoning: string | null
          ai_recommendation: string | null
          created_at: string
          creator_id: string
          deadline: string
          description: string | null
          id: string
          on_chain_id: number | null
          proof_url: string | null
          resolved_at: string | null
          reward_bps: number
          stake_no_sol: number
          stake_yes_sol: number
          status: Database["public"]["Enums"]["challenge_status"]
          title: string
        }
        Insert: {
          ai_confidence?: number | null
          ai_reasoning?: string | null
          ai_recommendation?: string | null
          created_at?: string
          creator_id: string
          deadline: string
          description?: string | null
          id?: string
          on_chain_id?: number | null
          proof_url?: string | null
          resolved_at?: string | null
          reward_bps: number
          stake_no_sol?: number
          stake_yes_sol?: number
          status?: Database["public"]["Enums"]["challenge_status"]
          title: string
        }
        Update: {
          ai_confidence?: number | null
          ai_reasoning?: string | null
          ai_recommendation?: string | null
          created_at?: string
          creator_id?: string
          deadline?: string
          description?: string | null
          id?: string
          on_chain_id?: number | null
          proof_url?: string | null
          resolved_at?: string | null
          reward_bps?: number
          stake_no_sol?: number
          stake_yes_sol?: number
          status?: Database["public"]["Enums"]["challenge_status"]
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "challenges_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "creators"
            referencedColumns: ["id"]
          },
        ]
      }
      creators: {
        Row: {
          avatar_color: string
          badge_metadata_uri: string | null
          badge_tier: Database["public"]["Enums"]["badge_tier"]
          bio: string | null
          challenge_completions: number
          created_at: string
          display_name: string
          handle: string
          holder_count: number
          id: string
          initials: string
          is_graduated: boolean
          last_scored_at: string | null
          market_cap_sol: number
          momentum_reasoning: string | null
          momentum_score: number
          momentum_trend: Database["public"]["Enums"]["momentum_trend"]
          price_change_24h: number
          price_history: number[]
          price_sol: number
          sol_reserves: number
          supply: number
          token_symbol: string
          updated_at: string
          volume_sol: number
          x_handle: string | null
          x_verified: boolean
        }
        Insert: {
          avatar_color?: string
          badge_metadata_uri?: string | null
          badge_tier?: Database["public"]["Enums"]["badge_tier"]
          bio?: string | null
          challenge_completions?: number
          created_at?: string
          display_name: string
          handle: string
          holder_count?: number
          id?: string
          initials: string
          is_graduated?: boolean
          last_scored_at?: string | null
          market_cap_sol?: number
          momentum_reasoning?: string | null
          momentum_score?: number
          momentum_trend?: Database["public"]["Enums"]["momentum_trend"]
          price_change_24h?: number
          price_history?: number[]
          price_sol?: number
          sol_reserves?: number
          supply?: number
          token_symbol: string
          updated_at?: string
          volume_sol?: number
          x_handle?: string | null
          x_verified?: boolean
        }
        Update: {
          avatar_color?: string
          badge_metadata_uri?: string | null
          badge_tier?: Database["public"]["Enums"]["badge_tier"]
          bio?: string | null
          challenge_completions?: number
          created_at?: string
          display_name?: string
          handle?: string
          holder_count?: number
          id?: string
          initials?: string
          is_graduated?: boolean
          last_scored_at?: string | null
          market_cap_sol?: number
          momentum_reasoning?: string | null
          momentum_score?: number
          momentum_trend?: Database["public"]["Enums"]["momentum_trend"]
          price_change_24h?: number
          price_history?: number[]
          price_sol?: number
          sol_reserves?: number
          supply?: number
          token_symbol?: string
          updated_at?: string
          volume_sol?: number
          x_handle?: string | null
          x_verified?: boolean
        }
        Relationships: []
      }
      on_chain_events: {
        Row: {
          creator_id: string | null
          event_type: string
          id: string
          metadata: Json | null
          occurred_at: string
          signature: string | null
          sol_amount: number | null
          token_amount: number | null
          wallet: string | null
        }
        Insert: {
          creator_id?: string | null
          event_type: string
          id?: string
          metadata?: Json | null
          occurred_at?: string
          signature?: string | null
          sol_amount?: number | null
          token_amount?: number | null
          wallet?: string | null
        }
        Update: {
          creator_id?: string | null
          event_type?: string
          id?: string
          metadata?: Json | null
          occurred_at?: string
          signature?: string | null
          sol_amount?: number | null
          token_amount?: number | null
          wallet?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "on_chain_events_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "creators"
            referencedColumns: ["id"]
          },
        ]
      }
      price_history: {
        Row: {
          creator_id: string
          id: string
          market_cap_sol: number
          price_sol: number
          recorded_at: string
          supply: number
          volume_1h: number
        }
        Insert: {
          creator_id: string
          id?: string
          market_cap_sol: number
          price_sol: number
          recorded_at?: string
          supply: number
          volume_1h?: number
        }
        Update: {
          creator_id?: string
          id?: string
          market_cap_sol?: number
          price_sol?: number
          recorded_at?: string
          supply?: number
          volume_1h?: number
        }
        Relationships: [
          {
            foreignKeyName: "price_history_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "creators"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      badge_tier: "Bronze" | "Silver" | "Gold" | "Platinum" | "Graduate"
      challenge_status: "active" | "completed" | "failed" | "disputed"
      momentum_trend: "rising" | "stable" | "falling" | "up" | "down"
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
    Enums: {
      badge_tier: ["Bronze", "Silver", "Gold", "Platinum", "Graduate"],
      challenge_status: ["active", "completed", "failed", "disputed"],
      momentum_trend: ["rising", "stable", "falling", "up", "down"],
    },
  },
} as const
