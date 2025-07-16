
import React, { useState, useEffect, useRef } from 'react';
import { CUSTLogo } from './CUSTLogo';
import { UserCircleIcon, ArrowRightOnRectangleIcon } from './icons/UIIcons';

interface HeaderProps {
  onLogout: () => void;
  userEmail: string | null;
}

export const Header: React.FC<HeaderProps> = ({ onLogout, userEmail }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="bg-white/80 backdrop-blur-lg shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-3">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <CUSTLogo className="h-10 w-10 sm:h-12 sm:w-12 text-cust-blue" />
            <div className="flex flex-col">
              <span className="text-base sm:text-lg font-bold text-cust-blue tracking-tight leading-tight">CUSTECH CLINIC</span>
              <span className="text-xs sm:text-sm font-semibold text-slate-600 leading-tight">Drug Verification</span>
            </div>
          </div>
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setIsMenuOpen(prev => !prev)}
              className="p-1 sm:p-1.5 rounded-full text-slate-600 hover:text-cust-blue hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cust-blue transition-all"
              aria-expanded={isMenuOpen}
              aria-haspopup="true"
              aria-label="User menu"
            >
              <UserCircleIcon className="h-7 w-7 sm:h-8 sm:w-8" />
            </button>
            {isMenuOpen && (
              <div
                className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="user-menu-button"
              >
                {userEmail && (
                  <div className="px-4 py-3 border-b border-slate-200">
                    <p className="text-sm text-slate-500">Signed in as</p>
                    <p className="text-sm font-medium text-slate-800 truncate" title={userEmail}>
                      {userEmail}
                    </p>
                  </div>
                )}
                <div className="py-1">
                  <button
                    onClick={onLogout}
                    className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    role="menuitem"
                  >
                    <ArrowRightOnRectangleIcon className="w-5 h-5" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
