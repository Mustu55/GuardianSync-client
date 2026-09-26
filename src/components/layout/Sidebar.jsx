import { useSelector, useDispatch } from 'react-redux';
import { setActiveView } from '../../store/uiSlice';
import { NAV_ITEMS } from '../../utils/constants';
import { cn } from '../../utils/formatters';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, Map, Terminal, ShieldAlert,
  Archive, CheckCircle, Shield, ChevronLeft, ChevronRight, X
} from 'lucide-react';
import { toggleSidebar } from '../../store/uiSlice';
import { acknowledgeAllAlerts } from '../../store/alertSlice';
import { api } from '../../services/api';

const iconMap = {
  LayoutDashboard, Map, Terminal, ShieldAlert, Archive, CheckCircle,
};

export default function Sidebar() {
  const dispatch = useDispatch();
  const activeView = useSelector((s) => s.ui.activeView);
  const sidebarOpen = useSelector((s) => s.ui.sidebarOpen);
  const alerts = useSelector((s) => s.alerts.items);
  const pendingRequestCount = useSelector((s) => s.ui.pendingRequestCount);
  const unackAlerts = alerts.filter((alert) => !alert.acknowledged);
  const unackCount = unackAlerts.length;
  const role = useSelector((s) => s.ui.user?.role || 'operator');

  const handleNavClick = (itemId) => {
    dispatch(setActiveView(itemId));
    if (itemId === 'alerts' && unackAlerts.length > 0) {
      dispatch(acknowledgeAllAlerts());
      void Promise.all(
        unackAlerts.map((alert) => (alert._id ? api.acknowledgeAlert(alert._id) : Promise.resolve()))
      ).catch(() => {
        // Ignore ack errors for now
      });
    }
  };

  return (
    <>
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          onClick={() => dispatch(toggleSidebar())}
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
        />
      )}
      <motion.aside
      initial={false}
      animate={{ width: sidebarOpen ? 240 : 72 }}
      transition={{ duration: 0.2 }}
      className={`fixed inset-y-0 left-0 h-screen w-[240px] bg-cyber-surface border-r border-cyber-border flex flex-col z-40 lg:relative lg:z-20 ${sidebarOpen ? 'translate-x-0' : 'max-lg:-translate-x-full'} transition-transform duration-200`}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 h-16 border-b border-cyber-border">
        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center flex-shrink-0">
          <Shield size={20} className="text-white" />
        </div>
        {sidebarOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="overflow-hidden">
            <h1 className="text-lg font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              GuardianSync
            </h1>
            <p className="text-[10px] text-cyber-muted -mt-0.5 uppercase tracking-widest">Cyber Defense</p>
          </motion.div>
        )}
        {sidebarOpen && (
          <button
            onClick={() => dispatch(toggleSidebar())}
            className="ml-auto text-cyber-muted hover:text-cyber-text transition-colors"
            aria-label="Close sidebar"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-2 space-y-1">
        {NAV_ITEMS.filter((item) => !item.roles || item.roles.includes(role)).map((item) => {
          const Icon = iconMap[item.icon] || LayoutDashboard;
          const isActive = activeView === item.id;
          let badgeCount = 0;
          
          if (item.id === 'alerts') {
            badgeCount = unackCount;
          } else if (item.id === 'approval') {
            badgeCount = pendingRequestCount;
          }

          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200',
                isActive
                  ? 'bg-cyber-glow/10 text-cyber-accent border border-cyber-glow/20 shadow-glow'
                  : 'text-cyber-text-dim hover:text-cyber-text hover:bg-cyber-card'
              )}
            >
              <Icon size={20} className="flex-shrink-0" />
              {sidebarOpen && (
                <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 text-left">
                  {item.label}
                </motion.span>
              )}
              {sidebarOpen && badgeCount > 0 && (
                <span className={`${
                  item.id === 'approval' ? 'bg-amber-500' : 'bg-red-500'
                } text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center animate-pulse`}>
                  {badgeCount}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Collapse */}
      <button
        onClick={() => dispatch(toggleSidebar())}
        className="flex items-center justify-center h-12 border-t border-cyber-border text-cyber-muted hover:text-cyber-accent transition-colors"
      >
        {sidebarOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
      </button>
      </motion.aside>
    </>
  );
}
