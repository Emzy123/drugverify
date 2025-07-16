
import React, { useState, useCallback, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { VerificationResultDisplay } from './components/VerificationResultDisplay';
import { EducationalResources } from './components/EducationalResources';
import { Footer } from './components/Footer';
import { ReportModal } from './components/ReportModal';
import { SearchHistory } from './components/SearchHistory';
import { verifyDrug } from './services/geminiService';
import { VerificationResult, VerificationStatus, VerificationMethod, HistoryItem } from './types';
import { Home } from './components/Home';
import { Login } from './components/Login';
import { SignUp } from './components/SignUp';

const MAX_HISTORY_ITEMS = 5;

export default function App() {
  const [view, setView] = useState<'home' | 'login' | 'signup'>('home');
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [verificationCode, setVerificationCode] = useState('');
  const [verificationMethod, setVerificationMethod] = useState<VerificationMethod>('name');
  const [result, setResult] = useState<VerificationResult>({ status: VerificationStatus.IDLE });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reportedCode, setReportedCode] = useState('');
  const [searchHistory, setSearchHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    if (currentUser) {
      try {
        const storedHistory = localStorage.getItem(`history_${currentUser}`);
        if (storedHistory) {
          setSearchHistory(JSON.parse(storedHistory));
        } else {
          setSearchHistory([]);
        }
      } catch (error) {
        console.error("Failed to parse search history:", error);
        setSearchHistory([]);
      }
    } else {
      setSearchHistory([]);
    }
  }, [currentUser]);

  const handleLogin = useCallback((email: string) => {
    setCurrentUser(email);
  }, []);
  
  const handleSignUpSuccess = useCallback((email: string) => {
    // Log user in immediately after successful sign up
    setCurrentUser(email);
  }, []);

  const handleLogout = useCallback(() => {
    setCurrentUser(null);
    setView('home'); // Go to home page on logout
  }, []);
  
  const updateSearchHistory = (newItem: HistoryItem) => {
    if (!currentUser) return;
    
    setSearchHistory(prev => {
      const updatedHistory = [newItem, ...prev.filter(h => !(h.term === newItem.term && h.method === newItem.method))].slice(0, MAX_HISTORY_ITEMS);
      try {
        localStorage.setItem(`history_${currentUser}`, JSON.stringify(updatedHistory));
      } catch (error) {
          console.error("Failed to save search history:", error);
      }
      return updatedHistory;
    });
  };

  const handleVerification = useCallback(async (term: string, method: VerificationMethod) => {
    if (!term.trim()) {
      const message = method === 'code' 
        ? 'Please enter a verification code.' 
        : 'Please enter a drug name.';
      setResult({ status: VerificationStatus.ERROR, message });
      return;
    }
    setResult({ status: VerificationStatus.LOADING });
    try {
      const apiResult = await verifyDrug(term, method);
      setResult(apiResult);
      if (apiResult.status === VerificationStatus.AUTHENTIC || apiResult.status === VerificationStatus.COUNTERFEIT) {
        updateSearchHistory({ term, method });
      }
    } catch (error) {
      console.error('Verification failed:', error);
      setResult({ status: VerificationStatus.ERROR, message: 'An unexpected error occurred. Please try again later.' });
    }
  }, [currentUser]);

  const handleFormSubmit = useCallback(() => {
    handleVerification(verificationCode, verificationMethod);
  }, [verificationCode, verificationMethod, handleVerification]);

  const handleHistoryClick = useCallback((item: HistoryItem) => {
    setVerificationCode(item.term);
    setVerificationMethod(item.method);
    handleVerification(item.term, item.method);
  }, [handleVerification]);

  const handleOpenReportModal = useCallback(() => {
    setReportedCode(verificationCode);
    setIsModalOpen(true);
  }, [verificationCode]);

  // If user is logged in, show the main app
  if (currentUser) {
    return (
      <div className="flex flex-col min-h-screen bg-slate-50 font-sans text-slate-800">
        <Header onLogout={handleLogout} userEmail={currentUser} />
        <main className="flex-grow">
          <Hero
            verificationCode={verificationCode}
            setVerificationCode={setVerificationCode}
            onVerify={handleFormSubmit}
            isLoading={result.status === VerificationStatus.LOADING}
            verificationMethod={verificationMethod}
            setVerificationMethod={setVerificationMethod}
          />
          {searchHistory.length > 0 && (
            <SearchHistory
              history={searchHistory}
              onHistoryClick={handleHistoryClick}
              isLoading={result.status === VerificationStatus.LOADING}
            />
          )}
          <VerificationResultDisplay 
            result={result} 
            onReport={handleOpenReportModal} 
            verificationMethod={verificationMethod}
          />
          <EducationalResources />
        </main>
        <Footer />
          
        {isModalOpen && (
          <ReportModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            drugCode={reportedCode}
          />
        )}
      </div>
    );
  }

  // If user is not logged in, show the correct page based on view state
  switch (view) {
    case 'login':
      return <Login onLogin={handleLogin} onNavigateToSignUp={() => setView('signup')} />;
    case 'signup':
      return <SignUp onSignUpSuccess={handleSignUpSuccess} onNavigateToLogin={() => setView('login')} />;
    case 'home':
    default:
      return <Home onGetStarted={() => setView('signup')} onNavigateToLogin={() => setView('login')} />;
  }
}
