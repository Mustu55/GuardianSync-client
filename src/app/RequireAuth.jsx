import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { api } from '../services/api';
import { setUser, setToken } from '../store/uiSlice';
import Loader from '../components/common/Loader';

export default function RequireAuth({ children, roles }) {
  const dispatch = useDispatch();
  const token = useSelector((s) => s.ui.token);
  const user = useSelector((s) => s.ui.user);
  const [loading, setLoading] = useState(Boolean(token && !user));

  useEffect(() => {
    let mounted = true;
    const loadUser = async () => {
      if (!token || user) return;
      try {
        const me = await api.getMe();
        if (mounted) dispatch(setUser(me));
      } catch {
        if (mounted) dispatch(setToken(null));
      } finally {
        if (mounted) setLoading(false);
      }
    };
    loadUser();
    return () => {
      mounted = false;
    };
  }, [token, user, dispatch]);

  if (!token) return <Navigate to="/landing" replace />;
  if (loading) return <Loader text="Authenticating..." />;
  if (roles && user && !roles.includes(user.role)) return <Navigate to="/app" replace />;

  return children;
}
