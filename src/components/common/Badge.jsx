import { cn } from '../../utils/formatters';
import { SEVERITY_COLORS, COMMAND_STATUS_COLORS } from '../../utils/constants';

export default function Badge({ children, variant = 'default', severity, status, className, pulse }) {
  const colors = severity ? SEVERITY_COLORS[severity]
    : status ? COMMAND_STATUS_COLORS[status]
    : null;

  const baseClasses = 'inline-flex max-w-full items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold';

  const variantClasses = {
    default: 'bg-cyber-border text-cyber-text-dim',
    glow: 'bg-cyber-glow/20 text-cyber-accent border border-cyber-glow/30',
    danger: 'bg-red-500/20 text-red-400 border border-red-500/30',
    success: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
    warning: 'bg-amber-500/20 text-amber-400 border border-amber-500/30',
    secondary: 'bg-cyber-card text-cyber-text-dim border border-cyber-border',
  };

  return (
    <span className={cn(
      baseClasses,
      colors ? `${colors.bg} ${colors.text}` : variantClasses[variant],
      pulse && 'animate-pulse',
      className
    )}>
      {severity && <span className={cn('w-1.5 h-1.5 rounded-full', colors?.dot)} />}
      {children}
    </span>
  );
}
