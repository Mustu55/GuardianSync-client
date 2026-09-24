import { useSelector, useDispatch } from 'react-redux';
import { dismissAlertModal } from '../../store/alertSlice';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, X, AlertTriangle } from 'lucide-react';
import Button from '../common/Button';
import Badge from '../common/Badge';

export default function AlertModal() {
  const dispatch = useDispatch();
  const latestAlert = useSelector((s) => s.alerts.latestAlert);
  const showModal = useSelector((s) => s.alerts.showAlertModal);

  const detailLines = [
    latestAlert?.metadata?.reasonSummary,
    latestAlert?.metadata?.holdReason ? `Approval reason: ${latestAlert.metadata.holdReason.replace(/_/g, ' ')}` : null,
    latestAlert?.metadata?.risk ? `Risk catalog: ${latestAlert.metadata.risk}` : null,
    latestAlert?.metadata?.ruleFlags?.length
      ? `Rule flags: ${latestAlert.metadata.ruleFlags.slice(0, 4).join('; ')}`
      : null,
    latestAlert?.metadata?.aiExplanation ? `AI signal: ${latestAlert.metadata.aiExplanation}` : null,
  ].filter(Boolean);

  if (!showModal || !latestAlert) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          onClick={() => dispatch(dismissAlertModal())}
        />

        {/* Modal */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="relative bg-cyber-card border-2 border-red-500/50 rounded-2xl p-6 max-w-lg w-full shadow-2xl shadow-red-500/20"
        >
          {/* Pulsing border effect */}
          <div className="absolute inset-0 rounded-2xl border border-red-500/20 animate-ping pointer-events-none" />

          {/* Close button */}
          <button
            onClick={() => dispatch(dismissAlertModal())}
            className="absolute top-4 right-4 text-cyber-muted hover:text-cyber-text transition-colors"
          >
            <X size={20} />
          </button>

          {/* Icon */}
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center border-2 border-red-500/40 animate-pulse">
              <ShieldAlert size={32} className="text-red-400" />
            </div>
          </div>

          {/* Content */}
          <div className="text-center mb-4">
            <Badge severity={latestAlert.severity} pulse className="mb-2">
              {latestAlert.severity} ALERT
            </Badge>
            <h2 className="text-xl font-bold text-cyber-text mt-2">{latestAlert.title}</h2>
          </div>

          <div className="bg-cyber-bg/60 rounded-lg p-4 mb-4 border border-cyber-border">
            <div className="flex items-start gap-2">
              <AlertTriangle size={16} className="text-red-400 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-cyber-text-dim leading-relaxed">{latestAlert.message}</p>
            </div>
          </div>

          {detailLines.length > 0 && (
            <div className="bg-cyber-bg/40 rounded-lg p-3 mb-4 border border-cyber-border text-[12px] text-cyber-text-dim space-y-1">
              {detailLines.map((line, index) => (
                <div key={`alert-detail-${index}`}>{line}</div>
              ))}
            </div>
          )}

          {latestAlert.targetMachine && (
            <div className="flex items-center justify-between text-sm mb-4 px-1">
              <span className="text-cyber-muted">Target:</span>
              <span className="font-mono text-cyber-accent">{latestAlert.targetMachine}</span>
            </div>
          )}

          {latestAlert.anomalyScore != null && (
            <div className="flex items-center justify-between text-sm mb-4 px-1">
              <span className="text-cyber-muted">Anomaly Score:</span>
              <span className="font-mono text-red-400 font-bold">
                {(latestAlert.anomalyScore * 100).toFixed(1)}%
              </span>
            </div>
          )}

          <div className="flex gap-3">
            <Button variant="danger" className="flex-1" onClick={() => dispatch(dismissAlertModal())}>
              Acknowledge
            </Button>
            <Button variant="secondary" className="flex-1" onClick={() => dispatch(dismissAlertModal())}>
              Dismiss
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
