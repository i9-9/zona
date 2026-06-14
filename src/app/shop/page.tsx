import type { Metadata } from "next";
import { Shop } from "@/components/Shop";

export const metadata: Metadata = {
  title: "Shop | ZONA",
  description: "ZONA — indumentaria urbana.",
};

export default function ShopPage() {
  return <Shop />;
}
