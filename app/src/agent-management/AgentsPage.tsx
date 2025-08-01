import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import App from '../../eliza/packages/client/src/App';

// Create a separate query client for the ElizaOS client
const elizaQueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

const AgentsPage = () => {
  return (
    <div className="w-full h-full">
      {/* Wrap the ElizaOS client with its own providers */}
      <QueryClientProvider client={elizaQueryClient}>
        <div className="dark antialiased font-sans" style={{ colorScheme: 'dark' }}>
          <BrowserRouter basename="/agents">
            {/* Import and render the actual ElizaOS client App */}
            <App />
          </BrowserRouter>
        </div>
      </QueryClientProvider>
    </div>
  );
};

export default AgentsPage;