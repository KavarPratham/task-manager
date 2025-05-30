'use client';

import { SignIn } from '@clerk/nextjs';

export default function SignInPage() {
  return (
    <div
      className="relative flex items-center justify-center min-h-screen"
      style={{
        backgroundImage: "url('/images/task-manager-bg.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className="absolute inset-0 bg-black opacity-20"></div> {/* dark overlay */}
      <div className="relative z-10 w-full max-w-md p-6">
        <SignIn
          path="/sign-in"
          routing="path"
          signUpUrl="/sign-up"
        />
      </div>
    </div>
  );
}
