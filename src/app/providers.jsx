import { Provider } from 'react-redux';
import { Suspense } from 'react';
import { store } from '../store';
import ErrorBoundary from '../components/layout/ErrorBoundary';

function LoadingFallback() {
  return (
    <div className="flex items-center justify-center h-screen bg-cyber-bg">
      <div className="text-center">
        <div className="inline-block animate-spin mb-4">🛡️</div>
        <p className="text-gray-400">Loading GuardianSync...</p>
      </div>
    </div>
  );
}

export function Providers({ children }) {
  return (
    <ErrorBoundary>
      <Provider store={store}>
        <Suspense fallback={<LoadingFallback />}>
          {children}
        </Suspense>
      </Provider>
    </ErrorBoundary>
  );
}
