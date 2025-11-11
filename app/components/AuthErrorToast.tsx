'use client';

import { useAuth } from '../contexts/AuthContext';
import { useEffect } from 'react';

export function AuthErrorToast() {
  const { authError, clearError } = useAuth();

  useEffect(() => {
    if (authError) {
      // Auto-clear after animation
      const timer = setTimeout(() => {
        clearError();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [authError, clearError]);

  if (!authError) return null;

  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-in-from-top">
      <div className="bg-red-500/90 backdrop-blur-lg border border-red-400/50 rounded-2xl shadow-2xl p-4 min-w-[320px] max-w-[400px]">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-6 h-6 bg-red-400 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white mb-1">Authentication Error</p>
            <p className="text-xs text-red-100">{authError}</p>
          </div>
          <button
            onClick={clearError}
            className="flex-shrink-0 text-red-200 hover:text-white transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

