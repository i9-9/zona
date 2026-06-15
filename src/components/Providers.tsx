"use client";

import { LangProvider } from "@/context/LangContext";
import type { ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }) {
  return <LangProvider>{children}</LangProvider>;
}
