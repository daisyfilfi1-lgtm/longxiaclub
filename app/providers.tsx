'use client';

import { SWRConfig } from 'swr';
import { swrConfig } from '@/hooks/useApi';
import { AuthProvider } from '@/hooks/useAuth';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SWRConfig value={swrConfig}>
      <AuthProvider>
        {children}
      </AuthProvider>
    </SWRConfig>
  );
}
