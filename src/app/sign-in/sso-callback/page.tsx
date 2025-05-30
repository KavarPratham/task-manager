'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Clerk } from '@clerk/clerk-js';

export default function SSORedirectCallback() {
  const router = useRouter();

  useEffect(() => {
    const handleSSORedirect = async () => {
      const clerk = new Clerk(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY!);

      await clerk.load();

      try {
        await clerk.handleRedirectCallback();
        // ✅ Redirect to dashboard on success
        router.replace('/dashboard');
      } catch (err) {
        console.error('SSO redirect failed:', err);
        // ❌ Redirect to sign-in on failure
        router.replace('/sign-in');
      }
    };

    handleSSORedirect();
  }, [router]);

  return null;
}
