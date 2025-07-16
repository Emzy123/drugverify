
import React from 'react';
import { SparklesIcon, ShieldCheckIcon } from './icons/UIIcons';
import { VerificationMethod } from '../types';

interface HeroProps {
  verificationCode: string;
  setVerificationCode: (code: string) => void;
  onVerify: () => void;
  isLoading: boolean;
  verificationMethod: VerificationMethod;
  setVerificationMethod: (method: VerificationMethod) => void;
}

const RadioButton: React.FC<{
  id: string;
  name: string;
  value: string;
  checked: boolean;
  onChange: () => void;
  label: string;
  disabled: boolean;
}> = ({ id, name, value, checked, onChange, label, disabled }) => (
  <label htmlFor={id} className={`w-full sm:w-auto flex items-center justify-center px-5 py-2.5 text-sm font-medium border rounded-lg cursor-pointer transition-all duration-200 ${checked ? 'bg-cust-blue text-white border-cust-blue shadow-md' : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100 hover:border-slate-400'} ${disabled ? 'cursor-not-allowed opacity-60' : ''}`}>
    <input
      type="radio"
      id={id}
      name={name}
      value={value}
      checked={checked}
      onChange={onChange}
      className="sr-only"
      disabled={disabled}
    />
    {label}
  </label>
);

export const Hero: React.FC<HeroProps> = ({ verificationCode, setVerificationCode, onVerify, isLoading, verificationMethod, setVerificationMethod }) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onVerify();
  };
  
  const placeholders = {
      code: "Enter drug's NDC (e.g., 0071-0157-13)",
      name: "Enter brand name (e.g., Alabukun)"
  };

  return (
    <section className="text-center py-16 sm:py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center items-center gap-3">
          <ShieldCheckIcon className="w-9 h-9 text-cust-blue" />
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900">
            Drug Verification Portal
          </h1>
        </div>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-slate-600">
          Verify the authenticity of your medication by entering its brand name or National Drug Code (NDC).
        </p>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 my-8 max-w-sm mx-auto sm:max-w-none">
          <RadioButton
            id="verify-by-name"
            name="verificationMethod"
            value="name"
            checked={verificationMethod === 'name'}
            onChange={() => setVerificationMethod('name')}
            label="Verify by Name"
            disabled={isLoading}
          />
          <RadioButton
            id="verify-by-code"
            name="verificationMethod"
            value="code"
            checked={verificationMethod === 'code'}
            onChange={() => setVerificationMethod('code')}
            label="Verify by NDC"
            disabled={isLoading}
          />
        </div>

        <form onSubmit={handleSubmit} className="max-w-xl mx-auto flex flex-col sm:flex-row items-center gap-3">
          <input
            type="text"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            placeholder={placeholders[verificationMethod]}
            className="w-full flex-grow px-5 py-4 text-base bg-white border-2 border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-cust-blue focus:border-cust-blue outline-none transition-all duration-200"
            disabled={isLoading}
            aria-label={placeholders[verificationMethod]}
          />
          <button
            type="submit"
            disabled={isLoading}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 text-base font-bold text-white bg-cust-blue rounded-lg shadow-lg hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all transform hover:scale-105 disabled:bg-slate-400 disabled:cursor-not-allowed disabled:scale-100"
            aria-label="Verify Drug"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Verifying...
              </>
            ) : (
              <>
                <SparklesIcon className="w-5 h-5" />
                Verify Now
              </>
            )}
          </button>
        </form>
      </div>
    </section>
  );
};
