import { Routes, Route, Navigate } from 'react-router-dom';
import App from './App';
import RequireAuth from './RequireAuth';
import Landing from '../pages/Landing';
import Login from '../pages/Login';
import Signup from '../pages/Signup';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/landing" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route
        path="/app"
        element={
          <RequireAuth>
            <App />
          </RequireAuth>
        }
      />
      <Route path="/" element={<Navigate to="/landing" replace />} />
      <Route path="*" element={<Navigate to="/landing" replace />} />
    </Routes>
  );
}
