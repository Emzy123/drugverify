
import React, { useState } from 'react';
import { CUSTLogo } from './CUSTLogo';

interface LoginProps {
  onLogin: (email: string) => void;
  onNavigateToSignUp: () => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin, onNavigateToSignUp }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleLoginAttempt = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim() === '' || password.trim() === '') {
      setError('Please enter both your email and password.');
      return;
    }
    setError('');
    setIsLoggingIn(true);
    // Simulate API call for login
    setTimeout(() => {
      onLogin(email);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4 font-sans">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
        <div className="text-center mb-8">
            <CUSTLogo className="h-20 w-20 sm:h-24 sm:w-24 mx-auto text-cust-blue" />
            <div className="mt-6">
                 <h1 className="text-2xl sm:text-3xl font-bold text-cust-blue leading-tight">CUSTECH CLINIC</h1>
                 <p className="text-lg sm:text-xl font-semibold text-slate-600">Drug Verification</p>
            </div>
        </div>

        <form onSubmit={handleLoginAttempt} className="space-y-6">
          <div className="relative">
             <input 
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="peer h-12 w-full border-2 border-slate-300 text-slate-900 focus:outline-none focus:border-cust-blue rounded-lg px-4 placeholder-transparent transition-colors"
                placeholder="Email Address"
                disabled={isLoggingIn}
              />
              <label htmlFor="email" className="absolute left-3 -top-2.5 bg-white px-1 text-sm text-slate-400 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-slate-500 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-cust-blue">
                Email Address
              </label>
          </div>
          <div className="relative">
             <input 
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="peer h-12 w-full border-2 border-slate-300 text-slate-900 focus:outline-none focus:border-cust-blue rounded-lg px-4 placeholder-transparent transition-colors"
                placeholder="Password"
                disabled={isLoggingIn}
              />
              <label htmlFor="password" className="absolute left-3 -top-2.5 bg-white px-1 text-sm text-slate-400 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-slate-500 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-cust-blue">
                Password
              </label>
          </div>

          {error && <p className="text-sm text-red-600 text-left -mt-2">{error}</p>}
          
          <button type="submit" disabled={isLoggingIn} className="w-full py-3 font-bold text-white bg-cust-blue rounded-lg shadow-lg hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all transform hover:scale-105 disabled:bg-slate-400 disabled:scale-100 flex items-center justify-center h-12">
            {isLoggingIn ? (
               <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing In...
              </>
            ) : "Sign In"}
          </button>
          
          <div className="text-sm text-center text-slate-500 pt-2 space-x-1">
            <span className="font-medium text-slate-400 cursor-not-allowed" title="Feature not available">Forgot password?</span>
            <span className="text-slate-300">&middot;</span>
            <button type="button" onClick={onNavigateToSignUp} className="font-medium text-cust-blue hover:underline">
              Create an account
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
