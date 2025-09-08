'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { 
  ShoppingCart, 
  Euro, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  XCircle,
  AlertCircle
} from 'lucide-react';

interface StatsData {
  totalCommandes: number;
  commandesValidees: number;
  commandesRefusees: number;
  commandesEnAttente: number;
  montantTotal: number;
  commissionTotale: number;
  commandesAujourdhui: number;
  tauxValidation: number;
}

export default function DynamicStats() {
  const [stats, setStats] = useState<StatsData>({
    totalCommandes: 0,
    commandesValidees: 0,
    commandesRefusees: 0,
    commandesEnAttente: 0,
    montantTotal: 0,
    commissionTotale: 0,
    commandesAujourdhui: 0,
    tauxValidation: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);

      // Récupérer toutes les commandes
      const { data: commandes, error: commandesError } = await supabase
        .from('commande')
        .select('*');

      if (commandesError) {
        throw commandesError;
      }

      if (!commandes) {
        setStats({
          totalCommandes: 0,
          commandesValidees: 0,
          commandesRefusees: 0,
          commandesEnAttente: 0,
          montantTotal: 0,
          commissionTotale: 0,
          commandesAujourdhui: 0,
          tauxValidation: 0,
        });
        return;
      }

      // Calculer les statistiques
      const totalCommandes = commandes.length;
      const commandesValidees = commandes.filter(c => c.statut_validation === 'valide').length;
      const commandesRefusees = commandes.filter(c => c.statut_validation === 'refuse').length;
      const commandesEnAttente = commandes.filter(c => !c.statut_validation).length;
      
      const montantTotal = commandes.reduce((sum, c) => sum + (c.montant_total || 0), 0);
      const commissionTotale = commandes.reduce((sum, c) => sum + (c.montant_commission || 0), 0);
      
      // Commandes d'aujourd'hui
      const aujourdhui = new Date();
      aujourdhui.setHours(0, 0, 0, 0);
      const commandesAujourdhui = commandes.filter(c => {
        const dateCommande = new Date(c.created_at);
        return dateCommande >= aujourdhui;
      }).length;

      const tauxValidation = totalCommandes > 0 ? (commandesValidees / totalCommandes) * 100 : 0;

      setStats({
        totalCommandes,
        commandesValidees,
        commandesRefusees,
        commandesEnAttente,
        montantTotal,
        commissionTotale,
        commandesAujourdhui,
        tauxValidation,
      });
    } catch (err) {
      console.error('Erreur récupération stats:', err);
      setError('Erreur lors du chargement des statistiques');
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Commandes',
      value: stats.totalCommandes,
      icon: ShoppingCart,
      color: 'blue',
      change: `+${stats.commandesAujourdhui} aujourd'hui`,
    },
    {
      title: 'Montant Total',
      value: `${stats.montantTotal.toFixed(2)} €`,
      icon: Euro,
      color: 'green',
      change: `Commission: ${stats.commissionTotale.toFixed(2)} €`,
    },
    {
      title: 'Taux de Validation',
      value: `${stats.tauxValidation.toFixed(1)}%`,
      icon: TrendingUp,
      color: 'purple',
      change: `${stats.commandesValidees} validées`,
    },
    {
      title: 'En Attente',
      value: stats.commandesEnAttente,
      icon: Clock,
      color: 'yellow',
      change: `${stats.commandesRefusees} refusées`,
    },
  ];

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'blue':
        return 'bg-blue-500 text-white';
      case 'green':
        return 'bg-green-500 text-white';
      case 'purple':
        return 'bg-purple-500 text-white';
      case 'yellow':
        return 'bg-yellow-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-pulse">
            <div className="flex items-center justify-between">
              <div>
                <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-16"></div>
                <div className="h-3 bg-gray-200 rounded w-20 mt-2"></div>
              </div>
              <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
        <div className="flex items-center">
          <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
          <p className="text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {statCards.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.title}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 mb-1">
                  {stat.title}
                </p>
                <p className="text-3xl font-bold text-gray-900 mb-2">
                  {stat.value}
                </p>
                <p className="text-xs text-gray-500">
                  {stat.change}
                </p>
              </div>
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getColorClasses(stat.color)}`}>
                <Icon className="w-6 h-6" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
