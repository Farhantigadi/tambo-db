import { ReactNode } from 'react';
import { TamboProvider as BaseTamboProvider } from '@tambo/react';
import { tamboTools } from '@/lib/tambo-tools';

interface TamboProviderProps {
  children: ReactNode;
}

export function TamboProvider({ children }: TamboProviderProps) {
  const handleToolCall = async (toolName: string, params: unknown) => {
    try {
      const endpoint = mapToolToEndpoint(toolName);
      const response = await fetch(endpoint, {
        method: toolName.startsWith('search') || toolName.startsWith('get') ? 'GET' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || `Tool call failed: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      return { error: message, success: false };
    }
  };

  const mapToolToEndpoint = (toolName: string): string => {
    const mapping: Record<string, string> = {
      add_deal: '/api/deals',
      update_deal: '/api/deals/:id',
      search_deals: '/api/deals',
      assign_contact: '/api/assign-contact',
      get_pipeline_forecast: '/api/advanced-analytics',
    };
    return mapping[toolName] || '/api/unknown';
  };

  return (
    <BaseTamboProvider
      tools={tamboTools}
      onToolCall={handleToolCall}
      config={{
        apiKey: process.env.NEXT_PUBLIC_TAMBO_API_KEY,
        model: 'gpt-4-turbo',
      }}
    >
      {children}
    </BaseTamboProvider>
  );
}
