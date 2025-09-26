'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface CSVData {
  date: string;
  ca: number;
  commandes: number;
  commission: number;
  shop: string;
}

interface CSVDataContextType {
  csvData: CSVData[];
  addCSVData: (data: CSVData[]) => void;
  clearCSVData: () => void;
  getFilteredData: (dateFilter: string, customDateRange?: { start: string; end: string }) => CSVData[];
}

const CSVDataContext = createContext<CSVDataContextType | undefined>(undefined);

export function CSVDataProvider({ children }: { children: React.ReactNode }) {
  const [csvData, setCsvData] = useState<CSVData[]>([]);

  // Charger les données depuis le localStorage au montage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedData = localStorage.getItem('csvData');
      if (savedData) {
        try {
          setCsvData(JSON.parse(savedData));
        } catch (error) {
          console.error('Erreur lors du chargement des données CSV:', error);
        }
      }
    }
  }, []);

  // Sauvegarder les données dans le localStorage à chaque changement
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('csvData', JSON.stringify(csvData));
    }
  }, [csvData]);

  const addCSVData = (data: CSVData[]) => {
    setCsvData(prev => [...prev, ...data]);
  };

  const clearCSVData = () => {
    setCsvData([]);
    localStorage.removeItem('csvData');
  };

  const getFilteredData = (dateFilter: string, customDateRange?: { start: string; end: string }) => {
    let filtered = [...csvData];

    if (dateFilter === 'yesterday') {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];
      filtered = filtered.filter(item => item.date === yesterdayStr);
    } else if (dateFilter === '7days') {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      filtered = filtered.filter(item => new Date(item.date) >= sevenDaysAgo);
    } else if (dateFilter === '30days') {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      filtered = filtered.filter(item => new Date(item.date) >= thirtyDaysAgo);
    } else if (dateFilter === 'custom' && customDateRange) {
      filtered = filtered.filter(item => {
        const itemDate = new Date(item.date);
        const startDate = new Date(customDateRange.start);
        const endDate = new Date(customDateRange.end);
        return itemDate >= startDate && itemDate <= endDate;
      });
    }

    return filtered;
  };

  return (
    <CSVDataContext.Provider value={{
      csvData,
      addCSVData,
      clearCSVData,
      getFilteredData
    }}>
      {children}
    </CSVDataContext.Provider>
  );
}

export function useCSVData() {
  const context = useContext(CSVDataContext);
  if (context === undefined) {
    throw new Error('useCSVData must be used within a CSVDataProvider');
  }
  return context;
}


