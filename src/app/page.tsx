// src/app/page.tsx
// import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

// src/app/page.tsx
export default function Home() {
  return redirect("/dashboard");
}
