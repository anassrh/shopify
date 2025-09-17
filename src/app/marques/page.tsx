'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Navbar from '@/components/Navbar';
import DashboardConfigModal from '@/components/DashboardConfigModal';
import { supabase, Shop } from '@/lib/supabase';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Building2, 
  ExternalLink,
  RefreshCw,
  Filter,
  Eye,
  TrendingUp,
  AlertCircle,
  X
} from 'lucide-react';

export default function MarquesPage() {
  const router = useRouter();
  const [marques, setMarques] = useState<Shop[]>([]);
  const [filteredMarques, setFilteredMarques] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // États des filtres
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  // États des modales
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCommissionModal, setShowCommissionModal] = useState(false);
  const [showAccessModal, setShowAccessModal] = useState(false);
  const [showDashboardConfigModal, setShowDashboardConfigModal] = useState(false);
  const [editingMarque, setEditingMarque] = useState<Shop | null>(null);
  
  // États des formulaires
  const [commissionForm, setCommissionForm] = useState({
    commission_nouveau_client: '',
    commission_client_existant: ''
  });
  const [accessForm, setAccessForm] = useState({
    titre_boutique: '',
    id_shop: '',
    acces: ''
  });

  const fetchMarques = async (showLoading = true) => {
    try {
      if (showLoading) {
        setLoading(true);
      }
      setError(null);

      // Récupérer toutes les marques (true et false)
      const { data: allShops, error: allError } = await supabase
        .from('shop')
        .select('*')
        .order('nom', { ascending: true });

      if (allError) {
        throw allError;
      }

      // Afficher toutes les shops (marques actives et inactives)
      setMarques(allShops || []);
    } catch (err) {
      console.error('Erreur récupération marques:', err);
      setError('Erreur lors du chargement des marques');
    } finally {
      if (showLoading) {
        setLoading(false);
      }
    }
  };

  const filterMarques = useCallback(() => {
    let filtered = marques;

    // Filtre de recherche
    if (searchTerm) {
      filtered = filtered.filter(marque =>
        marque.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        marque.slug?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        marque.shop_id?.toString().includes(searchTerm)
      );
    }

    // Filtre de statut (basé sur is_marque)
    if (statusFilter !== 'all') {
      if (statusFilter === 'actif') {
        filtered = filtered.filter(marque => marque.is_marque === true);
      } else if (statusFilter === 'inactif') {
        filtered = filtered.filter(marque => marque.is_marque === false);
      }
    }
    
    setFilteredMarques(filtered);
  }, [marques, searchTerm, statusFilter]);

  useEffect(() => {
    fetchMarques();
  }, []);

  useEffect(() => {
    filterMarques();
  }, [filterMarques]);

  // Récupération automatique des nouvelles marques toutes les 30 secondes
  useEffect(() => {
    const interval = setInterval(() => {
      fetchMarques(false); // Pas de loading pour les mises à jour automatiques
    }, 30000); // 30 secondes

    return () => clearInterval(interval);
  }, []);

  const handleDeleteMarque = async (marqueId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette marque ?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('shop')
        .delete()
        .eq('id', marqueId);

      if (error) {
        throw error;
      }

      setMarques(prev => prev.filter(m => m.id !== marqueId));
    } catch (err) {
      console.error('Erreur suppression marque:', err);
      alert('Erreur lors de la suppression de la marque');
    }
  };

  const handleToggleStatus = async (marqueId: string, newStatus: 'actif' | 'inactif') => {
    try {
      const { error } = await supabase
        .from('shop')
        .update({ is_marque: newStatus === 'actif' })
        .eq('id', marqueId);

      if (error) {
        throw error;
      }

      setMarques(prev => prev.map(m => 
        m.id === marqueId ? { ...m, is_marque: newStatus === 'actif' } : m
      ));
    } catch (err) {
      console.error('Erreur mise à jour statut:', err);
      alert('Erreur lors de la mise à jour du statut');
    }
  };

  const getStatusColor = (isMarque: boolean) => {
    return isMarque ? 'badge-green' : 'badge-gray';
  };

  const getStatusText = (isMarque: boolean) => {
    return isMarque ? 'Actif' : 'Inactif';
  };

  const getStats = () => {
    const total = marques.length;
    const actifs = marques.filter(m => m.is_marque === true).length;
    const inactifs = marques.filter(m => m.is_marque === false).length;

    return { total, actifs, inactifs };
  };

  const handleDashboardConfig = (sections: string[]) => {
    // Stocker les sections sélectionnées dans localStorage
    localStorage.setItem('dashboard2-sections', JSON.stringify(sections));
    // Rediriger vers dashboard2
    router.push('/dashboard2');
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
              <p className="text-gray-600">Chargement des marques...</p>
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
            <h1 className="text-3xl font-bold text-gray-900">Marques</h1>
            <p className="text-gray-600 mt-2">
              Gérez vos partenaires et annonceurs AWIN
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="text-sm text-gray-500">
              Mise à jour automatique toutes les 30 secondes
            </div>
            <button 
              onClick={() => fetchMarques()}
              className="btn-secondary flex items-center space-x-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Actualiser</span>
            </button>
            <button 
              onClick={() => setShowAddModal(true)}
              className="btn-primary flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Ajouter une marque</span>
            </button>
          </div>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Marques</p>
                <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Building2 className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Actives</p>
                <p className="text-3xl font-bold text-green-600">{stats.actifs}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Inactives</p>
                <p className="text-3xl font-bold text-gray-600">{stats.inactifs}</p>
              </div>
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-gray-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Commission Moy.</p>
                <p className="text-3xl font-bold text-purple-600">
                  {marques.length > 0 
                    ? (marques.reduce((sum, m) => sum + (m.pourcentage || 0), 0) / marques.length).toFixed(1) + '%'
                    : '0%'
                  }
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filtres */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Recherche */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Rechercher une marque..."
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
              <option value="actif">Actives</option>
              <option value="inactif">Inactives</option>
            </select>
          </div>
        </div>

        {/* Tableau des marques */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Marque
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID Shop
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Slug
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Commission %
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Commission Nouveau
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Gestion
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredMarques.map((marque) => (
                  <tr key={marque.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-3 ${
                          marque.is_marque 
                            ? 'bg-blue-100' 
                            : 'bg-gray-100'
                        }`}>
                          {marque.is_marque ? (
                            <Building2 className="w-5 h-5 text-blue-600" />
                          ) : (
                            <X className="w-5 h-5 text-gray-500" />
                          )}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {marque.nom}
                          </div>
                          <div className="text-sm text-gray-500">
                            Créée le {new Date(marque.created_at).toLocaleDateString('fr-FR')}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="badge badge-blue">
                        {marque.shop_id}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs truncate">
                        {marque.slug || 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-900">
                        {marque.pourcentage ? `${marque.pourcentage}%` : 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-900">
                        {marque.commission_nouveau ? `${marque.commission_nouveau}%` : 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={marque.is_marque ? 'actif' : 'inactif'}
                        onChange={(e) => handleToggleStatus(marque.id, e.target.value as 'actif' | 'inactif')}
                        className={`badge ${getStatusColor(marque.is_marque)} cursor-pointer border-0`}
                      >
                        <option value="actif">Actif</option>
                        <option value="inactif">Inactif</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            setEditingMarque(marque);
                            setShowEditModal(true);
                          }}
                          className="text-blue-600 hover:text-blue-800 transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteMarque(marque.id)}
                          className="text-red-600 hover:text-red-800 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex space-x-2">
                        {/* Bouton Réglage commission */}
                        <button 
                          onClick={() => {
                            setEditingMarque(marque);
                            setCommissionForm({
                              commission_nouveau_client: marque.commission_nouveau_client?.toString() || '',
                              commission_client_existant: marque.commission_client_exclusive?.toString() || ''
                            });
                            setShowCommissionModal(true);
                          }}
                          className="flex items-center px-3 py-2 bg-blue-500 text-white rounded-lg shadow-sm hover:bg-blue-600 transition-colors text-sm"
                        >
                          <svg className="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                          </svg>
                          Commission
                        </button>

                        {/* Bouton Dashboard pour la marque 71417 */}
                        {marque.shop_id === 71417 && (
                          <button
                            onClick={() => setShowDashboardConfigModal(true)}
                            className="flex items-center px-3 py-2 bg-green-500 text-white rounded-lg shadow-sm hover:bg-green-600 transition-colors text-sm"
                          >
                            <svg className="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                            </svg>
                            Dashboard
                          </button>
                        )}

                        {/* Bouton Gestion des accès */}
                        <button 
                          onClick={() => {
                            setEditingMarque(marque);
                            setAccessForm({
                              titre_boutique: marque.nom || '',
                              id_shop: marque.shop_id?.toString() || '',
                              acces: ''
                            });
                            setShowAccessModal(true);
                          }}
                          className="flex items-center px-3 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 transition-colors text-sm"
                        >
                          <svg className="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          Accès
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredMarques.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Building2 className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Aucune marque trouvée
              </h3>
              <p className="text-gray-500">
                {searchTerm || statusFilter !== 'all'
                  ? 'Essayez de modifier vos filtres de recherche'
                  : 'Aucune marque disponible pour le moment'
                }
              </p>
            </div>
          )}
        </div>
        </div>

        {/* Modales */}
        <DashboardConfigModal
          isOpen={showDashboardConfigModal}
          onClose={() => setShowDashboardConfigModal(false)}
          onConfigure={handleDashboardConfig}
        />

      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Ajouter une nouvelle marque
            </h3>
            <p className="text-gray-600 mb-4">
              Fonctionnalité en cours de développement...
            </p>
            <button
              onClick={() => setShowAddModal(false)}
              className="btn-secondary"
            >
              Fermer
            </button>
          </div>
        </div>
      )}

      {showEditModal && editingMarque && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Modifier {editingMarque.nom}
            </h3>
            <p className="text-gray-600 mb-4">
              Fonctionnalité en cours de développement...
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowEditModal(false)}
                className="btn-secondary"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modale Réglage commission */}
      {showCommissionModal && editingMarque && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Réglage de la commission du shop
              </h3>
              <button
                onClick={() => setShowCommissionModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <p className="text-gray-600 mb-4">{editingMarque.nom}</p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  commission_nouveau_client
                </label>
                <input
                  type="text"
                  value={commissionForm.commission_nouveau_client}
                  onChange={(e) => setCommissionForm({...commissionForm, commission_nouveau_client: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="22%"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  commission_client_existant
                </label>
                <input
                  type="text"
                  value={commissionForm.commission_client_existant}
                  onChange={(e) => setCommissionForm({...commissionForm, commission_client_existant: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="50%"
                />
              </div>
            </div>
            
            <div className="mt-6">
              <button className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors">
                Sauvegarder
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modale Gestion des accès */}
      {showAccessModal && editingMarque && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Modifier partenaire
              </h3>
              <button
                onClick={() => setShowAccessModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Titre boutique
                </label>
                <input
                  type="text"
                  value={accessForm.titre_boutique}
                  onChange={(e) => setAccessForm({...accessForm, titre_boutique: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Test Marque"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ID Shop
                </label>
                <input
                  type="text"
                  value={accessForm.id_shop}
                  onChange={(e) => setAccessForm({...accessForm, id_shop: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="123456"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Accès:
                </label>
                <textarea
                  value={accessForm.acces}
                  onChange={(e) => setAccessForm({...accessForm, acces: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Détails des accès..."
                />
              </div>
            </div>
            
            <div className="mt-6 flex space-x-3">
              <button
                onClick={() => setShowAccessModal(false)}
                className="flex-1 bg-white text-gray-700 py-2 px-4 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Annuler
              </button>
              <button className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors">
                Modifier les informations
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}
