'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { supabase, Commande } from '@/lib/supabase';
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  RefreshCw, 
  Eye,
  TrendingUp,
  AlertCircle,
  Calendar
} from 'lucide-react';

export default function DernieresCommandesPage() {
  const [commandes, setCommandes] = useState<Commande[]>([]);
  const [filteredCommandes, setFilteredCommandes] = useState<Commande[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeFilter, setTimeFilter] = useState<'today' | 'week' | 'month'>('today');
  const [selectedCommandes, setSelectedCommandes] = useState<string[]>([]);
  const [orderActions, setOrderActions] = useState<Record<string, 'valide' | 'refuse'>>({});
  const [rowEffects, setRowEffects] = useState<Record<string, 'success' | 'error' | 'refused' | null>>({});

  useEffect(() => {
    fetchDernieresCommandes();
  }, [timeFilter]);

  useEffect(() => {
    setFilteredCommandes(commandes);
  }, [commandes]);

  // Récupération automatique des nouvelles commandes toutes les 30 secondes
  useEffect(() => {
    const interval = setInterval(() => {
      fetchDernieresCommandes(false); // Pas de loading pour les mises à jour automatiques
    }, 30000); // 30 secondes

    return () => clearInterval(interval);
  }, [timeFilter]);

  const fetchDernieresCommandes = async (showLoading = true) => {
    try {
      if (showLoading) {
        setLoading(true);
      }
      setError(null);

      // Calculer la date de début selon le filtre
      const now = new Date();
      let startDate: Date;

      switch (timeFilter) {
        case 'today':
          startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          break;
        case 'week':
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case 'month':
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
          break;
        default:
          startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      }

      const { data, error } = await supabase
        .from('commande')
        .select(`
          *,
          shop:shop_id (
            nom,
            shop_id
          )
        `)
        .gte('created_at', startDate.toISOString())
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) {
        throw error;
      }

      setCommandes(data || []);
    } catch (err) {
      console.error('Erreur récupération dernières commandes:', err);
      setError('Erreur lors du chargement des dernières commandes');
    } finally {
      if (showLoading) {
        setLoading(false);
      }
    }
  };

  const handleActionClick = async (commandeId: string, action: 'valide' | 'refuse') => {
    try {
      // Mettre à jour l'état local immédiatement
      setOrderActions(prev => ({ ...prev, [commandeId]: action }));
      setRowEffects(prev => ({ ...prev, [commandeId]: 'success' }));

      const { error } = await supabase
        .from('commande')
        .update({ 
          statut_validation: action,
          date_validation: new Date().toISOString()
        })
        .eq('id', commandeId);

      if (error) {
        throw error;
      }

      // Mettre à jour la liste locale
      setCommandes(prev => prev.map(c => 
        c.id === commandeId 
          ? { ...c, statut_validation: action, date_validation: new Date().toISOString() }
          : c
      ));

      // Effet visuel selon l'action
      if (action === 'refuse') {
        setRowEffects(prev => ({ ...prev, [commandeId]: 'refused' }));
        setTimeout(() => {
          setRowEffects(prev => ({ ...prev, [commandeId]: null }));
        }, 3000);
      } else {
        setRowEffects(prev => ({ ...prev, [commandeId]: 'success' }));
        setTimeout(() => {
          setRowEffects(prev => ({ ...prev, [commandeId]: null }));
        }, 2000);
      }

    } catch (err) {
      console.error('Erreur action commande:', err);
      setRowEffects(prev => ({ ...prev, [commandeId]: 'error' }));
      alert('Erreur lors de la mise à jour de la commande');
      
      // Retirer l'effet d'erreur après 3 secondes
      setTimeout(() => {
        setRowEffects(prev => ({ ...prev, [commandeId]: null }));
      }, 3000);
    }
  };

  const handleSelectCommande = (commandeId: string, checked: boolean) => {
    if (checked) {
      setSelectedCommandes(prev => [...prev, commandeId]);
    } else {
      setSelectedCommandes(prev => prev.filter(id => id !== commandeId));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedCommandes(filteredCommandes.map(c => c.id));
    } else {
      setSelectedCommandes([]);
    }
  };

  const getCustomerAcquisitionColor = (type: string) => {
    switch (type) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'returning': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string | null) => {
    switch (status) {
      case 'valide':
        return 'statut-valide';
      case 'refuse':
        return 'statut-refuse';
      case 'en_attente':
        return 'statut-en-attente';
      default:
        return 'statut-en-attente';
    }
  };

  const getStatusText = (status: string | null) => {
    switch (status) {
      case 'valide':
        return '✅ Validée';
      case 'refuse':
        return '❌ Refusée';
      case 'en_attente':
        return '⏳ En attente';
      default:
        return '⏳ En attente';
    }
  };

  const getActionButtonStyle = (commandeId: string, actionType: 'valide' | 'refuse') => {
    const currentAction = orderActions[commandeId];
    
    if (currentAction === actionType) {
      return actionType === 'valide' ? 'btn-action-valide-active' : 'btn-action-refuse-active';
    } else if (currentAction && currentAction !== actionType) {
      return 'w-8 h-8 rounded-full flex items-center justify-center text-lg font-bold transition-all bg-gray-200 border-2 border-gray-300 text-gray-400 cursor-not-allowed';
    } else {
      return actionType === 'valide' ? 'btn-action-valide' : 'btn-action-refuse';
    }
  };

  const getTimeFilterText = () => {
    switch (timeFilter) {
      case 'today': return 'Aujourd\'hui';
      case 'week': return 'Cette semaine';
      case 'month': return 'Ce mois';
      default: return 'Aujourd\'hui';
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatLapseTime = (lapseTime: number | null) => {
    if (!lapseTime) return 'N/A';
    const hours = Math.floor(lapseTime / 60);
    const minutes = lapseTime % 60;
    return `${hours}h${minutes.toString().padStart(2, '0')}`;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const getStats = () => {
    const total = commandes.length;
    const validees = commandes.filter(c => c.statut_validation === 'valide').length;
    const refusees = commandes.filter(c => c.statut_validation === 'refuse').length;
    const enAttente = commandes.filter(c => !c.statut_validation).length;
    const montantTotal = commandes.reduce((sum, c) => sum + (c.montant_total || 0), 0);

    return { total, validees, refusees, enAttente, montantTotal };
  };

  const stats = getStats();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 ml-64">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Chargement des dernières commandes...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 ml-64">
        <div className="space-y-6">
        {/* En-tête */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Commandes à Valider</h1>
            <p className="text-gray-600 mt-2">
              Activité récente et commandes à traiter
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="text-sm text-gray-500">
              Mise à jour automatique toutes les 30 secondes
            </div>
          </div>
        </div>

        {/* Filtres temporels */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              Période : {getTimeFilterText()}
            </h3>
            <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
              {[
                { key: 'today', label: 'Aujourd\'hui' },
                { key: 'week', label: 'Cette semaine' },
                { key: 'month', label: 'Ce mois' }
              ].map((filter) => (
                <button
                  key={filter.key}
                  onClick={() => setTimeFilter(filter.key as 'today' | 'week' | 'month')}
                  className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                    timeFilter === filter.key
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Statistiques rapides */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total</p>
                <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Validées</p>
                <p className="text-3xl font-bold text-green-600">{stats.validees}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Refusées</p>
                <p className="text-3xl font-bold text-red-600">{stats.refusees}</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">En Attente</p>
                <p className="text-3xl font-bold text-yellow-600">{stats.enAttente}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Montant</p>
                <p className="text-3xl font-bold text-purple-600">{formatCurrency(stats.montantTotal)}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Tableau des commandes */}
        <div className="bg-white rounded-lg shadow border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Liste des commandes</h3>
                <p className="text-sm text-gray-600">{filteredCommandes.length} commande(s) trouvée(s)</p>
              </div>
              {selectedCommandes.length > 0 && (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">{selectedCommandes.length} sélectionné(s)</span>
                  <button className="px-3 py-1 bg-blue-100 text-blue-700 rounded-md text-sm font-medium hover:bg-blue-200 transition-colors">
                    Valider sélection
                  </button>
                </div>
              )}
            </div>
          </div>
          
          {filteredCommandes.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">📭</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune commande trouvée</h3>
              <p className="text-gray-600">Essayez de modifier vos filtres ou ajoutez une commande dans la base de données.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left">
                      <input
                        type="checkbox"
                        checked={selectedCommandes.length === filteredCommandes.length && filteredCommandes.length > 0}
                        onChange={(e) => handleSelectAll(e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Shop</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID Éditeur</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date clic</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date transaction</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lapse time</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID Commande</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Montant</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Commission</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer acquisition</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredCommandes.map((commande) => {
                    const rowEffect = rowEffects[commande.id];
                    const rowClass = rowEffect === 'success' 
                      ? 'bg-green-50 border-l-4 border-green-500 shadow-sm' 
                      : rowEffect === 'refused'
                      ? 'row-refused'
                      : rowEffect === 'error' 
                      ? 'bg-red-50 border-l-4 border-red-500 shadow-sm' 
                      : 'hover:bg-gray-50';
                    
                    return (
                      <tr key={commande.id} className={`transition-all duration-500 ${rowClass}`}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="checkbox"
                            checked={selectedCommandes.includes(commande.id)}
                            onChange={(e) => handleSelectCommande(commande.id, e.target.checked)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                            <div>
                              <div className="text-sm font-medium text-gray-900">{commande.publisher_shop_name || 'N/A'}</div>
                              <div className="text-xs text-gray-500">Shop</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-md border border-gray-200">
                            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {commande.publisher_id || 'N/A'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm">
                            <div className="text-gray-900 font-medium">{formatDate(commande.click_date)}</div>
                            <div className="text-xs text-gray-500">Clic</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm">
                            <div className="text-gray-900 font-medium">{formatDate(commande.date_transaction)}</div>
                            <div className="text-xs text-gray-500">Transaction</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="lapse-time-cell">
                            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                            </svg>
                            {formatLapseTime(commande.lapse_time)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="id-commande-cell">
                            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                            </svg>
                            {commande.id_order || 'N/A'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="montant-cell">
                            <svg className="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                            </svg>
                            €{commande.montant_total?.toFixed(2) || '0.00'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="commission-cell">
                            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            €{commande.montant_commission?.toFixed(2) || '0.00'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={
                            commande.customer_acquisition === 'new' || commande.customer_acquisition === 'nouveau'
                              ? 'customer-new'
                              : 'customer-returning'
                          }>
                            {commande.customer_acquisition === 'new' || commande.customer_acquisition === 'nouveau' ? 'Nouveau' : 'Retour'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={getStatusColor(commande.statut_validation || 'en_attente')}>
                            {getStatusText(commande.statut_validation || 'en_attente')}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleActionClick(commande.id, 'valide')}
                              className={getActionButtonStyle(commande.id, 'valide')}
                            >
                              ✓
                            </button>
                            <button
                              onClick={() => handleActionClick(commande.id, 'refuse')}
                              className={getActionButtonStyle(commande.id, 'refuse')}
                            >
                              ✕
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Actions rapides */}
        {stats.enAttente > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center mr-3">
                  <AlertCircle className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-yellow-900">
                    {stats.enAttente} commande(s) en attente de validation
                  </h3>
                  <p className="text-yellow-700">
                    Ces commandes nécessitent votre attention pour être validées ou refusées.
                  </p>
                </div>
              </div>
              <button className="btn-warning">
                Traiter maintenant
              </button>
            </div>
          </div>
        )}
        </div>
      </div>
    </div>
  );
}
