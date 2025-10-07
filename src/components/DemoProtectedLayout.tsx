'use client';

import React, { useState, useEffect } from 'react';
import { useDemoAuth } from '@/contexts/DemoAuthContext';
import DemoAuthModal from './DemoAuthModal';
import Navbar from './Navbar';
import { useRouter, usePathname } from 'next/navigation';

export default function DemoProtectedLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useDemoAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) {
      setShowAuthModal(true);
    } else if (!loading && user && showAuthModal) {
      setShowAuthModal(false);
      if (pathname === '/') {
        router.push('/');
      }
    }
  }, [user, loading, showAuthModal, router, pathname]);

  const handleAuthSuccess = () => {
    setShowAuthModal(false);
    router.push('/'); 
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-solid"></div>
        <p className="ml-4 text-gray-700">Chargement de l'authentification...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <>
        {children}
        <DemoAuthModal 
          isOpen={showAuthModal} 
          onClose={() => setShowAuthModal(false)} 
          onSuccess={handleAuthSuccess} 
        />
      </>
    );
  }

  return (
    <>
      <Navbar />
      {children}
    </>
  );
}
