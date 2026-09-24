import { useSelector } from 'react-redux';
import { useEffect, useLayoutEffect, useRef } from 'react';
import { useSocket } from '../hooks/useSocket';
import { useIndustryMap } from '../hooks/useIndustryMap';
import Sidebar from '../components/layout/Sidebar';
import Topbar from '../components/layout/Topbar';
import StatusBar from '../components/layout/StatusBar';
import OverviewCards from '../components/dashboard/OverviewCards';
import SystemHero from '../components/dashboard/SystemHero';
import ThreatTimeline from '../components/dashboard/ThreatTimeline';
import PacketFeed from '../components/dashboard/PacketFeed';
import CommandConsole from '../components/dashboard/CommandConsole';
import ControlPanel from '../components/dashboard/ControlPanel';
import IndustryMap from '../components/map/IndustryMap';
import BlueprintUploadPanel from '../components/map/BlueprintUploadPanel';
import ManualApproval from '../components/security/ManualApproval';
import AlertModal from '../components/security/AlertModal';
import RiskMeter from '../components/security/RiskMeter';
import KillSwitch from '../components/security/KillSwitch';
import AnomalyPanel from '../components/dashboard/AnomalyPanel';
import { gsap } from 'gsap';

export default function App() {
  useSocket();
  useIndustryMap();

  const activeView = useSelector((s) => s.ui.activeView);
  const showAlertModal = useSelector((s) => s.alerts.showAlertModal);
  const role = useSelector((s) => s.ui.user?.role || 'operator');
  const theme = useSelector((s) => s.ui.theme);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const renderView = () => {
    switch (activeView) {
      case 'dashboard':
        return <DashboardView />;
      case 'map':
        return <MapView />;
      case 'commands':
        return <CommandView />;
      case 'alerts':
        return <AlertsView />;
      case 'forensic':
        return <ForensicView />;
      case 'approval':
        return role === 'admin' ? <ApprovalView /> : <DashboardView role={role} />;
      default:
        return <DashboardView role={role} />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-cyber-bg cyber-grid-bg">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-auto p-4 lg:p-6">
          <ViewTransition viewKey={activeView}>
            {renderView()}
          </ViewTransition>
        </main>
        <StatusBar />
      </div>
      {showAlertModal && <AlertModal />}
    </div>
  );
}

function ViewTransition({ viewKey, children }) {
  const containerRef = useRef(null);

  useLayoutEffect(() => {
    if (!containerRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        containerRef.current,
        { autoAlpha: 0, y: 12 },
        { autoAlpha: 1, y: 0, duration: 0.35, ease: 'power2.out' }
      );
    }, containerRef);
    return () => ctx.revert();
  }, [viewKey]);

  return (
    <div ref={containerRef} className="h-full">
      {children}
    </div>
  );
}

function DashboardView({ role }) {
  return (
    <div className="space-y-4 lg:space-y-6">
      <SystemHero />
      <OverviewCards />
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 lg:gap-6">
        <ThreatTimeline />
        <PacketFeed />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
        <RiskMeter />
        <AnomalyPanel />
        <div className="space-y-4">
          <KillSwitch />
          {role === 'admin' && <ControlPanel />}
        </div>
      </div>
    </div>
  );
}

function MapView() {
  const role = useSelector((s) => s.ui.user?.role || 'operator');
  return (
    <div className="h-full min-h-[600px] grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_320px] gap-6">
      <IndustryMap fullscreen />
      {role === 'admin' && (
        <div className="space-y-6">
          <BlueprintUploadPanel />
        </div>
      )}
    </div>
  );
}

function CommandView() {
  const role = useSelector((s) => s.ui.user?.role || 'operator');
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
      <CommandConsole expanded />
      <div className="space-y-6">
        {role === 'admin' && <ControlPanel />}
        <KillSwitch />
        <PacketFeed />
      </div>
    </div>
  );
}

function AlertsView() {
  return (
    <div className="space-y-6">
      <OverviewCards alertsOnly />
      <PacketFeed showAlerts />
    </div>
  );
}

function ForensicView() {
  return (
    <div className="space-y-6">
      <PacketFeed forensic />
    </div>
  );
}

function ApprovalView() {
  return <ManualApproval />;
}
