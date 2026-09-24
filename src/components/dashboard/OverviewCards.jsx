import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Shield, ShieldAlert, ShieldCheck, Activity, Server, AlertTriangle } from 'lucide-react';

const cards = [
  { id: 'total', label: 'Total Commands', icon: Server, color: 'from-cyan-500 to-blue-600' },
  { id: 'blocked', label: 'Blocked', icon: ShieldAlert, color: 'from-red-500 to-rose-600' },
  { id: 'approved', label: 'Approved', icon: ShieldCheck, color: 'from-emerald-500 to-green-600' },
  { id: 'pending', label: 'Pending Review', icon: AlertTriangle, color: 'from-amber-500 to-orange-600' },
];

export default function OverviewCards({ alertsOnly }) {
  const recent = useSelector((s) => s.commands.recent);
  const commandStats = useSelector((s) => s.commands.stats);
  const alertStats = useSelector((s) => s.alerts.stats);
  const threatScore = useSelector((s) => s.ui.threatScore);
  const pendingCount = useSelector((s) => s.commands.pending.length);

  const blockedCount = recent.filter(c => c.status === 'blocked').length;
  const approvedCount = recent.filter(c => c.status === 'approved').length;

  const stats = {
    total: recent.length || commandStats.total,
    blocked: blockedCount || commandStats.blocked,
    approved: approvedCount || commandStats.approved,
    pending: pendingCount || commandStats.pending,
  };

  const displayCards = alertsOnly
    ? [
        { id: 'alerts', label: 'Total Alerts', icon: ShieldAlert, color: 'from-red-500 to-rose-600', value: alertStats.total },
        { id: 'critical', label: 'Critical', icon: AlertTriangle, color: 'from-red-600 to-red-800', value: alertStats.critical },
        { id: 'unack', label: 'Unacknowledged', icon: Activity, color: 'from-amber-500 to-orange-600', value: alertStats.unacknowledged },
        { id: 'threat', label: 'Threat Level', icon: Shield, color: 'from-cyan-500 to-blue-600', value: `${(threatScore * 100).toFixed(0)}%` },
      ]
    : cards.map(c => ({ ...c, value: stats[c.id] }));

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
      {displayCards.map((card, i) => {
        const Icon = card.icon;
        return (
          <motion.div
            key={card.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08, duration: 0.3 }}
            className="cyber-card group hover:border-cyber-glow/30"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${card.color} flex items-center justify-center shadow-lg`}>
                <Icon size={20} className="text-white" />
              </div>
              <span className="text-2xl lg:text-3xl font-bold text-cyber-text">{card.value ?? 0}</span>
            </div>
            <p className="text-xs text-cyber-text-dim uppercase tracking-wider">{card.label}</p>
            <div className={`mt-2 h-0.5 rounded-full bg-gradient-to-r ${card.color} opacity-30 group-hover:opacity-60 transition-opacity`} />
          </motion.div>
        );
      })}
    </div>
  );
}
