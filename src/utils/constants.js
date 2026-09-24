export const SEVERITY_COLORS = {
  CRITICAL: { bg: 'bg-red-500/20', text: 'text-red-400', border: 'border-red-500/40', dot: 'bg-red-500' },
  HIGH: { bg: 'bg-orange-500/20', text: 'text-orange-400', border: 'border-orange-500/40', dot: 'bg-orange-500' },
  MEDIUM: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', border: 'border-yellow-500/40', dot: 'bg-yellow-500' },
  LOW: { bg: 'bg-green-500/20', text: 'text-green-400', border: 'border-green-500/40', dot: 'bg-green-500' },
};

export const STATUS_COLORS = {
  online: 'text-cyber-success',
  warning: 'text-cyber-warning',
  danger: 'text-cyber-danger',
  offline: 'text-cyber-muted',
};

export const COMMAND_STATUS_COLORS = {
  approved: { bg: 'bg-emerald-500/20', text: 'text-emerald-400' },
  blocked: { bg: 'bg-red-500/20', text: 'text-red-400' },
  pending: { bg: 'bg-amber-500/20', text: 'text-amber-400' },
  executed: { bg: 'bg-cyan-500/20', text: 'text-cyan-400' },
  rejected: { bg: 'bg-gray-500/20', text: 'text-gray-400' },
  killed: { bg: 'bg-red-900/30', text: 'text-red-300' },
};

export const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: 'LayoutDashboard', roles: ['admin', 'operator'] },
  { id: 'map', label: 'Industry Map', icon: 'Map', roles: ['admin', 'operator'] },
  { id: 'commands', label: 'Command Console', icon: 'Terminal', roles: ['admin', 'operator'] },
  { id: 'alerts', label: 'Alerts', icon: 'ShieldAlert', roles: ['admin', 'operator'] },
  { id: 'forensic', label: 'Forensic Vault', icon: 'Archive', roles: ['admin', 'operator'] },
  { id: 'approval', label: 'Manual Approval', icon: 'CheckCircle', roles: ['admin'] },
];
