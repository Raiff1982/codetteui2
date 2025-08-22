import React, { useState, useEffect } from 'react';

interface SidebarProps {
  collapsed: boolean;
  children: React.ReactNode;
  onCollapse?: () => void;
}

export function Sidebar({ collapsed, children, onCollapse }: SidebarProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (collapsed && !isMobile) {
    return null;
  }

  return (
    <>
      <aside 
        className={`
          bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-r border-gray-200/50 dark:border-gray-700/50 
          transition-all duration-300 ease-in-out w-64
          ${isMobile ? 'fixed inset-y-0 left-0 z-40 shadow-2xl' : ''}
          ${collapsed && isMobile ? 'transform -translate-x-full' : ''}
        `}
      >
        <div className="h-full overflow-y-auto">
          {children}
        </div>
      </aside>
      
      {/* Mobile overlay */}
      {isMobile && !collapsed && (
        <div 
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-30"
          onClick={onCollapse}
        />
      )}
    </>
  );
}