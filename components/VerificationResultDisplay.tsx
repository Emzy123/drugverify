
import React from 'react';
import { VerificationResult, VerificationStatus, DrugDetails, CounterfeitInfo, VerificationMethod } from '../types';
import { ShieldCheckIcon, ExclamationTriangleIcon, InformationCircleIcon } from './icons/UIIcons';

interface VerificationResultDisplayProps {
  result: VerificationResult;
  onReport: () => void;
  verificationMethod: VerificationMethod;
}

const DetailItem: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
  <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
    <dt className="text-sm font-medium text-slate-600">{label}</dt>
    <dd className="mt-1 text-sm text-slate-900 sm:mt-0 sm:col-span-2 font-medium">{value || 'N/A'}</dd>
  </div>
);

const renderDetailValue = (value: string | string[]) => {
  if (Array.isArray(value)) {
    // Just show the first part if it's a long array from the API
    return value[0] || 'Not available';
  }
  return value;
};

const AuthenticResult: React.FC<{ data: DrugDetails; }> = ({ data }) => {
    return(
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
            <div className="bg-green-50 p-6 border-b border-green-200">
                <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
                    <ShieldCheckIcon className="w-12 h-12 text-cust-green flex-shrink-0" />
                    <div>
                        <h3 className="text-xl sm:text-2xl font-semibold text-green-800">Verdict: Authentic</h3>
                        <p className="mt-1 text-green-700">
                            This drug was successfully identified in the {data.dataSource || 'database'}.
                        </p>
                    </div>
                </div>
            </div>
            <div className="p-6">
                <h4 className="text-xl font-bold text-slate-800 mb-4">Drug Details: <span className="text-cust-blue">{data.drugName}</span></h4>
                <dl className="divide-y divide-slate-200">
                    {data.nafdacNumber && <DetailItem label="NAFDAC Number" value={data.nafdacNumber} />}
                    <DetailItem label="Generic Name" value={data.genericName} />
                    <DetailItem label="Manufacturer" value={data.manufacturer} />
                    <DetailItem label="Manufacturing Date" value={data.manufacturingDate} />
                    <DetailItem label="Expiry Date" value={data.expiryDate} />
                    <DetailItem label="Primary Use" value={renderDetailValue(data.uses)} />
                    <DetailItem label="Dosage" value={renderDetailValue(data.dosage)} />
                    <DetailItem label="Side Effects" value={renderDetailValue(data.sideEffects)} />
                    <DetailItem label="Storage" value={renderDetailValue(data.storage)} />
                </dl>
                 <div className="mt-6 pt-4 border-t border-slate-200 text-xs text-slate-500 italic">
                    <InformationCircleIcon className="w-4 h-4 inline mr-1" />
                    Disclaimer: This information does not verify a specific physical product or batch and is not a substitute for professional medical advice.
                </div>
            </div>
        </div>
    );
};

const CounterfeitResult: React.FC<{ data: CounterfeitInfo; onReport: () => void; }> = ({ data, onReport }) => {
    return (
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
            <div className="bg-red-50 p-6 border-b border-red-200">
                <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
                    <ExclamationTriangleIcon className="w-12 h-12 text-red-600 flex-shrink-0" />
                    <div>
                        <h3 className="text-xl sm:text-2xl font-semibold text-red-800">Warning: Potentially Unsafe</h3>
                         <p className="mt-1 text-red-700">{data.message}</p>
                    </div>
                </div>
            </div>
            <div className="p-6">
                <h4 className="font-bold text-lg text-slate-800 mb-3">Recommended Actions:</h4>
                <ul className="list-disc list-inside space-y-2 text-slate-700">
                    {data.nextSteps.map((step, index) => <li key={index}>{step}</li>)}
                </ul>
                <div className="mt-6 pt-6 border-t border-slate-200">
                    <button
                        onClick={onReport}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 font-semibold text-white bg-red-600 rounded-lg shadow-md hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-300 transition-all">
                        <ExclamationTriangleIcon className="w-5 h-5" />
                        Report Suspicious Drug
                    </button>
                </div>
            </div>
        </div>
    );
};

const ErrorResult: React.FC<{ message: string }> = ({ message }) => (
  <div className="bg-amber-50 border-l-4 border-amber-500 p-6 rounded-r-lg shadow">
    <div className="flex flex-col sm:flex-row items-center text-center sm:text-left gap-4">
      <InformationCircleIcon className="w-8 h-8 text-amber-500 sm:mr-4 flex-shrink-0" />
      <div>
        <h3 className="text-xl font-bold text-amber-700">An Error Occurred</h3>
        <p className="text-amber-800 mt-1">{message}</p>
      </div>
    </div>
  </div>
);

const LoadingSpinner: React.FC = () => (
  <div className="text-center py-10 flex flex-col items-center justify-center">
    <svg className="animate-spin h-12 w-12 text-cust-blue" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
    <p className="mt-4 text-lg font-semibold text-slate-700">Verifying your drug, please wait...</p>
    <p className="text-slate-500">This may take a few moments.</p>
  </div>
);

export const VerificationResultDisplay: React.FC<VerificationResultDisplayProps> = ({ result, onReport }) => {
  if (result.status === VerificationStatus.IDLE) return null;

  return (
    <div className="max-w-4xl mx-auto mt-4 sm:mt-0 mb-16 px-4 sm:px-6 lg:px-8">
      <div className="min-h-[24rem] flex items-center justify-center transition-all duration-500">
          {result.status === VerificationStatus.LOADING && <LoadingSpinner />}
          {result.status === VerificationStatus.AUTHENTIC && <AuthenticResult data={result.data} />}
          {result.status === VerificationStatus.COUNTERFEIT && <CounterfeitResult data={result.data} onReport={onReport} />}
          {result.status === VerificationStatus.ERROR && <ErrorResult message={result.message} />}
      </div>
    </div>
  );
};
