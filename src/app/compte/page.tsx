'use client';

import React from 'react';
import Navbar from '@/components/Navbar';
import { User, Mail, Shield, Calendar } from 'lucide-react';

export default function ComptePage() {
  // Pour l'instant, tous les utilisateurs sont des utilisateurs normaux
  const roleInfo = { text: 'Utilisateur', color: 'text-blue-600', bg: 'bg-blue-100' };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8 ml-64">
        <div className="space-y-6">
          {/* En-tête */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Mon Compte</h1>
            <p className="text-gray-600 mt-2">
              Gérez vos informations personnelles et paramètres
            </p>
          </div>

          {/* Informations utilisateur */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-start space-x-6">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <User className="w-10 h-10 text-white" />
              </div>
              
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-4">
                  <h2 className="text-2xl font-semibold text-gray-900">
                    Utilisateur Demo
                  </h2>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${roleInfo.bg} ${roleInfo.color}`}>
                    {roleInfo.text}
                  </span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="text-gray-900">demo@ninjastudio.com</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Shield className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Rôle</p>
                      <p className="text-gray-900">{roleInfo.text}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Membre depuis</p>
                      <p className="text-gray-900">
                        {new Date().toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Actions rapides */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Sécurité</h3>
              <p className="text-gray-600 text-sm mb-4">
                Gérez votre mot de passe et la sécurité de votre compte
              </p>
              <button className="btn-secondary w-full">
                Modifier le mot de passe
              </button>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Notifications</h3>
              <p className="text-gray-600 text-sm mb-4">
                Configurez vos préférences de notification
              </p>
              <button className="btn-secondary w-full">
                Paramètres
              </button>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Support</h3>
              <p className="text-gray-600 text-sm mb-4">
                Besoin d'aide ? Contactez notre équipe
              </p>
              <button className="btn-secondary w-full">
                Contacter le support
              </button>
            </div>
          </div>

          {/* Informations système */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-200">
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-blue-600 text-sm">ℹ️</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  À propos de votre compte
                </h3>
                <p className="text-gray-700 mb-3">
                  Votre compte vous donne accès à toutes les fonctionnalités de Ninja Studio. 
                  Selon votre rôle, vous pouvez accéder à différentes sections de l'application.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="badge badge-blue">Sécurisé</span>
                  <span className="badge badge-green">Temps réel</span>
                  <span className="badge badge-purple">Personnalisé</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}