import { useSelector, useDispatch } from 'react-redux';
import { setCurrentIndustry } from '../../store/mapSlice';
import { INDUSTRY_TEMPLATES } from '../../utils/industryPresets';
import Badge from '../common/Badge';
import { Signal, SignalZero, Bell, User, Factory, Palette, ChevronDown } from 'lucide-react';
import { logout } from '../../store/uiSlice';
import { useLayoutEffect, useRef, useState } from 'react';
import { setActiveView } from '../../store/uiSlice';
import { acknowledgeAlert, setAlerts } from '../../store/alertSlice';
import { api } from '../../services/api';
import { setTheme } from '../../store/uiSlice';
import { gsap } from 'gsap';

export default function Topbar() {
  const dispatch = useDispatch();
  const connected = useSelector((s) => s.ui.connected);
  const killSwitch = useSelector((s) => s.ui.killSwitchActive);
  const maintenanceActive = useSelector((s) => s.ui.maintenanceActive);
  const currentIndustry = useSelector((s) => s.map.currentIndustry);
  const industries = useSelector((s) => s.map.industries);
  const alertStats = useSelector((s) => s.alerts.stats);
  const alerts = useSelector((s) => s.alerts.items);
  const unackCount = alerts.filter((alert) => !alert.acknowledged).length;
  const user = useSelector((s) => s.ui.user);
  const theme = useSelector((s) => s.ui.theme);
  const [showAlerts, setShowAlerts] = useState(false);
  const alertsRef = useRef(null);

  const themeOptions = [
    { value: 'dark', label: 'Dark' },
    { value: 'light', label: 'Light' },
    { value: 'graphite', label: 'Graphite' },
    { value: 'ocean', label: 'Ocean' },
    { value: 'emerald', label: 'Emerald' },
    { value: 'sunset', label: 'Sunset' },
    { value: 'ice', label: 'Ice' },
  ];

  const loadAlerts = async () => {
    try {
      const data = await api.getAlerts({ limit: 100 });
      dispatch(setAlerts(data));
      const stats = data.reduce(
        (acc, alert) => {
          acc.total += 1;
          if (alert.severity === 'CRITICAL') acc.critical += 1;
          if (alert.severity === 'HIGH') acc.high += 1;
          if (!alert.acknowledged) acc.unacknowledged += 1;
          return acc;
        },
        { total: 0, critical: 0, high: 0, unacknowledged: 0 }
      );
      dispatch(setAlertStats(stats));
    } catch {
      // Ignore alert fetch errors
    }
  };

  const handleAlertClick = () => {
    setShowAlerts((prev) => {
      const next = !prev;
      if (next) loadAlerts();
      return next;
    });
  };

  const handleViewAlerts = () => {
    dispatch(setActiveView('alerts'));
    setShowAlerts(false);
  };

  const handleAcknowledge = async (id) => {
    try {
      await api.acknowledgeAlert(id);
      dispatch(acknowledgeAlert(id));
    } catch {
      // Ignore errors for now
    }
  };

  useLayoutEffect(() => {
    if (!showAlerts || !alertsRef.current) return;
    gsap.fromTo(
      alertsRef.current,
      { autoAlpha: 0, y: -6, scale: 0.98 },
      { autoAlpha: 1, y: 0, scale: 1, duration: 0.2, ease: 'power2.out' }
    );
  }, [showAlerts]);

  return (
    <header className="h-14 bg-cyber-surface/80 backdrop-blur-md border-b border-cyber-border px-4 flex items-center justify-between z-10">
      {/* Left */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Factory size={16} className="text-cyber-muted" />
          <select
            value={currentIndustry}
            onChange={(e) => dispatch(setCurrentIndustry(e.target.value))}
            className="bg-cyber-card border border-cyber-border rounded-md px-2 py-1 text-sm text-cyber-text focus:outline-none focus:border-cyber-glow"
          >
            {industries.length > 0
              ? industries.map((item) => (
                  <option key={item.name} value={item.name}>{item.label || item.name}</option>
                ))
              : Object.entries(INDUSTRY_TEMPLATES).map(([key, val]) => (
                  <option key={key} value={key}>{val.label}</option>
                ))}
          </select>
        </div>

        {killSwitch && (
          <Badge variant="danger" pulse>
            ⚠ KILL SWITCH ACTIVE
          </Badge>
        )}
        {maintenanceActive && (
          <Badge variant="warning">Maintenance Window</Badge>
        )}
      </div>

      {/* Right */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          {connected ? (
            <Signal size={14} className="text-cyber-success" />
          ) : (
            <SignalZero size={14} className="text-cyber-danger" />
          )}
          <span className="text-xs text-cyber-text-dim">
            {connected ? 'Connected' : 'Disconnected'}
          </span>
        </div>

        <div className="relative">
          <button
            onClick={handleAlertClick}
            className="relative p-2 hover:bg-cyber-card rounded-lg transition-colors"
          >
          <Bell size={18} className="text-cyber-text-dim" />
          {unackCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
              {unackCount}
            </span>
          )}
          </button>

          {showAlerts && (
            <div
              ref={alertsRef}
              className="absolute right-0 mt-2 w-80 bg-cyber-card border border-cyber-border rounded-xl shadow-2xl z-40"
            >
              <div className="flex items-center justify-between px-3 py-2 border-b border-cyber-border">
                <span className="text-xs text-cyber-text-dim uppercase tracking-widest">
                  Notifications ({alerts.length})
                </span>
                <button
                  onClick={handleViewAlerts}
                  className="text-[10px] text-cyber-glow hover:text-cyan-300"
                >
                  View All
                </button>
              </div>
              <div className="max-h-64 overflow-auto">
                {alerts.map((alert) => (
                  <div key={alert._id || alert.timestamp} className="px-3 py-2 border-b border-cyber-border/60">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-cyber-text">{alert.title}</span>
                      {!alert.acknowledged && alert._id && (
                        <button
                          onClick={() => handleAcknowledge(alert._id)}
                          className="text-[10px] text-emerald-400 hover:text-emerald-300"
                        >
                          Ack
                        </button>
                      )}
                    </div>
                    <p className="text-[10px] text-cyber-muted mt-1 line-clamp-2">{alert.message}</p>
                  </div>
                ))}
                {alerts.length === 0 && (
                  <div className="px-3 py-6 text-center text-xs text-cyber-muted">No alerts yet</div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="relative flex items-center gap-2 rounded-lg border border-cyber-border bg-cyber-card/80 px-2 py-1.5 shadow-sm transition-colors hover:border-cyber-glow/40 focus-within:ring-2 focus-within:ring-cyber-glow/30">
          <Palette size={16} className="text-cyber-text-dim" />
          <select
            value={theme}
            onChange={(e) => dispatch(setTheme(e.target.value))}
            className="appearance-none bg-cyber-card text-xs text-cyber-text focus:outline-none pr-6"
            aria-label="Theme"
          >
            {themeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown size={14} className="absolute right-2 text-cyber-text-dim pointer-events-none" />
        </div>

        {user && (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-2 py-1 bg-cyber-card rounded-lg">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                <User size={12} className="text-white" />
              </div>
              <span className="text-xs text-cyber-text-dim">{user.username}</span>
              <span className="text-[10px] text-cyber-muted uppercase">{user.role}</span>
            </div>
            <button
              onClick={() => dispatch(logout())}
              className="px-3 py-1.5 bg-cyber-card border border-cyber-border rounded-lg text-xs text-cyber-text-dim hover:border-cyber-glow/30 transition-colors"
            >
              Logout
            </button>
          </div>
        )}
      </div>

    </header>
  );
}
