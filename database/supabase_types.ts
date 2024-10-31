export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      StockInfo: {
        Row: {
          description: string | null;
          id: number;
          name: string | null;
          symbol: string | null;
        };
        Insert: {
          description?: string | null;
          id?: number;
          name?: string | null;
          symbol?: string | null;
        };
        Update: {
          description?: string | null;
          id?: number;
          name?: string | null;
          symbol?: string | null;
        };
        Relationships: [];
      };
      StockPrices: {
        Row: {
          close: number | null;
          high: number | null;
          low: number | null;
          open: number | null;
          price_id: number;
          stock_id: number;
          timestamp: string;
          volume: number | null;
        };
        Insert: {
          close?: number | null;
          high?: number | null;
          low?: number | null;
          open?: number | null;
          price_id?: number;
          stock_id: number;
          timestamp: string;
          volume?: number | null;
        };
        Update: {
          close?: number | null;
          high?: number | null;
          low?: number | null;
          open?: number | null;
          price_id?: number;
          stock_id?: number;
          timestamp?: string;
          volume?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "StockPrices_stock_id_fkey";
            columns: ["stock_id"];
            isOneToOne: false;
            referencedRelation: "StockInfo";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      dblink: {
        Args: {
          "": string;
        };
        Returns: Record<string, unknown>[];
      };
      dblink_cancel_query: {
        Args: {
          "": string;
        };
        Returns: string;
      };
      dblink_close: {
        Args: {
          "": string;
        };
        Returns: string;
      };
      dblink_connect: {
        Args: {
          "": string;
        };
        Returns: string;
      };
      dblink_connect_u: {
        Args: {
          "": string;
        };
        Returns: string;
      };
      dblink_current_query: {
        Args: Record<PropertyKey, never>;
        Returns: string;
      };
      dblink_disconnect:
        | {
          Args: Record<PropertyKey, never>;
          Returns: string;
        }
        | {
          Args: {
            "": string;
          };
          Returns: string;
        };
      dblink_error_message: {
        Args: {
          "": string;
        };
        Returns: string;
      };
      dblink_exec: {
        Args: {
          "": string;
        };
        Returns: string;
      };
      dblink_fdw_validator: {
        Args: {
          options: string[];
          catalog: unknown;
        };
        Returns: undefined;
      };
      dblink_get_connections: {
        Args: Record<PropertyKey, never>;
        Returns: string[];
      };
      dblink_get_notify:
        | {
          Args: Record<PropertyKey, never>;
          Returns: Record<string, unknown>[];
        }
        | {
          Args: {
            conname: string;
          };
          Returns: Record<string, unknown>[];
        };
      dblink_get_pkey: {
        Args: {
          "": string;
        };
        Returns: Database["public"]["CompositeTypes"]["dblink_pkey_results"][];
      };
      dblink_get_result: {
        Args: {
          "": string;
        };
        Returns: Record<string, unknown>[];
      };
      dblink_is_busy: {
        Args: {
          "": string;
        };
        Returns: number;
      };
      paginate_stock_symbols: {
        Args: {
          chunk_size: number;
          chunk_number: number;
        };
        Returns: {
          id: number;
          symbol: string;
        }[];
      };
      upsert_stock_prices: {
        Args: {
          p_stock_id: number;
          p_timestamp: string;
          p_open: number;
          p_close: number;
          p_high: number;
          p_low: number;
          p_volume: number;
        };
        Returns: undefined;
      };
      upsert_stock_prices_bulk: {
        Args: {
          p_data: Json;
        };
        Returns: undefined;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      dblink_pkey_results: {
        position: number | null;
        colname: string | null;
      };
    };
  };
};

type PublicSchema = Database[Extract<keyof Database, "public">];

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (
      & Database[PublicTableNameOrOptions["schema"]]["Tables"]
      & Database[PublicTableNameOrOptions["schema"]]["Views"]
    )
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database } ? (
    & Database[PublicTableNameOrOptions["schema"]]["Tables"]
    & Database[PublicTableNameOrOptions["schema"]]["Views"]
  )[TableName] extends {
    Row: infer R;
  } ? R
  : never
  : PublicTableNameOrOptions extends keyof (
    & PublicSchema["Tables"]
    & PublicSchema["Views"]
  ) ? (
      & PublicSchema["Tables"]
      & PublicSchema["Views"]
    )[PublicTableNameOrOptions] extends {
      Row: infer R;
    } ? R
    : never
  : never;

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
    Insert: infer I;
  } ? I
  : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
      Insert: infer I;
    } ? I
    : never
  : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
    Update: infer U;
  } ? U
  : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
      Update: infer U;
    } ? U
    : never
  : never;

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
  : never;
