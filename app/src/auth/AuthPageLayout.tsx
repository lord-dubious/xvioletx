import { ReactNode } from 'react';
import { X } from 'lucide-react';

export function AuthPageLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-cyber-black flex items-center justify-center px-4 font-mono">
      <div className="w-full max-w-md">
        <div className="bg-cyber-black border border-cyber-purple-600 shadow-[0_0_30px_rgba(119,0,221,0.3)] p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-cyber-purple-600 border border-cyber-purple-400 mb-4">
              <X className="w-6 h-6 text-cyber-black" />
            </div>
            <h1 className="text-2xl font-mono font-bold text-cyber-purple-200 mb-2 uppercase tracking-wider">
              Welcome to XTasker
            </h1>
            <p className="text-cyber-purple-400 font-mono">
              Manage your tasks with AI-powered assistance
            </p>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
