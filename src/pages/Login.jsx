import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useSearchParams, useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../services/api';
import { setToken, setUser } from '../store/uiSlice';
import GoogleAuthButton from '../components/auth/GoogleAuthButton';
import { Shield, ArrowRight, Lock, User, KeyRound } from 'lucide-react';

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [params] = useSearchParams();
  const role = params.get('role') || 'operator';
  
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // OTP State
  const [otpRequired, setOtpRequired] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [tempUserId, setTempUserId] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const res = await api.login(form);
      if (res.requireOtp) {
        setOtpRequired(true);
        setTempUserId(res.userId);
      } else {
        dispatch(setToken(res.token));
        dispatch(setUser(res.user));
        navigate('/app', { replace: true });
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const { token, user } = await api.verifyOtp({ userId: tempUserId, otpCode });
      dispatch(setToken(token));
      dispatch(setUser(user));
      navigate('/app', { replace: true });
    } catch (err) {
      setError(err.message || 'OTP Verification failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = async ({ access_token }) => {
    setError('');
    setIsLoading(true);
    try {
      const { token, user } = await api.googleLogin(access_token, role);
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
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl h-96 rounded-full bg-cyber-glow/5 blur-[100px] pointer-events-none"></div>

      <Link to="/" className="absolute top-8 left-8 flex items-center gap-2 text-cyber-text-dim hover:text-cyber-glow transition-colors z-20 group">
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
          <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${role === 'admin' ? 'from-cyber-glow to-cyber-accent' : 'from-cyber-accent to-cyber-glow'}`}></div>

          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-cyber-text tracking-tight mb-2">Welcome Back</h1>
            <p className="text-sm text-cyber-text-dim">
              Sign in to your <span className="text-cyber-glow font-medium capitalize">{role}</span> console
            </p>
          </div>

          {location.state?.message && (
            <div className="mb-6 p-3 rounded-lg bg-cyber-success/10 border border-cyber-success/30 text-cyber-success text-sm text-center">
              {location.state.message}
            </div>
          )}

          <AnimatePresence mode="wait">
            {!otpRequired ? (
              <motion.form 
                key="login-form"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                onSubmit={handleSubmit} 
                className="space-y-5"
              >
                <div className="space-y-4">
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-cyber-muted group-focus-within:text-cyber-glow transition-colors">
                      <User className="h-4 w-4" />
                    </div>
                    <input
                      type="text"
                      value={form.username}
                      onChange={(e) => setForm({ ...form, username: e.target.value })}
                      placeholder="Username"
                      className="w-full bg-cyber-bg/50 border border-cyber-border rounded-lg pl-10 pr-4 py-2.5 text-sm text-cyber-text focus:outline-none focus:border-cyber-glow/50 focus:ring-1 focus:ring-cyber-glow/50 transition-all"
                      required
                    />
                  </div>
                  
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-cyber-muted group-focus-within:text-cyber-glow transition-colors">
                      <Lock className="h-4 w-4" />
                    </div>
                    <input
                      type="password"
                      value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                      placeholder="Password"
                      className="w-full bg-cyber-bg/50 border border-cyber-border rounded-lg pl-10 pr-4 py-2.5 text-sm text-cyber-text focus:outline-none focus:border-cyber-glow/50 focus:ring-1 focus:ring-cyber-glow/50 transition-all"
                      required
                    />
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
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {isLoading ? 'Authenticating...' : 'Sign In'}
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
                  text="Continue with Google"
                />

                <div className="text-center mt-6">
                  <p className="text-sm text-cyber-text-dim">
                    Don't have an account?{' '}
                    <Link to={`/signup?role=${role}`} className="text-cyber-glow hover:text-cyber-accent transition-colors font-medium">
                      Request access
                    </Link>
                  </p>
                </div>
              </motion.form>
            ) : (
              <motion.form 
                key="otp-form"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onSubmit={handleOtpSubmit} 
                className="space-y-6"
              >
                <div className="text-center mb-6">
                  <div className="w-12 h-12 bg-cyber-glow/10 border border-cyber-glow/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <KeyRound className="w-6 h-6 text-cyber-glow" />
                  </div>
                  <p className="text-sm text-cyber-text-dim">
                    Please enter the 6-digit verification code sent to your email.
                  </p>
                </div>
                
                <div>
                  <input
                    type="text"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="000000"
                    className="w-full bg-cyber-bg/50 border border-cyber-border rounded-lg px-4 py-4 text-2xl text-center tracking-[0.5em] font-mono text-cyber-text focus:outline-none focus:border-cyber-glow/50 focus:ring-1 focus:ring-cyber-glow/50 transition-all placeholder:text-cyber-muted/30"
                    maxLength={6}
                    required
                  />
                </div>

                {error && (
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs text-cyber-danger text-center bg-cyber-danger/10 py-2 rounded-md border border-cyber-danger/20">
                    {error}
                  </motion.p>
                )}

                <div className="space-y-3">
                  <button 
                    type="submit" 
                    disabled={isLoading || otpCode.length < 6}
                    className="w-full enterprise-button py-2.5 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? 'Verifying...' : 'Verify & Continue'}
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => {
                      setOtpRequired(false);
                      setOtpCode('');
                      setError('');
                    }}
                    className="w-full enterprise-button-secondary py-2.5 text-cyber-text-dim hover:text-cyber-text"
                  >
                    Back to login
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
        
        {/* Footer info */}
        <p className="text-center text-xs text-cyber-muted mt-8">
          Protected by GuardianSync Enterprise Security. <br />
          Unauthorized access is strictly prohibited.
        </p>
      </motion.div>
    </div>
  );
}
