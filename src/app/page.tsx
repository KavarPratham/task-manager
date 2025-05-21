// src/app/page.tsx
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function Home() {
  const { userId } = await auth();

  // If not signed in, send to Clerk sign‑in
  if (!userId) {
    return redirect("/sign-in");
  }

  // If signed in, go straight to your dashboard
  return redirect("/dashboard");
}
