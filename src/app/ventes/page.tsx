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
  Square,
  Upload
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
  
  // État pour le bouton actualiser
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // État pour la popup d'import
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isImporting, setIsImporting] = useState(false);

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

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedCommandes(filteredCommandes.map(c => c.id));
    } else {
      setSelectedCommandes([]);
    }
  };

  const handleSelectCommande = (commandeId: string, checked: boolean) => {
    if (checked) {
      setSelectedCommandes(prev => [...prev, commandeId]);
    } else {
      setSelectedCommandes(prev => prev.filter(id => id !== commandeId));
    }
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

  // Fonction pour déclencher le webhook et actualiser les données
  const handleRefresh = async () => {
    try {
      setIsRefreshing(true);
      
      // Appel du webhook
      const response = await fetch('https://n8n.srv893229.hstgr.cloud/webhook/update-commandes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'refresh_commandes',
          timestamp: new Date().toISOString()
        })
      });

      if (!response.ok) {
        throw new Error(`Erreur webhook: ${response.status}`);
      }

      // Attendre un peu pour que le webhook traite les données
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Actualiser les données locales
      await fetchCommandes(false);
      
      console.log('Webhook déclenché avec succès');
    } catch (error) {
      console.error('Erreur lors du déclenchement du webhook:', error);
      // Même en cas d'erreur, on actualise les données locales
      await fetchCommandes(false);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Fonction pour parser le CSV de manière plus robuste
  const parseCSV = (csvText: string) => {
    const lines = csvText.split('\n').filter(line => line.trim());
    if (lines.length < 2) return [];
    
    // Parser la première ligne pour obtenir les en-têtes
    const headers = parseCSVLine(lines[0]);
    const data = [];

    for (let i = 1; i < lines.length; i++) {
      if (lines[i].trim()) {
        const values = parseCSVLine(lines[i]);
        const row: any = {};
        
        headers.forEach((header, index) => {
          row[header] = values[index] || '';
        });
        
        data.push(row);
      }
    }
    
    return data;
  };

  // Fonction pour parser une ligne CSV en gérant les guillemets et virgules
  const parseCSVLine = (line: string): string[] => {
    const result = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    
    result.push(current.trim());
    return result.map(value => value.replace(/^"|"$/g, ''));
  };

  // Fonction pour importer les commandes CSV
  const handleImportCSV = async () => {
    if (!selectedFile) {
      alert('Veuillez sélectionner un fichier CSV');
      return;
    }

    try {
      setIsImporting(true);
      
      // Lire le fichier CSV
      const csvText = await selectedFile.text();
      const csvData = parseCSV(csvText);
      
      console.log('Données CSV parsées:', csvData);
      
      // Fonction pour parser une date de manière sécurisée
      const parseDate = (dateString: string): string => {
        if (!dateString || dateString.trim() === '') {
          return new Date().toISOString();
        }
        
        // Essayer différents formats de date
        const formats = [
          // Format ISO: 2024-01-15T10:30:00Z
          (d: string) => new Date(d),
          // Format français: 15/01/2024 10:30
          (d: string) => {
            const parts = d.split(/[\/\s]/);
            if (parts.length >= 3) {
              const day = parts[0];
              const month = parts[1];
              const year = parts[2];
              const time = parts[3] || '00:00:00';
              return new Date(`${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}T${time}`);
            }
            return new Date(d);
          },
          // Format américain: 01/15/2024 10:30
          (d: string) => {
            const parts = d.split(/[\/\s]/);
            if (parts.length >= 3) {
              const month = parts[0];
              const day = parts[1];
              const year = parts[2];
              const time = parts[3] || '00:00:00';
              return new Date(`${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}T${time}`);
            }
            return new Date(d);
          }
        ];
        
        for (const format of formats) {
          try {
            const date = format(dateString);
            if (!isNaN(date.getTime())) {
              return date.toISOString();
            }
          } catch (e) {
            // Continuer avec le format suivant
          }
        }
        
        // Si aucun format ne fonctionne, utiliser la date actuelle
        console.warn(`Impossible de parser la date: ${dateString}, utilisation de la date actuelle`);
        return new Date().toISOString();
      };

      // Valider et transformer les données
      const commandesToImport = csvData.map((row, index) => {
        // Validation des champs requis
        if (!row.id_order || !row.publisher_shop_name || !row.publisher_id) {
          throw new Error(`Ligne ${index + 2}: Champs requis manquants (id_order, publisher_shop_name, publisher_id)`);
        }

        return {
          id_order: row.id_order,
          publisher_shop_name: row.publisher_shop_name,
          publisher_id: parseInt(row.publisher_id) || 0,
          click_date: parseDate(row.click_date),
          date_transaction: parseDate(row.date_transaction),
          lapse_time: parseInt(row.lapse_time) || 0,
          montant_total: parseFloat(row.montant_total) || 0,
          montant_commission: parseFloat(row.montant_commission) || 0,
          customer_acquisition: row.customer_acquisition === 'new' || row.customer_acquisition === 'nouveau' ? 'new' : 'returning',
          statut_validation: null, // Par défaut en attente
          date_validation: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
      });

      console.log('Commandes à importer:', commandesToImport);

      // Insérer dans la base de données
      const { data, error } = await supabase
        .from('commande')
        .insert(commandesToImport)
        .select();

      if (error) {
        throw error;
      }

      console.log('Commandes importées avec succès:', data);
      
      // Actualiser la liste des commandes
      await fetchCommandes(false);
      
      // Fermer la popup et réinitialiser
      setIsImportModalOpen(false);
      setSelectedFile(null);
      
      alert(`${commandesToImport.length} commande(s) importée(s) avec succès !`);
      
    } catch (error) {
      console.error('Erreur lors de l\'import CSV:', error);
      alert(`Erreur lors de l'import: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    } finally {
      setIsImporting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto py-6 px-4 ml-64">
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
      <div className="max-w-7xl mx-auto py-6 px-4 ml-64">
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
            <button
              onClick={() => setIsImportModalOpen(true)}
              className="btn-secondary flex items-center space-x-2"
            >
              <Upload className="w-4 h-4" />
              <span>Import Commandes</span>
            </button>
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className={`btn-secondary flex items-center space-x-2 ${
                isRefreshing ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>{isRefreshing ? 'Actualisation...' : 'Actualiser'}</span>
            </button>
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
                {currentCommandes.map((commande) => {
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
                          {commande.lapse_time ? `${commande.lapse_time}m` : 'N/A'}
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
                          <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                          </svg>
                          {formatCurrency(commande.montant_total || 0)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="commission-cell">
                          <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          {formatCurrency(commande.montant_commission || 0)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
                          commande.customer_acquisition === 'new' || commande.customer_acquisition === 'nouveau'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {commande.customer_acquisition === 'new' || commande.customer_acquisition === 'nouveau' ? 'New' : 'Returning'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
                          commande.statut_validation === 'valide' 
                            ? 'bg-green-100 text-green-800'
                            : commande.statut_validation === 'refuse'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                          </svg>
                          {commande.statut_validation === 'valide' ? 'Validée' : 
                           commande.statut_validation === 'refuse' ? 'Refusée' : 'En attente'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-1">
                          <button
                            onClick={() => handleActionClick(commande.id, 'valide')}
                            className={`inline-flex items-center justify-center w-8 h-8 rounded-md ${
                              orderActions[commande.id] === 'valide'
                                ? 'bg-green-100 text-green-800 border border-green-200'
                                : 'bg-gray-100 text-gray-800 border border-gray-200 hover:bg-gray-200'
                            }`}
                            title="Valider"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleActionClick(commande.id, 'refuse')}
                            className={`inline-flex items-center justify-center w-8 h-8 rounded-md ${
                              orderActions[commande.id] === 'refuse'
                                ? 'bg-red-100 text-red-800 border border-red-200'
                                : 'bg-gray-100 text-gray-800 border border-gray-200 hover:bg-gray-200'
                            }`}
                            title="Refuser"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleActionClick(commande.id, 'reset')}
                            className="inline-flex items-center justify-center w-8 h-8 rounded-md bg-gray-100 text-gray-800 border border-gray-200 hover:bg-gray-200"
                            title="Réinitialiser"
                          >
                            <RefreshCw className="w-4 h-4" />
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

      {/* Modal d'import CSV */}
      {isImportModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Import Commandes CSV</h3>
                <button
                  onClick={() => setIsImportModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sélectionner un fichier CSV
                </label>
                <input
                  type="file"
                  accept=".csv"
                  onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                {selectedFile && (
                  <p className="mt-2 text-sm text-green-600">
                    ✓ Fichier sélectionné: {selectedFile.name}
                  </p>
                )}
              </div>
              
              <div className="mb-4 p-3 bg-gray-50 rounded-md">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Format CSV attendu :</h4>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li>• id_order : ID de la commande</li>
                  <li>• publisher_shop_name : Nom du shop</li>
                  <li>• publisher_id : ID de l'éditeur</li>
                  <li>• click_date : Date du clic</li>
                  <li>• date_transaction : Date de transaction</li>
                  <li>• lapse_time : Temps écoulé (en minutes)</li>
                  <li>• montant_total : Montant total</li>
                  <li>• montant_commission : Commission</li>
                  <li>• customer_acquisition : Type de client (new/returning)</li>
                </ul>
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setIsImportModalOpen(false);
                    setSelectedFile(null);
                  }}
                  disabled={isImporting}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 disabled:opacity-50"
                >
                  Annuler
                </button>
                <button
                  onClick={handleImportCSV}
                  disabled={!selectedFile || isImporting}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {isImporting ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Import...
                    </>
                  ) : (
                    'Importer'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
