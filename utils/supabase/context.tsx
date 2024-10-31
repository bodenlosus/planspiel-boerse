import { createClient } from "./server";
import { createContext } from "react";

export const SupaBaseContext = createContext(createClient());
