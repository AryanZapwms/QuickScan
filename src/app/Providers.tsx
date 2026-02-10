'use client';

import { SessionProvider } from 'next-auth/react';
import { ReactNode } from 'react';
import { ThemeProvider } from '@/components/providers/ThemeProvider';

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        {children}
      </ThemeProvider>
    </SessionProvider>
  );
}