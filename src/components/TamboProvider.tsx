import { ReactNode } from 'react';
import { TamboProvider as BaseTamboProvider } from '@tambo-ai/react';
import { tamboTools } from '@/lib/tambo-tools';

interface TamboProviderProps {
  children: ReactNode;
}

export function TamboProvider({ children }: TamboProviderProps) {
  return (
    <BaseTamboProvider
      tools={tamboTools}
      apiKey={process.env.NEXT_PUBLIC_TAMBO_API_KEY || ''}
    >
      {children}
    </BaseTamboProvider>
  );
}
