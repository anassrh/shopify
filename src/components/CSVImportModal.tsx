'use client';

import React, { useState, useRef } from 'react';
import { X, Upload, FileText, AlertCircle, CheckCircle, Download } from 'lucide-react';

interface CSVImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (data: any[]) => void;
}

interface CSVData {
  date: string;
  ca: number;
  commandes: number;
  commission: number;
  shop: string;
}

export default function CSVImportModal({ isOpen, onClose, onImport }: CSVImportModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [previewData, setPreviewData] = useState<CSVData[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError(null);
      setSuccess(null);
      setPreviewData([]);
    }
  };

  const parseCSV = (csvText: string): CSVData[] => {
    const lines = csvText.split('\n').filter(line => line.trim());
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    
    // Vérifier les colonnes requises
    const requiredColumns = ['date', 'ca', 'commandes', 'commission', 'shop'];
    const missingColumns = requiredColumns.filter(col => !headers.includes(col));
    
    if (missingColumns.length > 0) {
      throw new Error(`Colonnes manquantes: ${missingColumns.join(', ')}`);
    }

    const data: CSVData[] = [];
    
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim());
      
      if (values.length !== headers.length) {
        throw new Error(`Ligne ${i + 1}: Nombre de colonnes incorrect`);
      }

      const row: CSVData = {
        date: values[headers.indexOf('date')],
        ca: parseFloat(values[headers.indexOf('ca')]) || 0,
        commandes: parseInt(values[headers.indexOf('commandes')]) || 0,
        commission: parseFloat(values[headers.indexOf('commission')]) || 0,
        shop: values[headers.indexOf('shop')]
      };

      // Validation des données
      if (!row.date || isNaN(row.ca) || isNaN(row.commandes) || isNaN(row.commission)) {
        throw new Error(`Ligne ${i + 1}: Données invalides`);
      }

      data.push(row);
    }

    return data;
  };

  const handleProcessFile = async () => {
    if (!file) return;

    setIsProcessing(true);
    setError(null);
    setSuccess(null);

    try {
      const text = await file.text();
      const parsedData = parseCSV(text);
      
      setPreviewData(parsedData.slice(0, 5)); // Aperçu des 5 premières lignes
      setSuccess(`Fichier analysé avec succès. ${parsedData.length} lignes trouvées.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du traitement du fichier');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleImport = () => {
    if (previewData.length > 0) {
      onImport(previewData);
      setSuccess('Données importées avec succès !');
      setTimeout(() => {
        onClose();
        resetForm();
      }, 1500);
    }
  };

  const resetForm = () => {
    setFile(null);
    setError(null);
    setSuccess(null);
    setPreviewData([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const downloadTemplate = () => {
    const template = 'date,ca,commandes,commission,shop\n2024-01-01,1500.50,25,150.05,Atelier Loupiote\n2024-01-02,2300.75,40,230.08,Atelier Loupiote';
    const blob = new Blob([template], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'template_ca.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* En-tête */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Upload className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Import CSV - Chiffre d'Affaires</h2>
              <p className="text-sm text-gray-600">Importez vos données de CA depuis un fichier CSV</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Contenu */}
        <div className="p-6 space-y-6">
          {/* Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <FileText className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h3 className="font-medium text-blue-900 mb-2">Format CSV requis</h3>
                <p className="text-sm text-blue-800 mb-3">
                  Votre fichier CSV doit contenir les colonnes suivantes :
                </p>
                <div className="grid grid-cols-2 gap-2 text-sm text-blue-700">
                  <div>• <strong>date</strong> : Date (YYYY-MM-DD)</div>
                  <div>• <strong>ca</strong> : Chiffre d'affaires</div>
                  <div>• <strong>commandes</strong> : Nombre de commandes</div>
                  <div>• <strong>commission</strong> : Commission</div>
                  <div>• <strong>shop</strong> : Nom du shop</div>
                </div>
                <button
                  onClick={downloadTemplate}
                  className="mt-3 text-sm text-blue-600 hover:text-blue-800 flex items-center space-x-1"
                >
                  <Download className="w-4 h-4" />
                  <span>Télécharger le modèle</span>
                </button>
              </div>
            </div>
          </div>

          {/* Sélection de fichier */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sélectionner un fichier CSV
            </label>
            <div className="flex items-center space-x-4">
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleFileSelect}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors"
              >
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600">
                  {file ? file.name : 'Cliquez pour sélectionner un fichier CSV'}
                </p>
              </button>
              {file && (
                <button
                  onClick={handleProcessFile}
                  disabled={isProcessing}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  {isProcessing ? 'Analyse...' : 'Analyser'}
                </button>
              )}
            </div>
          </div>

          {/* Messages d'erreur/succès */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <p className="text-sm text-red-800">{error}</p>
              </div>
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <p className="text-sm text-green-800">{success}</p>
              </div>
            </div>
          )}

          {/* Aperçu des données */}
          {previewData.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">Aperçu des données (5 premières lignes)</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">CA</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Commandes</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Commission</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Shop</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {previewData.map((row, index) => (
                      <tr key={index}>
                        <td className="px-3 py-2 text-sm text-gray-900">{row.date}</td>
                        <td className="px-3 py-2 text-sm text-gray-900">{row.ca.toFixed(2)}€</td>
                        <td className="px-3 py-2 text-sm text-gray-900">{row.commandes}</td>
                        <td className="px-3 py-2 text-sm text-gray-900">{row.commission.toFixed(2)}€</td>
                        <td className="px-3 py-2 text-sm text-gray-900">{row.shop}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={handleClose}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Annuler
          </button>
          {previewData.length > 0 && (
            <button
              onClick={handleImport}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Importer les données
            </button>
          )}
        </div>
      </div>
    </div>
  );
}


