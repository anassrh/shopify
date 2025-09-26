'use client';

import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function TestSupabasePage() {
  const [testResult, setTestResult] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const testSupabaseConnection = async () => {
    setLoading(true);
    setTestResult('Test en cours...\n');
    
    try {
      // Test 1: Vérifier les variables d'environnement
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      
      setTestResult(prev => prev + `URL: ${url}\n`);
      setTestResult(prev => prev + `Clé présente: ${!!key}\n`);
      setTestResult(prev => prev + `Clé longueur: ${key?.length || 0}\n\n`);

      // Test 2: Test de connexion basique
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      setTestResult(prev => prev + `Session test: ${sessionError ? 'ERREUR' : 'OK'}\n`);
      if (sessionError) {
        setTestResult(prev => prev + `Erreur session: ${sessionError.message}\n`);
      }

      // Test 3: Test d'inscription
      const testEmail = `test-${Date.now()}@example.com`;
      const testPassword = 'testpassword123';
      
      setTestResult(prev => prev + `\nTest inscription avec: ${testEmail}\n`);
      
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: testEmail,
        password: testPassword,
      });

      setTestResult(prev => prev + `Inscription: ${signUpError ? 'ERREUR' : 'OK'}\n`);
      if (signUpError) {
        setTestResult(prev => prev + `Erreur inscription: ${signUpError.message}\n`);
        setTestResult(prev => prev + `Code erreur: ${signUpError.status}\n`);
      } else {
        setTestResult(prev => prev + `Utilisateur créé: ${signUpData.user ? 'OUI' : 'NON'}\n`);
        setTestResult(prev => prev + `Email confirmé: ${signUpData.user?.email_confirmed_at ? 'OUI' : 'NON'}\n`);
      }

      // Test 4: Test de connexion
      if (signUpData.user) {
        setTestResult(prev => prev + `\nTest connexion...\n`);
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email: testEmail,
          password: testPassword,
        });

        setTestResult(prev => prev + `Connexion: ${signInError ? 'ERREUR' : 'OK'}\n`);
        if (signInError) {
          setTestResult(prev => prev + `Erreur connexion: ${signInError.message}\n`);
        }
      }

    } catch (error: any) {
      setTestResult(prev => prev + `\nErreur générale: ${error.message}\n`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Test Configuration Supabase</h1>
            
            <button
              onClick={testSupabaseConnection}
              disabled={loading}
              className="mb-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? 'Test en cours...' : 'Tester la configuration Supabase'}
            </button>

            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Résultats du test :</h3>
              <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono">
                {testResult || 'Cliquez sur le bouton pour commencer le test...'}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
