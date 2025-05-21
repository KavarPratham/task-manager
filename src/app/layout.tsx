// app/layout.tsx or app/(protected)/layout.tsx
import './globals.css';
import { ClerkProvider } from '@clerk/nextjs';
import LayoutWithSidebar from '@/components/LayoutWithSidebar';
import { dark } from '@clerk/themes';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider appearance={{baseTheme: dark}}>
      <html lang="en" className="dark">
        <body>
          <LayoutWithSidebar>{children}</LayoutWithSidebar>
        </body>
      </html>
    </ClerkProvider>
  );
}
