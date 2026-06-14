import type { Metadata } from "next";
import { Presentation } from "@/components/Presentation";

export const metadata: Metadata = {
  title: "Presentation | ZONA",
  description: "Brand presentation — ZONA identity and naming.",
};

export default function PresentationPage() {
  return <Presentation />;
}
