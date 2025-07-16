import React from 'react';
import { CUSTLogo } from './CUSTLogo';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-400">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left space-y-8 md:space-y-0">
          <div className="flex items-center space-x-4">
            <CUSTLogo className="h-16 w-16 text-white flex-shrink-0" />
            <div>
              <p className="font-bold text-white text-lg">CUSTECH Clinic</p>
              <p className="text-sm">Your Health, Verified.</p>
            </div>
          </div>
          <div className="text-sm space-y-2">
            <p>&copy; {new Date().getFullYear()} CUSTECH Clinic. All rights reserved.</p>
            <p>This tool is for informational purposes only.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};