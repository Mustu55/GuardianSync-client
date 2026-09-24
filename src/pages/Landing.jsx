import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Users, ArrowRight, Activity, Lock, Database } from 'lucide-react';

const cards = [
  {
    role: 'admin',
    title: 'Admin Command Center',
    description: 'Approval queues, maintenance controls, and security oversight.',
    icon: Shield,
    color: 'text-cyber-glow',
    bg: 'bg-cyber-glow/10',
    border: 'border-cyber-glow/20'
  },
  {
    role: 'operator',
    title: 'Operator Console',
    description: 'Execute SCADA commands, monitor alerts, and view history.',
    icon: Users,
    color: 'text-cyber-accent',
    bg: 'bg-cyber-accent/10',
    border: 'border-cyber-accent/20'
  },
];

const features = [
  { icon: Activity, text: 'Real-time Threat Monitoring' },
  { icon: Lock, text: 'Zero-Trust Access Controls' },
  { icon: Database, text: 'Immutable Audit Trail' }
];

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="enterprise-shell relative overflow-hidden min-h-screen flex flex-col">
      {/* Abstract Background Elements */}
      <div className="absolute inset-0 z-0 cyber-grid-bg opacity-30"></div>
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-cyber-glow/5 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-cyber-accent/5 blur-[120px] pointer-events-none"></div>

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-8 py-6 w-full max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <Shield className="text-cyber-glow w-6 h-6" />
          <span className="text-sm font-bold text-cyber-text tracking-[0.2em] uppercase">GuardianSync</span>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/login')}
            className="text-sm text-cyber-text-dim hover:text-cyber-text transition-colors"
          >
            Sign In
          </button>
          <button
            onClick={() => navigate('/signup')}
            className="enterprise-button-secondary text-xs px-4 py-1.5"
          >
            Request Access
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 pb-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="max-w-3xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyber-card/50 border border-cyber-border backdrop-blur-md mb-8">
            <span className="w-2 h-2 rounded-full bg-cyber-success shadow-[0_0_8px_rgba(16,185,129,0.6)] animate-pulse"></span>
            <span className="text-xs text-cyber-text-dim uppercase tracking-wider font-medium">System Secure & Operational</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-white to-cyber-text-dim tracking-tight leading-[1.1] mb-6">
            Industrial Security, <br />
            <span className="text-cyber-glow cyber-glow-text">Orchestrated.</span>
          </h1>
          
          <p className="text-lg text-cyber-text-dim max-w-2xl mx-auto mb-12 font-light">
            Centralized approvals, real-time command execution, and deep forensic insight for critical infrastructure teams.
          </p>
        </motion.div>

        {/* Action Cards */}
        <div className="grid md:grid-cols-2 gap-6 w-full max-w-4xl mx-auto">
          {cards.map((card, index) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.role}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 + (index * 0.1) }}
                className="group relative"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-cyber-glow/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"></div>
                <div className="relative h-full flex flex-col bg-cyber-card/40 backdrop-blur-xl border border-cyber-border rounded-2xl p-8 hover:border-cyber-glow/30 transition-all duration-300">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 border ${card.bg} ${card.border}`}>
                    <Icon className={`w-6 h-6 ${card.color}`} />
                  </div>
                  
                  <h2 className="text-xl font-semibold text-cyber-text text-left mb-2">{card.title}</h2>
                  <p className="text-sm text-cyber-text-dim text-left mb-8 flex-1">{card.description}</p>
                  
                  <div className="flex gap-3 mt-auto">
                    <button
                      onClick={() => navigate(`/login?role=${card.role}`)}
                      className="flex-1 enterprise-button shadow-glow/20"
                    >
                      Sign In
                    </button>
                    <button
                      onClick={() => navigate(`/signup?role=${card.role}`)}
                      className="flex-1 enterprise-button-secondary"
                    >
                      Create Account
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Feature Pills */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-wrap justify-center gap-6 mt-16 text-cyber-text-dim"
        >
          {features.map((feature, i) => (
            <div key={i} className="flex items-center gap-2 text-sm">
              <feature.icon className="w-4 h-4 text-cyber-muted" />
              <span>{feature.text}</span>
            </div>
          ))}
        </motion.div>
      </main>
    </div>
  );
}
