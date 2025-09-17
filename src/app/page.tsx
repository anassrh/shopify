'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import DynamicStats from '@/components/DynamicStats';
import OrderCharts from '@/components/OrderCharts';
import CSVImportModal from '@/components/CSVImportModal';
import { useCSVData } from '@/contexts/CSVDataContext';
import { 
  ShoppingCart, 
  TrendingUp, 
  Clock, 
  CheckCircle,
  ArrowRight,
  RefreshCw,
  Upload
} from 'lucide-react';
import Link from 'next/link';

export default function Dashboard() {
  const [isCSVModalOpen, setIsCSVModalOpen] = useState(false);
  const { addCSVData } = useCSVData();

  const handleCSVImport = (data: any[]) => {
    addCSVData(data);
    console.log('Données CSV importées:', data);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 ml-64">
        <div className="space-y-8">
          {/* En-tête du dashboard */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600 mt-2">
                Vue d'ensemble de vos commandes et statistiques AWIN
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <button 
                onClick={() => setIsCSVModalOpen(true)}
                className="btn-secondary flex items-center space-x-2"
              >
                <Upload className="w-4 h-4" />
                <span>Import CA</span>
              </button>
              <button className="btn-secondary flex items-center space-x-2">
                <RefreshCw className="w-4 h-4" />
                <span>Actualiser</span>
              </button>
              <Link href="/ventes" className="btn-primary flex items-center space-x-2">
                <ShoppingCart className="w-4 h-4" />
                <span>Voir les commandes</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Statistiques principales */}
          <DynamicStats />

          {/* Graphiques et analyses */}
          <OrderCharts />

          {/* Actions rapides */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link 
              href="/ventes" 
              className="group bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200 hover:-translate-y-0.5"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                    Commandes à Valider
                  </h3>
                  <p className="text-gray-600 text-sm mt-1">
                    Gérer les commandes en attente
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                  <CheckCircle className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </Link>

            <Link 
              href="/marques" 
              className="group bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200 hover:-translate-y-0.5"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-green-600 transition-colors">
                    Gestion des Marques
                  </h3>
                  <p className="text-gray-600 text-sm mt-1">
                    Partenaires et annonceurs
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </Link>

            <Link 
              href="/dernieres-commandes" 
              className="group bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200 hover:-translate-y-0.5"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-purple-600 transition-colors">
                    Dernières Commandes
                  </h3>
                  <p className="text-gray-600 text-sm mt-1">
                    Activité récente
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                  <Clock className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </Link>

            <Link 
              href="/compte" 
              className="group bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200 hover:-translate-y-0.5"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-gray-600 transition-colors">
                    Mon Compte
                  </h3>
                  <p className="text-gray-600 text-sm mt-1">
                    Paramètres et profil
                  </p>
                </div>
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-gray-200 transition-colors">
                  <ShoppingCart className="w-6 h-6 text-gray-600" />
                </div>
              </div>
            </Link>
          </div>

          {/* Informations système */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-200">
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-blue-600 text-sm">ℹ️</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Bienvenue sur AwinManager
                </h3>
                <p className="text-gray-700 mb-3">
                  Cette application vous permet de gérer efficacement vos commandes AWIN, 
                  valider les transactions et suivre vos performances d'affiliation.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="badge badge-blue">Sécurisé</span>
                  <span className="badge badge-green">Temps réel</span>
                  <span className="badge badge-purple">Intuitif</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal d'import CSV */}
      <CSVImportModal
        isOpen={isCSVModalOpen}
        onClose={() => setIsCSVModalOpen(false)}
        onImport={handleCSVImport}
      />
    </div>
  );
}
