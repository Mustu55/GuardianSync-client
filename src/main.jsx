import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Providers } from './app/providers';
import AppRoutes from './app/routes';
import { GoogleOAuthProvider } from '@react-oauth/google';
import './styles/themes.css';
import './styles/globals.css';

// Using import.meta.env for Vite environment variables
const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
if (!clientId) {
  throw new Error(
    'VITE_GOOGLE_CLIENT_ID is not defined. Please add it to client/.env and restart the dev server.'
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Providers>
        <GoogleOAuthProvider clientId={clientId}>
          <AppRoutes />
        </GoogleOAuthProvider>
      </Providers>
    </BrowserRouter>
  </React.StrictMode>
);
