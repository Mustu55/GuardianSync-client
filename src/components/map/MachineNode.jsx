import { memo } from 'react';
import { Handle, Position } from 'reactflow';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import {
  Flame, Fan, Zap, CircuitBoard, Snowflake, Droplets, Filter,
  FlaskConical, Container, ArrowRightLeft, MoveRight, Cog,
  ArrowDownToLine, ScanLine, Package, ArrowUpDown, Wind, Server
} from 'lucide-react';

const iconMap = {
  Flame, Fan, Zap, CircuitBoard, Snowflake, Droplets, Filter,
  FlaskConical, Container, ArrowRightLeft, MoveRight, Cog,
  ArrowDownToLine, ScanLine, Package, ArrowUpDown, Wind, Server,
};

const statusConfig = {
  online: { border: 'border-emerald-500/50', glow: 'shadow-glow-success', dot: 'bg-emerald-500', bg: 'from-emerald-500/10 to-transparent' },
  warning: { border: 'border-amber-500/50', glow: '', dot: 'bg-amber-500', bg: 'from-amber-500/10 to-transparent' },
  danger: { border: 'border-red-500/50', glow: 'shadow-glow-danger', dot: 'bg-red-500', bg: 'from-red-500/10 to-transparent' },
  offline: { border: 'border-gray-600/50', glow: '', dot: 'bg-gray-500', bg: 'from-gray-500/10 to-transparent' },
};

function MachineNode({ data }) {
  const nodeStatuses = useSelector((s) => s.map.nodeStatuses);
  const commandPulses = useSelector((s) => s.map.commandPulses);
  const liveStatus = nodeStatuses[data.machineId];
  const status = liveStatus?.status || data.status || 'online';
  const config = statusConfig[status] || statusConfig.online;
  const Icon = iconMap[data.icon] || Server;
  const pulse = commandPulses.find((p) => p.nodeId === data.machineId);
  const pulseColor = pulse?.status === 'danger'
    ? 'border-red-500/60'
    : pulse?.status === 'warning'
    ? 'border-amber-400/60'
    : pulse
    ? 'border-emerald-400/60'
    : null;

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.05 }}
      className={`relative bg-cyber-card border-2 ${config.border} rounded-xl px-4 py-3 min-w-[150px]
        bg-gradient-to-b ${config.bg} ${config.glow} transition-all duration-300 cursor-pointer`}
    >
      <Handle type="target" position={Position.Left} className="!bg-cyber-glow !border-cyber-card !w-2 !h-2" />
      <Handle type="source" position={Position.Right} className="!bg-cyber-glow !border-cyber-card !w-2 !h-2" />

      <div className="flex items-center gap-2.5">
        <div className={`w-9 h-9 rounded-lg bg-cyber-bg/80 flex items-center justify-center border ${config.border}`}>
          <Icon size={18} className={status === 'danger' ? 'text-red-400' : status === 'warning' ? 'text-amber-400' : 'text-cyber-accent'} />
        </div>
        <div>
          <p className="text-sm font-semibold text-cyber-text leading-tight">{data.label}</p>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className={`w-1.5 h-1.5 rounded-full ${config.dot} ${status === 'danger' ? 'animate-pulse' : ''}`} />
            <span className="text-[10px] text-cyber-muted uppercase tracking-wider">{status}</span>
          </div>
        </div>
      </div>

      {/* Mini sensor readout */}
      {liveStatus?.sensors && (
        <div className="mt-2 pt-2 border-t border-cyber-border/50 grid grid-cols-2 gap-x-3 gap-y-0.5">
          {Object.entries(liveStatus.sensors).slice(0, 4).map(([key, val]) => (
            <div key={key} className="flex justify-between">
              <span className="text-[9px] text-cyber-muted truncate">{key.slice(0, 6)}</span>
              <span className="text-[9px] font-mono text-cyber-text-dim">{typeof val === 'number' ? val.toFixed(1) : val}</span>
            </div>
          ))}
        </div>
      )}

      {/* Pulse ring for danger */}
      {status === 'danger' && (
        <div className="absolute -inset-1 rounded-xl border border-red-500/30 animate-ping pointer-events-none" />
      )}

      {pulse && (
        <div className={`absolute -inset-2 rounded-2xl border ${pulseColor} animate-pulse pointer-events-none`} />
      )}
    </motion.div>
  );
}

export default memo(MachineNode);
