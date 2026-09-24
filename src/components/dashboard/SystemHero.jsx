import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { ShieldCheck, Radar, Activity, Wrench, Server } from 'lucide-react';

export default function SystemHero() {
  const connected = useSelector((s) => s.ui.connected);
  const threatScore = useSelector((s) => s.ui.threatScore);
  const simulationMode = useSelector((s) => s.ui.simulationMode);
  const maintenanceActive = useSelector((s) => s.ui.maintenanceActive);
  const alertStats = useSelector((s) => s.alerts.stats);

  const threatPercent = Math.round(threatScore * 100);
  const threatColor = threatPercent > 70 ? 'text-red-400' : threatPercent > 40 ? 'text-amber-400' : 'text-emerald-400';

  return (
    <motion.section
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_280px] gap-6"
    >
      <div className="cyber-card cyber-hero p-6 border border-cyber-glow/20">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-cyber-muted uppercase tracking-[0.3em]">GuardianSync</p>
            <h2 className="text-2xl lg:text-3xl font-semibold text-cyber-text mt-2">
              Live System Defense Grid
            </h2>
            <p className="text-sm text-cyber-text-dim mt-2 max-w-xl">
              Monitoring industrial command streams, anomaly scores, and critical nodes in real-time.
            </p>
          </div>
          <div className="hidden lg:flex items-center gap-3 px-4 py-2 rounded-xl border border-cyber-border bg-cyber-bg/40">
            <Server size={18} className={connected ? 'text-emerald-400' : 'text-red-400'} />
            <span className="text-xs text-cyber-text-dim">
              {connected ? 'SYSTEM ONLINE' : 'OFFLINE'}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          <div className="bg-cyber-bg/50 border border-cyber-border rounded-xl p-3">
            <div className="flex items-center gap-2 text-xs text-cyber-muted">
              <ShieldCheck size={14} className="text-emerald-400" />
              Health
            </div>
            <p className="text-lg font-semibold text-cyber-text mt-2">{connected ? 'Stable' : 'Disconnected'}</p>
          </div>
          <div className="bg-cyber-bg/50 border border-cyber-border rounded-xl p-3">
            <div className="flex items-center gap-2 text-xs text-cyber-muted">
              <Radar size={14} className="text-cyan-400" />
              Threat Score
            </div>
            <p className={`text-lg font-semibold mt-2 ${threatColor}`}>{threatPercent}%</p>
          </div>
          <div className="bg-cyber-bg/50 border border-cyber-border rounded-xl p-3">
            <div className="flex items-center gap-2 text-xs text-cyber-muted">
              <Activity size={14} className="text-cyber-glow" />
              Mode
            </div>
            <p className="text-lg font-semibold text-cyber-text mt-2">{simulationMode.toUpperCase()}</p>
          </div>
          <div className="bg-cyber-bg/50 border border-cyber-border rounded-xl p-3">
            <div className="flex items-center gap-2 text-xs text-cyber-muted">
              <Wrench size={14} className="text-amber-400" />
              Maintenance
            </div>
            <p className="text-lg font-semibold text-cyber-text mt-2">
              {maintenanceActive ? 'LOCKDOWN' : 'Clear'}
            </p>
          </div>
        </div>
      </div>

      <div className="cyber-card p-5 flex flex-col justify-between">
        <div>
          <p className="text-xs text-cyber-muted uppercase tracking-[0.3em]">Alerts</p>
          <h3 className="text-2xl font-semibold text-cyber-text mt-3">{alertStats.total}</h3>
          <p className="text-xs text-cyber-text-dim mt-1">Total incidents logged</p>
        </div>
        <div className="space-y-2 mt-6 text-xs">
          <div className="flex items-center justify-between text-cyber-text-dim">
            <span>Critical</span>
            <span className="text-red-400 font-semibold">{alertStats.critical}</span>
          </div>
          <div className="flex items-center justify-between text-cyber-text-dim">
            <span>High</span>
            <span className="text-amber-400 font-semibold">{alertStats.high}</span>
          </div>
          <div className="flex items-center justify-between text-cyber-text-dim">
            <span>Unacknowledged</span>
            <span className="text-cyber-accent font-semibold">{alertStats.unacknowledged}</span>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
