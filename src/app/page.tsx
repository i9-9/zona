import type { Metadata } from "next";
import { SiteEntry } from "@/components/SiteEntry";

export const metadata: Metadata = {
  title: "ZONA",
  description: "Urban identity — Buenos Aires.",
};

export default function Home() {
  return <SiteEntry />;
}
