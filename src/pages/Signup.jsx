import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { api } from '../services/api';
import { setToken, setUser } from '../store/uiSlice';
import GoogleAuthButton from '../components/auth/GoogleAuthButton';
import { Shield, ArrowRight, Lock, User, Mail, ShieldCheck } from 'lucide-react';

export default function Signup() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const roleParam = params.get('role') || 'operator';
  
  const [form, setForm] = useState({ username: '', email: '', password: '', role: roleParam });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await api.signup(form);
      navigate('/login', { replace: true, state: { message: 'Account created successfully! Please sign in.' } });
    } catch (err) {
      setError(err.message || 'Signup failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = async ({ access_token }) => {
    setError('');
    setIsLoading(true);
    try {
      const { token, user } = await api.googleLogin(access_token, form.role);
      dispatch(setToken(token));
      dispatch(setUser(user));
      navigate('/app', { replace: true });
    } catch (err) {
      setError('Google Sign-In failed: ' + (err.message || 'Unknown error'));
      setIsLoading(false);
    }
  };

  return (
    <div className="enterprise-shell relative min-h-screen flex flex-col items-center justify-center p-6">
      {/* Background elements */}
      <div className="absolute inset-0 z-0 cyber-grid-bg opacity-20"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl h-96 rounded-full bg-cyber-accent/5 blur-[100px] pointer-events-none"></div>

      <Link to="/" className="absolute top-8 left-8 flex items-center gap-2 text-cyber-text-dim hover:text-cyber-accent transition-colors z-20 group">
        <Shield className="w-5 h-5 group-hover:scale-110 transition-transform" />
        <span className="text-xs tracking-[0.2em] uppercase font-semibold">GuardianSync</span>
      </Link>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-cyber-card/60 backdrop-blur-2xl border border-cyber-border rounded-2xl p-8 md:p-10 shadow-2xl relative overflow-hidden">
          
          {/* Top accent line */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyber-accent to-cyber-glow"></div>

          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-cyber-text tracking-tight mb-2">Request Access</h1>
            <p className="text-sm text-cyber-text-dim">
              Join GuardianSync to monitor and control operations securely.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-4">
              
              <div className="grid grid-cols-2 gap-4">
                <div className="relative group col-span-2">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-cyber-muted group-focus-within:text-cyber-accent transition-colors">
                    <User className="h-4 w-4" />
                  </div>
                  <input
                    type="text"
                    value={form.username}
                    onChange={(e) => setForm({ ...form, username: e.target.value })}
                    placeholder="Username"
                    className="w-full bg-cyber-bg/50 border border-cyber-border rounded-lg pl-10 pr-4 py-2.5 text-sm text-cyber-text focus:outline-none focus:border-cyber-accent/50 focus:ring-1 focus:ring-cyber-accent/50 transition-all"
                    required
                  />
                </div>
                
                <div className="relative group col-span-2">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-cyber-muted group-focus-within:text-cyber-accent transition-colors">
                    <Mail className="h-4 w-4" />
                  </div>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="Work Email"
                    className="w-full bg-cyber-bg/50 border border-cyber-border rounded-lg pl-10 pr-4 py-2.5 text-sm text-cyber-text focus:outline-none focus:border-cyber-accent/50 focus:ring-1 focus:ring-cyber-accent/50 transition-all"
                    required
                  />
                </div>

                <div className="relative group col-span-2">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-cyber-muted group-focus-within:text-cyber-accent transition-colors">
                    <Lock className="h-4 w-4" />
                  </div>
                  <input
                    type="password"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    placeholder="Create Password"
                    className="w-full bg-cyber-bg/50 border border-cyber-border rounded-lg pl-10 pr-4 py-2.5 text-sm text-cyber-text focus:outline-none focus:border-cyber-accent/50 focus:ring-1 focus:ring-cyber-accent/50 transition-all"
                    required
                  />
                </div>

                <div className="relative group col-span-2">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-cyber-muted group-focus-within:text-cyber-accent transition-colors">
                    <ShieldCheck className="h-4 w-4" />
                  </div>
                  <select
                    value={form.role}
                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                    className="w-full bg-cyber-bg/50 border border-cyber-border rounded-lg pl-10 pr-4 py-2.5 text-sm text-cyber-text focus:outline-none focus:border-cyber-accent/50 focus:ring-1 focus:ring-cyber-accent/50 transition-all appearance-none cursor-pointer"
                  >
                    <option value="operator">Role: Operator</option>
                    <option value="admin">Role: Admin</option>
                  </select>
                </div>
              </div>

            </div>

            {error && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs text-cyber-danger text-center bg-cyber-danger/10 py-2 rounded-md border border-cyber-danger/20">
                {error}
              </motion.p>
            )}

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full enterprise-button py-2.5 group relative overflow-hidden"
              style={{ backgroundColor: 'rgb(var(--cyber-accent))' }}
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {isLoading ? 'Creating Account...' : 'Create Account'}
                {!isLoading && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
              </span>
            </button>

            <div className="relative flex items-center py-2">
              <div className="flex-grow border-t border-cyber-border"></div>
              <span className="flex-shrink-0 mx-4 text-xs text-cyber-muted uppercase">or</span>
              <div className="flex-grow border-t border-cyber-border"></div>
            </div>

            <GoogleAuthButton
              onSuccess={handleGoogleSuccess}
              onError={() => setError('Google Sign-In failed. Please try again.')}
              text="Sign up with Google"
            />

            <div className="text-center mt-6">
              <p className="text-sm text-cyber-text-dim">
                Already have an account?{' '}
                <Link to={`/login?role=${form.role}`} className="text-cyber-accent hover:text-cyber-glow transition-colors font-medium">
                  Sign in instead
                </Link>
              </p>
            </div>
          </form>
        </div>
        
        {/* Footer info */}
        <p className="text-center text-xs text-cyber-muted mt-8">
          All access requests are logged and subject to <br /> administrator approval based on policy.
        </p>
      </motion.div>
    </div>
  );
}
