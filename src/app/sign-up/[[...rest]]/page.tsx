'use client';
import { SignUp } from '@clerk/nextjs';

export default function SignUpPage() {
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
        <SignUp
          path="/sign-up"
          routing="path"
          signInUrl="/sign-in"  // <-- important to redirect to your sign-in page
        />
      </div>
    </div>
  );
}
