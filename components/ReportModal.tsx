
import React, { useState, useEffect } from 'react';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  drugCode: string;
}

export const ReportModal: React.FC<ReportModalProps> = ({ isOpen, onClose, drugCode }) => {
  const [drugName, setDrugName] = useState('');
  const [purchaseLocation, setPurchaseLocation] = useState('');
  const [comments, setComments] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      // Reset form on close
      setTimeout(() => {
        setDrugName('');
        setPurchaseLocation('');
        setComments('');
        setIsSubmitting(false);
        setIsSubmitted(false);
      }, 300);
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    console.log({
      drugCode,
      drugName,
      purchaseLocation,
      comments,
    });
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 1500);
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg transform transition-all" onClick={(e) => e.stopPropagation()}>
        <div className="p-6">
          <div className="flex justify-between items-start">
            <h2 className="text-2xl font-bold text-slate-800">Report a Suspicious Drug</h2>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600">&times;</button>
          </div>
          {isSubmitted ? (
             <div className="text-center py-10">
                <svg className="w-16 h-16 mx-auto text-cust-green" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                <h3 className="text-xl font-bold mt-4 text-slate-800">Thank You!</h3>
                <p className="text-slate-600 mt-2">Your report has been submitted. We appreciate you helping to keep our community safe.</p>
                <button
                  onClick={onClose}
                  className="mt-6 w-full px-6 py-3 font-bold text-white bg-cust-blue rounded-lg shadow-md hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all"
                >
                  Close
                </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label htmlFor="drugCode" className="block text-sm font-medium text-slate-700">Verification Code</label>
                <input type="text" id="drugCode" value={drugCode} readOnly className="mt-1 block w-full px-3 py-2 bg-slate-100 border border-slate-300 rounded-md shadow-sm sm:text-sm" />
              </div>
              <div>
                <label htmlFor="drugName" className="block text-sm font-medium text-slate-700">Drug Name (if known)</label>
                <input type="text" id="drugName" value={drugName} onChange={e => setDrugName(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-cust-blue focus:border-cust-blue sm:text-sm" />
              </div>
              <div>
                <label htmlFor="purchaseLocation" className="block text-sm font-medium text-slate-700">Place of Purchase (Pharmacy, etc.)</label>
                <input type="text" id="purchaseLocation" value={purchaseLocation} onChange={e => setPurchaseLocation(e.target.value)} required className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-cust-blue focus:border-cust-blue sm:text-sm" />
              </div>
              <div>
                <label htmlFor="comments" className="block text-sm font-medium text-slate-700">Additional Comments</label>
                <textarea id="comments" value={comments} onChange={e => setComments(e.target.value)} rows={3} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-cust-blue focus:border-cust-blue sm:text-sm"></textarea>
              </div>
              <div className="pt-2 flex justify-end space-x-3">
                 <button type="button" onClick={onClose} disabled={isSubmitting} className="px-6 py-2.5 font-semibold text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={isSubmitting} className="px-6 py-2.5 font-bold text-white bg-red-600 rounded-lg shadow-md hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-300 transition-all disabled:bg-slate-400">
                  {isSubmitting ? 'Submitting...' : 'Submit Report'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
