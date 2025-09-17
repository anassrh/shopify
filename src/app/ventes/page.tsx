'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Navbar from '@/components/Navbar';
import { supabase, Commande } from '@/lib/supabase';
import { 
  Search, 
  Filter, 
  CheckCircle, 
  XCircle, 
  RefreshCw, 
  Download,
  Eye,
  CheckSquare,
  Square
} from 'lucide-react';

export default function VentesPage() {
  const [commandes, setCommandes] = useState<Commande[]>([]);
  const [filteredCommandes, setFilteredCommandes] = useState<Commande[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // États des filtres
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [shopFilter, setShopFilter] = useState('all');
  
  // États de sélection
  const [selectedCommandes, setSelectedCommandes] = useState<string[]>([]);
  const [orderActions, setOrderActions] = useState<{[key: string]: 'valide' | 'refuse' | null}>({});
  const [rowEffects, setRowEffects] = useState<{[key: string]: 'success' | 'error' | 'refused' | null}>({});
  
  // États des shops
  const [shops, setShops] = useState<{shop_id: string, nom: string}[]>([]);
  
  // États de pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchCommandes = async (showLoading = true) => {
    try {
      if (showLoading) {
        setLoading(true);
      }
      setError(null);

      const { data, error } = await supabase
        .from('commande')
        .select(`
          *,
          shop:shop_id (
            nom,
            shop_id
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setCommandes(data || []);
    } catch (err) {
      console.error('Erreur récupération commandes:', err);
      setError('Erreur lors du chargement des commandes');
    } finally {
      if (showLoading) {
        setLoading(false);
      }
    }
  };

  const fetchShops = async () => {
    try {
      const { data, error } = await supabase
        .from('shop')
        .select('shop_id, nom')
        .order('nom', { ascending: true });

      if (error) {
        throw error;
      }

      setShops(data || []);
    } catch (err) {
      console.error('Erreur récupération shops:', err);
    }
  };

  const filterCommandes = useCallback(() => {
    let filtered = commandes;

    // Filtre de recherche
    if (searchTerm) {
      filtered = filtered.filter(commande =>
        commande.id_order?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        commande.publisher_shop_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        commande.publisher_id?.toString().includes(searchTerm)
      );
    }

    // Filtre de statut
    if (statusFilter !== 'all') {
      filtered = filtered.filter(commande => {
        if (statusFilter === 'valide') return commande.statut_validation === 'valide';
        if (statusFilter === 'refuse') return commande.statut_validation === 'refuse';
        if (statusFilter === 'en_attente') return !commande.statut_validation;
        return true;
      });
    }

    // Filtre de shop
    if (shopFilter !== 'all') {
      filtered = filtered.filter(commande => commande.shop_id === shopFilter);
    }

    setFilteredCommandes(filtered);
  }, [commandes, searchTerm, statusFilter, shopFilter]);

  useEffect(() => {
    fetchCommandes();
    fetchShops();
  }, []);

  useEffect(() => {
    filterCommandes();
  }, [filterCommandes]);

  // Réinitialiser la page quand les filtres changent
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, shopFilter]);

  // Récupération automatique des nouvelles commandes toutes les 30 secondes
  useEffect(() => {
    const interval = setInterval(() => {
      fetchCommandes(false); // Pas de loading pour les mises à jour automatiques
    }, 30000); // 30 secondes

    return () => clearInterval(interval);
  }, []);

  const handleSelectAll = () => {
    if (selectedCommandes.length === filteredCommandes.length) {
      setSelectedCommandes([]);
    } else {
      setSelectedCommandes(filteredCommandes.map(c => c.id));
    }
  };

  const handleSelectCommande = (commandeId: string) => {
    setSelectedCommandes(prev => 
      prev.includes(commandeId) 
        ? prev.filter(id => id !== commandeId)
        : [...prev, commandeId]
    );
  };

  const handleActionClick = async (commandeId: string, action: 'valide' | 'refuse' | 'reset') => {
    try {
      const currentStatus = orderActions[commandeId];
      let newStatus;
      
      if (action === 'reset') {
        // Réinitialiser : toujours mettre à null
        newStatus = null;
      } else {
        // Valider/Refuser : toggle
        newStatus = currentStatus === action ? null : action;
      }
      
      setOrderActions(prev => ({ ...prev, [commandeId]: newStatus }));

      if (newStatus !== undefined) {
        let updateData;
        
        if (action === 'reset' || newStatus === null) {
          // Réinitialiser : remettre en état normal
          updateData = { 
            statut_validation: null,
            date_validation: null
          };
        } else {
          // Valider ou refuser
          updateData = { 
            statut_validation: newStatus,
            date_validation: new Date().toISOString()
          };
        }

        const { error } = await supabase
          .from('commande')
          .update(updateData)
          .eq('id', commandeId);

        if (error) {
          throw error;
        }

        // Effet visuel selon l'action
        if (action === 'reset' || newStatus === null) {
          setRowEffects(prev => ({ ...prev, [commandeId]: 'success' }));
          setTimeout(() => {
            setRowEffects(prev => ({ ...prev, [commandeId]: null }));
          }, 2000);
        } else if (newStatus === 'refuse') {
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

        // Mettre à jour la liste locale
        setCommandes(prev => prev.map(c => 
          c.id === commandeId 
            ? { 
                ...c, 
                statut_validation: newStatus, 
                date_validation: newStatus ? new Date().toISOString() : null 
              }
            : c
        ));
      }
    } catch (err) {
      console.error('Erreur action commande:', err);
      setRowEffects(prev => ({ ...prev, [commandeId]: 'error' }));
      setTimeout(() => {
        setRowEffects(prev => ({ ...prev, [commandeId]: null }));
      }, 2000);
    }
  };

  const handleBulkAction = async (action: 'valide' | 'refuse' | 'reset') => {
    if (selectedCommandes.length === 0) return;

    try {
      let updateData;
      
      if (action === 'reset') {
        // Réinitialiser : remettre en état normal (null)
        updateData = { 
          statut_validation: null,
          date_validation: null
        };
      } else {
        // Valider ou refuser
        updateData = { 
          statut_validation: action,
          date_validation: new Date().toISOString()
        };
      }

      const { error } = await supabase
        .from('commande')
        .update(updateData)
        .in('id', selectedCommandes);

      if (error) {
        throw error;
      }

      // Mettre à jour les actions locales
      const newActions = selectedCommandes.reduce((acc, id) => {
        if (action === 'reset') {
          acc[id] = null;
        } else {
          acc[id] = action;
        }
        return acc;
      }, {} as Record<string, 'valide' | 'refuse' | null>);
      
      setOrderActions(prev => ({ ...prev, ...newActions }));

      // Effet visuel pour toutes les commandes sélectionnées
      const effects = selectedCommandes.reduce((acc, id) => {
        if (action === 'reset') {
          acc[id] = 'success'; // Effet de succès pour la réinitialisation
        } else {
          acc[id] = action === 'refuse' ? 'refused' : 'success';
        }
        return acc;
      }, {} as Record<string, 'success' | 'refused'>);
      
      setRowEffects(prev => ({ ...prev, ...effects }));

      // Mettre à jour la liste locale
      setCommandes(prev => prev.map(c => 
        selectedCommandes.includes(c.id)
          ? { 
              ...c, 
              statut_validation: action === 'reset' ? null : action, 
              date_validation: action === 'reset' ? null : new Date().toISOString() 
            }
          : c
      ));

      // Vider la sélection
      setSelectedCommandes([]);

      // Retirer les effets après 3 secondes
      setTimeout(() => {
        setRowEffects(prev => {
          const newEffects = { ...prev };
          selectedCommandes.forEach(id => {
            delete newEffects[id];
          });
          return newEffects;
        });
      }, 3000);

    } catch (err) {
      console.error('Erreur action en lot:', err);
      alert('Erreur lors de l\'action en lot');
    }
  };

  const getStatusColor = (status: string | null) => {
    switch (status) {
      case 'valide': return 'statut-valide';
      case 'refuse': return 'statut-refuse';
      default: return 'statut-en-attente';
    }
  };

  const getStatusText = (status: string | null) => {
    switch (status) {
      case 'valide': return '✅ Validée';
      case 'refuse': return '❌ Refusée';
      default: return '⏳ En attente';
    }
  };

  const getActionButtonStyle = (commandeId: string, action: 'valide' | 'refuse') => {
    const isActive = orderActions[commandeId] === action;
    
    if (action === 'valide') {
      return isActive ? 'btn-action-valide-active' : 'btn-action-valide';
    } else {
      return isActive ? 'btn-action-refuse-active' : 'btn-action-refuse';
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit'
    }) + ' ' + date.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  // Calculs de pagination
  const totalPages = Math.ceil(filteredCommandes.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCommandes = filteredCommandes.slice(startIndex, endIndex);

  // Fonctions de pagination
  const goToPreviousPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  const goToNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="w-[calc(100%-16rem)] py-6 px-4 ml-64">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Chargement des commandes...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="w-[calc(100%-16rem)] py-6 px-4 ml-64">
        <div className="space-y-6">
        {/* En-tête */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Commandes à Checker</h1>
            <p className="text-gray-600 mt-2">
              Gérez et validez vos commandes AWIN
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="text-sm text-gray-500">
              Mise à jour automatique toutes les 30 secondes
            </div>
          </div>
        </div>

        {/* Filtres */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Recherche */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Rechercher par ID, éditeur..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Filtre statut */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Tous les statuts</option>
              <option value="valide">Validées</option>
              <option value="refuse">Refusées</option>
              <option value="en_attente">En attente</option>
            </select>

            {/* Filtre shop */}
            <select
              value={shopFilter}
              onChange={(e) => setShopFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Tous les shops</option>
              {shops.map(shop => (
                <option key={shop.shop_id} value={shop.shop_id}>
                  {shop.nom}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Actions en lot */}
        {selectedCommandes.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <p className="text-blue-700">
                {selectedCommandes.length} commande(s) sélectionnée(s)
              </p>
              <div className="flex space-x-2">
                <button 
                  onClick={() => handleBulkAction('valide')}
                  className="btn-success text-sm"
                >
                  Valider tout
                </button>
                <button 
                  onClick={() => handleBulkAction('refuse')}
                  className="btn-danger text-sm"
                >
                  Refuser tout
                </button>
                <button 
                  onClick={() => handleBulkAction('reset')}
                  className="btn-secondary text-sm"
                >
                  Réinitialiser tout
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tableau des commandes */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-visible">
            <table className="w-full divide-y divide-gray-200 table-fixed">
              <thead className="bg-gray-50">
                <tr>
                  <th className="w-12 px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button
                      onClick={handleSelectAll}
                      className="flex items-center"
                    >
                      {selectedCommandes.length === filteredCommandes.length ? (
                        <CheckSquare className="w-4 h-4 text-blue-600" />
                      ) : (
                        <Square className="w-4 h-4 text-gray-400" />
                      )}
                    </button>
                  </th>
                  <th className="w-28 px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Shop
                  </th>
                  <th className="w-16 px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID Éditeur
                  </th>
                  <th className="w-20 px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date Clic
                  </th>
                  <th className="w-20 px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date Transaction
                  </th>
                  <th className="w-16 px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Lapse Time
                  </th>
                  <th className="w-20 px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID Commande
                  </th>
                  <th className="w-16 px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Montant
                  </th>
                  <th className="w-16 px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Commission
                  </th>
                  <th className="w-14 px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="w-16 px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="w-16 px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentCommandes.map((commande) => {
                  const isSelected = selectedCommandes.includes(commande.id);
                  const rowEffect = rowEffects[commande.id];
                  
                  return (
                    <tr 
                      key={commande.id}
                      className={`hover:bg-gray-50 transition-colors ${
                        isSelected ? 'bg-blue-50' : ''
                      } ${
                        rowEffect === 'success' ? 'bg-green-50' : 
                        rowEffect === 'refused' ? 'row-refused' :
                        rowEffect === 'error' ? 'bg-red-50' : ''
                      }`}
                    >
                      <td className="px-2 py-3 whitespace-nowrap">
                        <button
                          onClick={() => handleSelectCommande(commande.id)}
                          className="flex items-center"
                        >
                          {isSelected ? (
                            <CheckSquare className="w-4 h-4 text-blue-600" />
                          ) : (
                            <Square className="w-4 h-4 text-gray-400" />
                          )}
                        </button>
                      </td>
                      <td className="px-2 py-3 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                          <span className="text-xs font-medium text-gray-900 truncate">
                            {commande.publisher_shop_name || 'N/A'}
                          </span>
                        </div>
                      </td>
                      <td className="px-2 py-3 whitespace-nowrap">
                        <span className="badge badge-blue text-xs">
                          {commande.publisher_id || 'N/A'}
                        </span>
                      </td>
                      <td className="px-2 py-3 whitespace-nowrap text-xs text-gray-900">
                        {formatDate(commande.click_date)}
                      </td>
                      <td className="px-2 py-3 whitespace-nowrap text-xs text-gray-900">
                        {formatDate(commande.date_transaction)}
                      </td>
                      <td className="px-2 py-3 whitespace-nowrap">
                        <span className="lapse-time-cell text-xs">
                          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                          </svg>
                          {commande.lapse_time ? `${commande.lapse_time}m` : 'N/A'}
                        </span>
                      </td>
                      <td className="px-2 py-3 whitespace-nowrap">
                        <span className="id-commande-cell text-xs">
                          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                          </svg>
                          {commande.id_order || 'N/A'}
                        </span>
                      </td>
                      <td className="px-2 py-3 whitespace-nowrap">
                        <span className="montant-cell text-xs">
                          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                          </svg>
                          {formatCurrency(commande.montant_total || 0)}
                        </span>
                      </td>
                      <td className="px-2 py-3 whitespace-nowrap">
                        <span className="commission-cell text-xs">
                          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          {formatCurrency(commande.montant_commission || 0)}
                        </span>
                      </td>
                      <td className="px-2 py-3 whitespace-nowrap">
                        <span className={`text-xs ${
                          commande.customer_acquisition === 'new' || commande.customer_acquisition === 'nouveau'
                            ? 'customer-new'
                            : 'customer-returning'
                        }`}>
                          {commande.customer_acquisition === 'new' || commande.customer_acquisition === 'nouveau' ? 'New' : 'Returning'}
                        </span>
                      </td>
                      <td className="px-2 py-3 whitespace-nowrap">
                        <span className={`text-xs ${getStatusColor(commande.statut_validation)}`}>
                          {getStatusText(commande.statut_validation)}
                        </span>
                      </td>
                      <td className="px-2 py-3 whitespace-nowrap text-xs font-medium">
                        <div className="flex space-x-1">
                          <button
                            onClick={() => handleActionClick(commande.id, 'valide')}
                            className={`${getActionButtonStyle(commande.id, 'valide')} text-xs px-2 py-1`}
                            title="Valider"
                          >
                            ✓
                          </button>
                          <button
                            onClick={() => handleActionClick(commande.id, 'refuse')}
                            className={`${getActionButtonStyle(commande.id, 'refuse')} text-xs px-2 py-1`}
                            title="Refuser"
                          >
                            ✕
                          </button>
                          <button
                            onClick={() => handleActionClick(commande.id, 'reset')}
                            className="btn-action-reset"
                            title="Réinitialiser"
                          >
                            ↺
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {filteredCommandes.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Aucune commande trouvée
              </h3>
              <p className="text-gray-500">
                {searchTerm || statusFilter !== 'all' || shopFilter !== 'all'
                  ? 'Essayez de modifier vos filtres de recherche'
                  : 'Aucune commande disponible pour le moment'
                }
              </p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {filteredCommandes.length > 0 && (
          <div className="flex items-center justify-between bg-white px-4 py-3 border border-gray-200 rounded-lg">
            <div className="flex items-center space-x-4">
              <button
                onClick={goToPreviousPage}
                disabled={currentPage === 1}
                className={`px-4 py-2 text-sm font-medium rounded-md border ${
                  currentPage === 1
                    ? 'border-gray-300 text-gray-400 bg-gray-100 cursor-not-allowed'
                    : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
                }`}
              >
                Précédentes
              </button>
              <span className="text-sm text-gray-700">
                Page {currentPage} sur {totalPages}
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">
                Affichage de <span className="font-medium">{startIndex + 1}</span> à{' '}
                <span className="font-medium">{Math.min(endIndex, filteredCommandes.length)}</span> sur{' '}
                <span className="font-medium">{filteredCommandes.length}</span> résultats
              </span>
              <button
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 text-sm font-medium rounded-md border ${
                  currentPage === totalPages
                    ? 'border-gray-300 text-gray-400 bg-gray-100 cursor-not-allowed'
                    : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
                }`}
              >
                Suivantes
              </button>
            </div>
          </div>
        )}
        </div>
      </div>
    </div>
  );
}
