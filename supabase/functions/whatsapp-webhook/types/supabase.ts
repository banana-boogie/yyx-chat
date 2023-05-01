export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export interface Database {
  public: {
    Tables: {
      messages: {
        Row: {
          id: number;
          inserted_at: string;
          message: string | null;
          openai_response: string | null;
          updated_at: string;
          user_id: number;
        };
        Insert: {
          id?: number;
          inserted_at?: string;
          message?: string | null;
          openai_response?: string | null;
          updated_at?: string;
          user_id: number;
        };
        Update: {
          id?: number;
          inserted_at?: string;
          message?: string | null;
          openai_response?: string | null;
          updated_at?: string;
          user_id?: number;
        };
      };
      users: {
        Row: {
          id: number;
          inserted_at: string;
          name: string | null;
          phone_number: string | null;
          updated_at: string;
        };
        Insert: {
          id?: number;
          inserted_at?: string;
          name?: string | null;
          phone_number?: string | null;
          updated_at?: string;
        };
        Update: {
          id?: number;
          inserted_at?: string;
          name?: string | null;
          phone_number?: string | null;
          updated_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
