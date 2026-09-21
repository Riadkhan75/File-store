import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth, isAuthorizedAdminEmail } from './context/AuthContext';
import { StoreProvider } from './context/StoreContext';
import { ToastContainer } from './components/common/ToastContainer';
import { PublicHome } from './components/public/PublicHome';
import { AdminLogin } from './components/admin/AdminLogin';
import { AdminDashboard } from './components/admin/AdminDashboard';

const AppContent: React.FC = () => {
  const { user, isAdmin, adminSessionActive, loading: authLoading } = useAuth();

  // Helper to determine if current URL matches /adminriad
  const checkIsAdminRoute = () => {
    const path = window.location.pathname.toLowerCase();
    const hash = window.location.hash.toLowerCase();
    return (
      path === '/adminriad' ||
      path === '/adminriad/' ||
      hash === '#/adminriad' ||
      hash === '#adminriad'
    );
  };

  const [isAdminRoute, setIsAdminRoute] = useState<boolean>(checkIsAdminRoute);

  useEffect(() => {
    const handleLocationChange = () => {
      setIsAdminRoute(checkIsAdminRoute());
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);

    // Keyboard shortcut (Ctrl + Shift + A) for admin convenience in iframe previews
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        navigateToAdmin();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const navigateToAdmin = () => {
    window.history.pushState({}, '', '/adminriad');
    setIsAdminRoute(true);
  };

  const navigateToHome = () => {
    window.history.pushState({}, '', '/');
    setIsAdminRoute(false);
  };

  // If visiting /adminriad
  if (isAdminRoute) {
    if (authLoading) {
      return (
        <div className="min-h-screen bg-[#08080a] flex flex-col items-center justify-center p-4">
          <div className="w-12 h-12 rounded-xl bg-neutral-900 border border-amber-400/40 flex items-center justify-center text-amber-400 text-xl animate-spin mb-3">
            <i className="fa-solid fa-circle-notch"></i>
          </div>
          <p className="text-xs text-neutral-400 font-mono tracking-wider uppercase">
            Verifying Admin Authentication...
          </p>
        </div>
      );
    }

    // Strict Admin Authorization Check:
    // 1. User must be signed in
    // 2. User email MUST match master admin list (banglag215@gmail.com or nazrulpost75@gmail.com)
    // 3. User must have isAdmin privilege
    // 4. User MUST have actively authenticated the admin session in this browser session
    const isAuthorizedAdmin =
      Boolean(user) &&
      isAdmin &&
      isAuthorizedAdminEmail(user?.email) &&
      adminSessionActive;

    if (!isAuthorizedAdmin) {
      return <AdminLogin onBackToHome={navigateToHome} />;
    }

    return <AdminDashboard onViewStore={navigateToHome} />;
  }

  // Public Storefront View
  return <PublicHome />;
};

export default function App() {
  return (
    <AuthProvider>
      <StoreProvider>
        <AppContent />
        <ToastContainer />
      </StoreProvider>
    </AuthProvider>
  );
}
