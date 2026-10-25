import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { MobileNav } from './MobileNav';

export const AppLayout: React.FC = () => {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  return (
    <div className="app-container">
      <Sidebar />
      <MobileNav isOpen={isMobileNavOpen} onClose={() => setIsMobileNavOpen(false)} />

      <div className="main-content-area">
        <TopBar onOpenMobileNav={() => setIsMobileNavOpen(true)} />
        <main className="page-viewport">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
