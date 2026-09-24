import { motion } from 'framer-motion';

export default function Loader({ size = 'md', text }) {
  const sizeMap = { sm: 'w-6 h-6', md: 'w-10 h-10', lg: 'w-16 h-16' };

  return (
    <div className="flex flex-col items-center justify-center gap-3 p-8">
      <motion.div
        className={`${sizeMap[size]} border-2 border-cyber-border border-t-cyber-glow rounded-full`}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      />
      {text && (
        <p className="text-sm text-cyber-text-dim animate-pulse">{text}</p>
      )}
    </div>
  );
}
