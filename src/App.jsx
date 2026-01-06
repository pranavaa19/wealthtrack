import React, { useState, useEffect } from 'react';
import { PortfolioProvider } from './store/usePortfolio';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Sidebar from './components/Sidebar';
import Transactions from './components/Transactions';
import ProfitCalculator from './components/ProfitCalculator';
import { auth } from './lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState('dashboard');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  if (loading) {
    return <div className="h-screen w-screen flex items-center justify-center bg-bg-main text-gold-main">Loading...</div>;
  }

  if (!user) {
    return <Login />;
  }

  const renderContent = () => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard />;
      case 'transactions':
        return <Transactions />;
      case 'calculator':
        return <ProfitCalculator />;
      default:
        return <Dashboard />;
    }
  };

  const getHeaderTitle = () => {
    switch (activeView) {
      case 'dashboard': return 'Dashboard';
      case 'transactions': return 'Transactions';
      case 'calculator': return 'Profit Calculator';
      default: return 'Dashboard';
    }
  };

  return (
    <PortfolioProvider>
      <div className="flex h-screen bg-bg-main font-sans text-text-dark overflow-hidden">
        <Sidebar activeView={activeView} setActiveView={setActiveView} onLogout={handleLogout} />

        <main className="flex-1 flex flex-col h-full relative overflow-hidden">
          {/* Header Area */}
          <header className="px-8 py-6 bg-bg-main/90 backdrop-blur-sm z-10">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="font-serif text-4xl font-bold text-gold-main mb-1">{getHeaderTitle()}</h1>
                <p className="text-text-light text-sm">Overview of your gold and stock portfolio</p>
              </div>
            </div>
          </header>

          {/* Scrollable Content Area */}
          <div className="flex-1 overflow-y-auto px-8 pb-8 custom-scrollbar">
            {renderContent()}
          </div>
        </main>
      </div>
    </PortfolioProvider>
  );
}

export default App;
