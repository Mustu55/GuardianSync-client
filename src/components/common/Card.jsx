import { cn } from '../../utils/formatters';
import { motion } from 'framer-motion';

export default function Card({ children, className, glow, danger, ...props }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={cn(
        'cyber-card',
        glow && 'border-cyber-glow/40 shadow-glow',
        danger && 'border-cyber-danger/40 shadow-glow-danger',
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
}

Card.Header = function CardHeader({ children, className }) {
  return (
    <div className={cn('flex items-center justify-between mb-3', className)}>
      {children}
    </div>
  );
};

Card.Title = function CardTitle({ children, className }) {
  return (
    <h3 className={cn('text-sm font-semibold text-cyber-text-dim uppercase tracking-wider', className)}>
      {children}
    </h3>
  );
};
