'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Commande } from '@/lib/supabase';
import { 
  BarChart3, 
  PieChart, 
  TrendingUp, 
  Calendar,
  RefreshCw,
  Clock
} from 'lucide-react';

interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string[];
    borderColor: string[];
  }[];
}

export default function OrderCharts() {
  const [commandes, setCommandes] = useState<Commande[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeChart, setActiveChart] = useState<'status' | 'shops' | 'monthly'>('status');

  useEffect(() => {
    fetchCommandes();
  }, []);

  const fetchCommandes = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('commande')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setCommandes(data || []);
    } catch (err) {
      console.error('Erreur récupération commandes:', err);
      setError('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  const getStatusChartData = (): ChartData => {
    const statusCounts = commandes.reduce((acc, commande) => {
      const status = commande.statut_validation || 'en_attente';
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const labels = Object.keys(statusCounts).map(status => {
      switch (status) {
        case 'valide': return 'Validées';
        case 'refuse': return 'Refusées';
        case 'en_attente': return 'En Attente';
        default: return status;
      }
    });

    const data = Object.values(statusCounts);
    const colors = ['#10B981', '#EF4444', '#F59E0B'];

    return {
      labels,
      datasets: [{
        label: 'Commandes par statut',
        data,
        backgroundColor: colors,
        borderColor: colors,
      }],
    };
  };

  const getShopsChartData = (): ChartData => {
    const shopCounts = commandes.reduce((acc, commande) => {
      const shop = commande.publisher_shop_name || 'Inconnu';
      acc[shop] = (acc[shop] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const sortedShops = Object.entries(shopCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5); // Top 5 shops

    const labels = sortedShops.map(([shop]) => shop);
    const data = sortedShops.map(([, count]) => count);
    const colors = ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444'];

    return {
      labels,
      datasets: [{
        label: 'Commandes par shop',
        data,
        backgroundColor: colors,
        borderColor: colors,
      }],
    };
  };

  const getMonthlyChartData = (): ChartData => {
    const monthlyData = commandes.reduce((acc, commande) => {
      const date = new Date(commande.created_at);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      acc[monthKey] = (acc[monthKey] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const sortedMonths = Object.entries(monthlyData)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-6); // 6 derniers mois

    const labels = sortedMonths.map(([month]) => {
      const [year, monthNum] = month.split('-');
      const date = new Date(parseInt(year), parseInt(monthNum) - 1);
      return date.toLocaleDateString('fr-FR', { month: 'short', year: '2-digit' });
    });

    const data = sortedMonths.map(([, count]) => count);

    return {
      labels,
      datasets: [{
        label: 'Commandes par mois',
        data,
        backgroundColor: labels.map(() => '#3B82F6'),
        borderColor: labels.map(() => '#1D4ED8'),
      }],
    };
  };

  const renderChart = () => {
    let chartData: ChartData;
    
    switch (activeChart) {
      case 'status':
        chartData = getStatusChartData();
        break;
      case 'shops':
        chartData = getShopsChartData();
        break;
      case 'monthly':
        chartData = getMonthlyChartData();
        break;
      default:
        chartData = getStatusChartData();
    }

    return (
      <div className="space-y-4">
        {chartData.labels.map((label, index) => {
          const value = chartData.datasets[0].data[index];
          const total = chartData.datasets[0].data.reduce((sum, val) => sum + val, 0);
          const percentage = total > 0 ? (value / total) * 100 : 0;
          const color = chartData.datasets[0].backgroundColor[index];

          return (
            <div key={label} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div 
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: color }}
                ></div>
                <span className="text-sm font-medium text-gray-700">{label}</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div 
                    className="h-2 rounded-full transition-all duration-300"
                    style={{ 
                      width: `${percentage}%`,
                      backgroundColor: color 
                    }}
                  ></div>
                </div>
                <span className="text-sm font-medium text-gray-900 w-12 text-right">
                  {value}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-48 mb-4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="h-4 bg-gray-200 rounded w-24"></div>
                <div className="h-4 bg-gray-200 rounded w-32"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mr-3">
              <span className="text-red-600 text-sm">⚠️</span>
            </div>
            <p className="text-red-700">{error}</p>
          </div>
          <button
            onClick={fetchCommandes}
            className="text-red-600 hover:text-red-800 transition-colors"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Graphique principal */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Analyses</h3>
          <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setActiveChart('status')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                activeChart === 'status'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <PieChart className="w-4 h-4 inline mr-1" />
              Statut
            </button>
            <button
              onClick={() => setActiveChart('shops')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                activeChart === 'shops'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <BarChart3 className="w-4 h-4 inline mr-1" />
              Shops
            </button>
            <button
              onClick={() => setActiveChart('monthly')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                activeChart === 'monthly'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Calendar className="w-4 h-4 inline mr-1" />
              Mensuel
            </button>
          </div>
        </div>
        
        {renderChart()}
      </div>

      {/* Résumé rapide */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Résumé Rapide</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-green-900">Commandes validées</p>
                <p className="text-xs text-green-600">Cette semaine</p>
              </div>
            </div>
            <span className="text-2xl font-bold text-green-900">
              {commandes.filter(c => c.statut_validation === 'valide').length}
            </span>
          </div>

          <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                <Clock className="w-4 h-4 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-yellow-900">En attente</p>
                <p className="text-xs text-yellow-600">Nécessitent validation</p>
              </div>
            </div>
            <span className="text-2xl font-bold text-yellow-900">
              {commandes.filter(c => !c.statut_validation).length}
            </span>
          </div>

          <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <BarChart3 className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-blue-900">Shops actifs</p>
                <p className="text-xs text-blue-600">Avec commandes</p>
              </div>
            </div>
            <span className="text-2xl font-bold text-blue-900">
              {new Set(commandes.map(c => c.publisher_shop_name)).size}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
