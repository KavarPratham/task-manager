// app/sign-in/sso-callback/page.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SSORedirectCallback() {
  const router = useRouter();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const error = params.get('error');
    const reason = params.get('reason');

    // If SSO failed, redirect to custom sign-in
    if (error || reason) {
      router.replace('/sign-in?error=user_not_found');
    } else {
      // Optional: Successful login fallback
      router.replace('/dashboard');
    }
  }, [router]);

  return null;
}
