export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      messages: {
        Row: {
          id: number
          inserted_at: string
          message: string | null
          phone_number: string | null
          updated_at: string
          user_id: number
          whatsapp_id: string | null
        }
        Insert: {
          id?: number
          inserted_at?: string
          message?: string | null
          phone_number?: string | null
          updated_at?: string
          user_id: number
          whatsapp_id?: string | null
        }
        Update: {
          id?: number
          inserted_at?: string
          message?: string | null
          phone_number?: string | null
          updated_at?: string
          user_id?: number
          whatsapp_id?: string | null
        }
      }
      users: {
        Row: {
          id: number
          inserted_at: string
          name: string | null
          phone_number: string | null
          updated_at: string
          whatsapp_id: string | null
        }
        Insert: {
          id?: number
          inserted_at?: string
          name?: string | null
          phone_number?: string | null
          updated_at?: string
          whatsapp_id?: string | null
        }
        Update: {
          id?: number
          inserted_at?: string
          name?: string | null
          phone_number?: string | null
          updated_at?: string
          whatsapp_id?: string | null
        }
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
