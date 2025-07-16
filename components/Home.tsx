
import React from 'react';
import { CUSTLogo } from './CUSTLogo';
import { Footer } from './Footer';

interface HomeProps {
    onGetStarted: () => void;
    onNavigateToLogin: () => void;
}

const HomeHeader: React.FC<{onNavigateToLogin: () => void}> = ({onNavigateToLogin}) => (
    <header className="bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
                <div className="flex items-center space-x-3">
                    <CUSTLogo className="h-10 w-10 text-cust-blue" />
                     <div className="flex flex-col">
                        <span className="text-lg font-bold text-cust-blue tracking-tight leading-tight">CUSTECH CLINIC</span>
                        <span className="text-sm font-semibold text-slate-600 leading-tight">Drug Verification</span>
                    </div>
                </div>
                <button onClick={onNavigateToLogin} className="px-5 py-2 text-sm font-bold text-cust-blue bg-white border border-slate-200 rounded-lg shadow-sm hover:bg-slate-100 transition-colors">
                    Log In
                </button>
            </div>
        </div>
    </header>
);

export const Home: React.FC<HomeProps> = ({ onGetStarted, onNavigateToLogin }) => {
    return (
        <div className="bg-slate-50 min-h-screen flex flex-col">
            <HomeHeader onNavigateToLogin={onNavigateToLogin} />
            <main className="flex-grow">
                <div className="text-center px-4 py-24 sm:py-32">
                     <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900">
                        <span className="block">Authenticity at your Fingertips.</span>
                    </h1>
                    <p className="mt-4 max-w-2xl mx-auto text-lg text-slate-600 sm:text-xl">
                        Verify your medication instantly with the CUSTECH Clinic Drug Verification portal. Safe, secure, and simple.
                    </p>
                    <div className="mt-10">
                        <button onClick={onGetStarted} className="px-10 py-4 text-lg font-bold text-white bg-cust-blue rounded-lg shadow-lg hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all transform hover:scale-105">
                            Get Started
                        </button>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}