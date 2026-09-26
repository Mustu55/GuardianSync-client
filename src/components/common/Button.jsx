import { cn } from '../../utils/formatters';

const variants = {
  primary: 'bg-cyber-glow hover:bg-cyan-500 text-cyber-bg font-semibold shadow-glow',
  secondary: 'bg-cyber-card border border-cyber-border hover:border-cyber-glow/40 text-cyber-text',
  danger: 'bg-red-600 hover:bg-red-500 text-white shadow-glow-danger',
  ghost: 'bg-transparent hover:bg-cyber-card text-cyber-text-dim hover:text-cyber-text',
  success: 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-glow-success',
  warning: 'bg-amber-500 hover:bg-amber-400 text-cyber-bg shadow-glow',
};

const sizes = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
};

export default function Button({
  children, variant = 'primary', size = 'md', className,
  disabled, loading, icon: Icon, ...props
}) {
  return (
    <button
      className={cn(
        'inline-flex min-w-0 whitespace-nowrap items-center justify-center gap-2 rounded-lg font-medium',
        'transition-all duration-200 active:scale-[0.97]',
        'disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100',
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      ) : Icon ? (
        <Icon size={16} />
      ) : null}
      {children}
    </button>
  );
}
