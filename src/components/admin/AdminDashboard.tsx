import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { AdminTab } from '../../types';
import { AdminSidebar } from './AdminSidebar';
import { AdminOverview } from './AdminOverview';
import { AdminFiles } from './AdminFiles';
import { AdminCategories } from './AdminCategories';
import { AdminUsers } from './AdminUsers';
import { AdminReports } from './AdminReports';
import { AdminBanner } from './AdminBanner';
import { AdminMonetization } from './AdminMonetization';
import { AdminLogs } from './AdminLogs';
import { AdminSettings } from './AdminSettings';
import { AdminBranding } from './AdminBranding';
import { AdminSocialLinks } from './AdminSocialLinks';
import { AdminAppearance } from './AdminAppearance';
import { AdminStats } from './AdminStats';
import { AdminBackup } from './AdminBackup';
import { AdminAccount } from './AdminAccount';

interface AdminDashboardProps {
  onViewStore: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onViewStore }) => {
  const { user, logout } = useAuth();
  const [currentTab, setCurrentTab] = useState<AdminTab>('overview');
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  const renderTabContent = () => {
    switch (currentTab) {
      case 'overview':
        return <AdminOverview onNavigateTab={setCurrentTab} />;
      case 'files':
        return <AdminFiles />;
      case 'categories':
        return <AdminCategories />;
      case 'users':
        return <AdminUsers />;
      case 'reports':
        return <AdminReports />;
      case 'banner':
        return <AdminBanner />;
      case 'monetization':
        return <AdminMonetization />;
      case 'logs':
        return <AdminLogs />;
      case 'settings':
        return <AdminSettings />;
      case 'branding':
        return <AdminBranding />;
      case 'social':
        return <AdminSocialLinks />;
      case 'appearance':
        return <AdminAppearance />;
      case 'stats':
        return <AdminStats />;
      case 'backup':
        return <AdminBackup />;
      case 'account':
        return <AdminAccount />;
      default:
        return <AdminOverview onNavigateTab={setCurrentTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#08080a] text-white flex flex-col lg:flex-row">
      {/* Sidebar (Desktop & Mobile Drawer) */}
      <AdminSidebar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        onLogout={logout}
        onViewStore={onViewStore}
        isMobileOpen={isMobileNavOpen}
        onCloseMobile={() => setIsMobileNavOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        {/* Top Navbar */}
        <header className="h-16 border-b border-neutral-800 bg-neutral-950/80 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            {/* Mobile Hamburger */}
            <button
              id="mobile-nav-toggle"
              onClick={() => setIsMobileNavOpen(true)}
              className="lg:hidden p-2 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white"
              aria-label="Open Navigation"
            >
              <i className="fa-solid fa-bars text-base"></i>
            </button>

            <span className="text-xs uppercase tracking-widest font-black text-amber-400 hidden sm:inline-block">
              {currentTab}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* View Store Quick Link */}
            <button
              onClick={onViewStore}
              className="px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <i className="fa-solid fa-store text-amber-400 text-xs"></i>
              <span className="hidden sm:inline">Public Store</span>
            </button>

            {/* Admin User Chip */}
            <div className="flex items-center gap-2 pl-2 border-l border-neutral-800">
              <div className="w-7 h-7 rounded-full bg-amber-400/20 border border-amber-400/50 flex items-center justify-center text-amber-400 text-xs font-bold">
                <i className="fa-solid fa-user"></i>
              </div>
              <span className="text-xs text-neutral-300 font-medium truncate max-w-[140px] hidden sm:inline">
                {user?.email || 'Admin'}
              </span>
            </div>
          </div>
        </header>

        {/* Dynamic Tab Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-6xl w-full mx-auto">
          {renderTabContent()}
        </main>
      </div>
    </div>
  );
};
