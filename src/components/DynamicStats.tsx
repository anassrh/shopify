'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useCSVData } from '@/contexts/CSVDataContext';
import { 
  ShoppingCart, 
  Euro, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  XCircle,
  AlertCircle,
  Calendar,
  Filter
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

type DateFilter = 'all' | 'yesterday' | '7days' | '30days' | 'custom';

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
  const [dateFilter, setDateFilter] = useState<DateFilter>('all');
  
  // Contexte CSV
  const { getFilteredData } = useCSVData();
  const [customDateRange, setCustomDateRange] = useState({
    start: '',
    end: ''
  });
  const [showDatePicker, setShowDatePicker] = useState(false);

  const getDateRange = useCallback(() => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    switch (dateFilter) {
      case 'yesterday':
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        return { start: yesterday, end: yesterday };
      
      case '7days':
        const sevenDaysAgo = new Date(today);
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        return { start: sevenDaysAgo, end: today };
      
      case '30days':
        const thirtyDaysAgo = new Date(today);
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        return { start: thirtyDaysAgo, end: today };
      
      case 'custom':
        if (customDateRange.start && customDateRange.end) {
          return { 
            start: new Date(customDateRange.start), 
            end: new Date(customDateRange.end) 
          };
        }
        return null;
      
      default:
        return null; // Toutes les données
    }
  }, [dateFilter, customDateRange]);

  const fetchStats = useCallback(async () => {
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

      // Récupérer les données CSV filtrées
      const csvData = getFilteredData(dateFilter, customDateRange);

      if (!commandes && csvData.length === 0) {
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

      // Filtrer les commandes par date
      const dateRange = getDateRange();
      let filteredCommandes = commandes || [];
      
      if (dateRange) {
        filteredCommandes = (commandes || []).filter(c => {
          const commandeDate = new Date(c.created_at);
          commandeDate.setHours(0, 0, 0, 0);
          return commandeDate >= dateRange.start && commandeDate <= dateRange.end;
        });
      }

      // Calculer les statistiques des commandes
      const totalCommandes = filteredCommandes.length;
      const commandesValidees = filteredCommandes.filter(c => c.statut_validation === 'valide').length;
      const commandesRefusees = filteredCommandes.filter(c => c.statut_validation === 'refuse').length;
      const commandesEnAttente = filteredCommandes.filter(c => !c.statut_validation).length;
      
      const montantTotalCommandes = filteredCommandes.reduce((sum, c) => sum + (c.montant_total || 0), 0);
      const commissionTotaleCommandes = filteredCommandes.reduce((sum, c) => sum + (c.montant_commission || 0), 0);
      
      // Calculer les statistiques des données CSV
      const csvMontantTotal = csvData.reduce((sum, c) => sum + c.ca, 0);
      const csvCommissionTotale = csvData.reduce((sum, c) => sum + c.commission, 0);
      const csvCommandesTotal = csvData.reduce((sum, c) => sum + c.commandes, 0);
      
      // Combiner les données
      const montantTotal = montantTotalCommandes + csvMontantTotal;
      const commissionTotale = commissionTotaleCommandes + csvCommissionTotale;
      
      // Commandes d'aujourd'hui (toujours calculé sur toutes les données)
      const aujourdhui = new Date();
      aujourdhui.setHours(0, 0, 0, 0);
      const commandesAujourdhui = (commandes || []).filter(c => {
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
  }, [dateFilter, customDateRange, getFilteredData, getDateRange]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

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

  const getFilterLabel = () => {
    switch (dateFilter) {
      case 'yesterday': return 'Hier';
      case '7days': return '7 derniers jours';
      case '30days': return '30 derniers jours';
      case 'custom': return `Du ${customDateRange.start} au ${customDateRange.end}`;
      default: return 'Toutes les périodes';
    }
  };

  return (
    <div className="mb-8">
      {/* Filtres de dates */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-500" />
            <h3 className="text-lg font-semibold text-gray-900">Filtres de période</h3>
          </div>
          <div className="text-sm text-gray-500">
            {getFilterLabel()}
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          {/* Filtres rapides */}
          <div className="flex space-x-2">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setDateFilter('all');
              }}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                dateFilter === 'all'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Toutes
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setDateFilter('yesterday');
              }}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                dateFilter === 'yesterday'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Hier
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setDateFilter('7days');
              }}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                dateFilter === '7days'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              7 jours
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setDateFilter('30days');
              }}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                dateFilter === '30days'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              30 jours
            </button>
          </div>

          {/* Date picker personnalisé */}
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setShowDatePicker(!showDatePicker);
              }}
              className={`px-3 py-1 text-sm rounded-md transition-colors flex items-center space-x-1 ${
                dateFilter === 'custom'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>Période personnalisée</span>
            </button>
          </div>
        </div>

        {/* Date picker personnalisé */}
        {showDatePicker && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <form 
              onSubmit={(e) => e.preventDefault()}
              className="flex items-center space-x-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date de début
                </label>
                <input
                  type="date"
                  value={customDateRange.start}
                  onChange={(e) => {
                    e.preventDefault();
                    setCustomDateRange(prev => ({ ...prev, start: e.target.value }));
                  }}
                  onKeyDown={(e) => {
                    e.stopPropagation();
                    if (e.key === 'Enter') {
                      e.preventDefault();
                    }
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                  style={{ 
                    colorScheme: 'light',
                    color: '#000000 !important'
                  }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date de fin
                </label>
                <input
                  type="date"
                  value={customDateRange.end}
                  onChange={(e) => {
                    e.preventDefault();
                    setCustomDateRange(prev => ({ ...prev, end: e.target.value }));
                  }}
                  onKeyDown={(e) => {
                    e.stopPropagation();
                    if (e.key === 'Enter') {
                      e.preventDefault();
                    }
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                  style={{ 
                    colorScheme: 'light',
                    color: '#000000 !important'
                  }}
                />
              </div>
              <div className="flex items-end">
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (customDateRange.start && customDateRange.end) {
                      setDateFilter('custom');
                      setShowDatePicker(false);
                    }
                  }}
                  disabled={!customDateRange.start || !customDateRange.end}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  Appliquer
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* Cartes de statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
    </div>
  );
}
