'use client';

import React, { useState } from 'react';
import { XCircle, Mail, Lock, User } from 'lucide-react';
import { useDemoAuth } from '@/contexts/DemoAuthContext';

interface DemoAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function DemoAuthModal({ isOpen, onClose, onSuccess }: DemoAuthModalProps) {
  const { signIn, signUp } = useDemoAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isLogin) {
        // Connexion
        const { error } = await signIn(email, password);
        if (error) throw error;

        console.log('Connexion réussie');
        onSuccess();
        onClose();
      } else {
        // Inscription
        const { error } = await signUp(email, password, name);
        if (error) throw error;

        alert('Inscription réussie ! Vous êtes maintenant connecté.');
        onSuccess();
        onClose();
      }
    } catch (error: any) {
      console.error('Erreur auth:', error);
      setError(error.message || 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center z-[100] animate-fadeIn">
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 w-full max-w-md relative border border-white/20 animate-slideUp">
        <button onClick={onClose} className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors duration-200">
          <XCircle className="w-6 h-6" />
        </button>

        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center animate-pulse">
            <User className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">
            {isLogin ? 'Connexion' : 'Inscription'}
          </h2>
          <p className="text-blue-200 text-sm">
            {isLogin ? 'Accédez à votre espace de travail' : 'Créez votre compte'}
          </p>
        </div>


        {error && (
          <div className="bg-red-500/20 border border-red-400/50 text-red-100 px-4 py-3 rounded-xl relative mb-4 backdrop-blur-sm animate-shake" role="alert">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-red-400 rounded-full mr-2 animate-pulse"></div>
              <strong className="font-semibold">Erreur !</strong>
            </div>
            <span className="block mt-1 text-sm"> {error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {!isLogin && (
            <div className="group">
              <label htmlFor="name" className="block text-sm font-medium text-blue-100 mb-2">Nom complet</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-blue-300 group-focus-within:text-blue-400 transition-colors duration-200" />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  className="w-full px-4 py-3 pl-12 bg-white/10 border border-blue-400/30 rounded-xl text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400 transition-all duration-200 backdrop-blur-sm"
                  placeholder="Votre nom complet"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>
          )}

          <div className="group">
            <label htmlFor="email" className="block text-sm font-medium text-blue-100 mb-2">Adresse email</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-blue-300 group-focus-within:text-blue-400 transition-colors duration-200" />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="w-full px-4 py-3 pl-12 bg-white/10 border border-blue-400/30 rounded-xl text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400 transition-all duration-200 backdrop-blur-sm"
                placeholder="votre@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="group">
            <label htmlFor="password" className="block text-sm font-medium text-blue-100 mb-2">Mot de passe</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-blue-300 group-focus-within:text-blue-400 transition-colors duration-200" />
              </div>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete={isLogin ? 'current-password' : 'new-password'}
                required
                className="w-full px-4 py-3 pl-12 bg-white/10 border border-blue-400/30 rounded-xl text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400 transition-all duration-200 backdrop-blur-sm"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center py-3 px-6 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {isLogin ? 'Connexion...' : 'Inscription...'}
                </>
              ) : (
                <>
                  {isLogin ? 'Se connecter' : 'S\'inscrire'}
                  <div className="w-2 h-2 bg-white/30 rounded-full ml-2 animate-pulse"></div>
                </>
              )}
            </button>
          </div>
        </form>

        <div className="mt-8 text-center">
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="text-blue-200 hover:text-white font-medium transition-colors duration-200 hover:underline"
          >
            {isLogin ? 'Pas encore de compte ? S\'inscrire' : 'Déjà un compte ? Se connecter'}
          </button>
        </div>
      </div>
    </div>
  );
}
