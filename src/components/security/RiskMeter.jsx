import { useSelector } from 'react-redux';
import Card from '../common/Card';
import { Gauge } from 'lucide-react';
import { motion } from 'framer-motion';

export default function RiskMeter() {
  const threatScore = useSelector((s) => s.ui.threatScore);
  const percent = Math.round(threatScore * 100);

  const getColor = () => {
    if (percent > 70) return { stroke: '#ef4444', text: 'text-red-400', label: 'CRITICAL', bg: 'from-red-500/20' };
    if (percent > 40) return { stroke: '#f59e0b', text: 'text-amber-400', label: 'ELEVATED', bg: 'from-amber-500/20' };
    return { stroke: '#10b981', text: 'text-emerald-400', label: 'NORMAL', bg: 'from-emerald-500/20' };
  };

  const color = getColor();
  const circumference = 2 * Math.PI * 54;
  const offset = circumference - (percent / 100) * circumference * 0.75; // 270° arc

  return (
    <Card>
      <Card.Header>
        <div className="flex items-center gap-2">
          <Gauge size={16} className="text-cyber-glow" />
          <Card.Title>Risk Level</Card.Title>
        </div>
      </Card.Header>

      <div className="flex flex-col items-center py-2">
        <div className="relative w-32 h-32">
          <svg className="w-full h-full -rotate-[135deg]" viewBox="0 0 120 120">
            {/* Track */}
            <circle cx="60" cy="60" r="54" fill="none" stroke="#1e293b" strokeWidth="8"
              strokeLinecap="round" strokeDasharray={`${circumference * 0.75} ${circumference * 0.25}`} />
            {/* Value */}
            <motion.circle
              cx="60" cy="60" r="54" fill="none" stroke={color.stroke} strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${circumference * 0.75} ${circumference * 0.25}`}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset: offset }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              style={{ filter: `drop-shadow(0 0 6px ${color.stroke}40)` }}
            />
          </svg>

          {/* Center text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.span
              key={percent}
              initial={{ scale: 1.2, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className={`text-2xl font-bold font-mono ${color.text}`}
            >
              {percent}%
            </motion.span>
          </div>
        </div>

        <div className={`mt-1 px-3 py-1 rounded-full bg-gradient-to-r ${color.bg} to-transparent`}>
          <span className={`text-xs font-semibold uppercase tracking-wider ${color.text}`}>
            {color.label}
          </span>
        </div>
      </div>
    </Card>
  );
}
