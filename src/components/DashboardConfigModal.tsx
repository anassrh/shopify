'use client';

import React, { useState } from 'react';
import { X, Check, Settings } from 'lucide-react';

interface DashboardConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfigure: (sections: string[]) => void;
}

const availableSections = [
  { id: 'revenues', name: 'REVENUS', description: 'Revenus approuvés, en attente et rejetés' },
  { id: 'commission', name: 'COMMISSION - 40%', description: 'Commissions calculées sur les revenus' },
  { id: 'metrics', name: 'METRICS', description: 'Métriques de performance (commandes, AOV, clics, etc.)' },
  { id: 'client_type', name: 'TYPE DE CLIENT', description: 'Répartition nouveaux clients vs clients existants' },
  { id: 'sales_distribution', name: 'RÉPARTITION DES VENTES', description: 'Répartition par type d\'éditeur' },
  { id: 'publisher_performance', name: 'PERFORMANCE PAR TYPE D\'ÉDITEUR', description: 'Tableau détaillé des performances par type' }
];

export default function DashboardConfigModal({ isOpen, onClose, onConfigure }: DashboardConfigModalProps) {
  const [selectedSections, setSelectedSections] = useState<string[]>([]);

  const handleSectionToggle = (sectionId: string) => {
    setSelectedSections(prev => 
      prev.includes(sectionId)
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const handleSelectAll = () => {
    setSelectedSections(availableSections.map(section => section.id));
  };

  const handleSelectNone = () => {
    setSelectedSections([]);
  };

  const handleApply = () => {
    onConfigure(selectedSections);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Settings className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">
                Configuration du Dashboard
              </h3>
              <p className="text-sm text-gray-600">
                Sélectionnez les sections à afficher dans le rapport Atelier Loupiote
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Actions rapides */}
        <div className="flex space-x-3 mb-6">
          <button
            onClick={handleSelectAll}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
          >
            Tout sélectionner
          </button>
          <button
            onClick={handleSelectNone}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm"
          >
            Tout désélectionner
          </button>
        </div>

        {/* Liste des sections */}
        <div className="space-y-3 mb-6">
          {availableSections.map((section) => {
            const isSelected = selectedSections.includes(section.id);
            
            return (
              <div
                key={section.id}
                onClick={() => handleSectionToggle(section.id)}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  isSelected
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                      isSelected
                        ? 'border-green-500 bg-green-500'
                        : 'border-gray-300'
                    }`}>
                      {isSelected && <Check className="w-3 h-3 text-white" />}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        {section.name}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {section.description}
                      </p>
                    </div>
                  </div>
                  <div className={`w-3 h-3 rounded-full ${
                    isSelected ? 'bg-green-500' : 'bg-gray-300'
                  }`} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Résumé de la sélection */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h4 className="font-semibold text-gray-900 mb-2">
            Sections sélectionnées ({selectedSections.length})
          </h4>
          <div className="flex flex-wrap gap-2">
            {selectedSections.length > 0 ? (
              selectedSections.map(sectionId => {
                const section = availableSections.find(s => s.id === sectionId);
                return (
                  <span
                    key={sectionId}
                    className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                  >
                    {section?.name}
                  </span>
                );
              })
            ) : (
              <span className="text-gray-500 text-sm">
                Aucune section sélectionnée
              </span>
            )}
          </div>
        </div>

        {/* Boutons d'action */}
        <div className="flex space-x-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Annuler
          </button>
          <button
            onClick={handleApply}
            disabled={selectedSections.length === 0}
            className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            Configurer le Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
