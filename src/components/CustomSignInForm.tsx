'use client';

import { useState } from 'react';
import { useSignIn } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

export default function CustomSignInForm() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded) return;

    try {
      const result = await signIn.create({
        identifier: email,
        password,
      });

      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId });
        router.push('/dashboard');
      } else {
        console.log('Unexpected status:', result.status);
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      const code = err.errors?.[0]?.code;
      if (code === 'form_identifier_not_found') {
        setErrorMsg('User not found. Please sign up.');
      } else if (code === 'form_password_incorrect') {
        setErrorMsg('Incorrect password. Please try again.');
      } else {
        setErrorMsg('Sign-in failed. Please try again.');
      }
    }
  };

  const handleOAuth = (provider: 'oauth_google' | 'oauth_github') => {
    if (!isLoaded) return;
    signIn.authenticateWithRedirect({
        strategy: provider,
        redirectUrl: '/sso-callback',
        redirectUrlComplete: ''
    });
  };

  return (
    <form onSubmit={handleSignIn} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg space-y-4 w-full max-w-sm">
      <h2 className="text-xl font-bold text-gray-800 dark:text-white">Sign In</h2>

      {errorMsg && <div className="text-red-500 text-sm">{errorMsg}</div>}

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full p-2 border rounded"
        required
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full p-2 border rounded"
        required
      />

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
      >
        Sign In
      </button>

      <div className="flex items-center justify-center gap-2 pt-2">
        <button
          type="button"
          onClick={() => handleOAuth('oauth_google')}
          className="flex-1 bg-red-500 text-white py-2 rounded hover:bg-red-600 transition"
        >
          Sign in with Google
        </button>

        <button
          type="button"
          onClick={() => handleOAuth('oauth_github')}
          className="flex-1 bg-gray-800 text-white py-2 rounded hover:bg-gray-900 transition"
        >
          GitHub
        </button>
      </div>

      <p className="text-sm text-center text-gray-600 dark:text-gray-400">
        Don’t have an account? <a href="/sign-up" className="text-blue-600">Sign up</a>
      </p>
    </form>
  );
}
