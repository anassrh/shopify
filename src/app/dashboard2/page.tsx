'use client';

import React from 'react';
import Navbar from '@/components/Navbar';
import { ArrowLeft, TrendingUp, Users, ShoppingCart, Eye, Target } from 'lucide-react';
import Link from 'next/link';

export default function Dashboard2() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 ml-64">
        <div className="space-y-6">
          {/* En-tête */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link 
                href="/marques" 
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Retour aux marques
              </Link>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Rapport Atelier Loupiote</h1>
              <p className="text-gray-600 mt-2">
                Période: 1er août 2025 - 20 août 2025
              </p>
            </div>
          </div>

          {/* Layout en grille pour voir tout d'un coup */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            
            {/* Colonne gauche */}
            <div className="space-y-6">
              {/* Section REVENUS */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">REVENUS</h2>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600 mb-1">€0.00</div>
                    <div className="text-xs text-gray-600">APPROVED</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-600 mb-1">€6,262.70</div>
                    <div className="text-xs text-gray-600">PENDING</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600 mb-1">€0.00</div>
                    <div className="text-xs text-gray-600">REJECTED</div>
                  </div>
                </div>
              </div>

              {/* Section COMMISSION - 40% */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">COMMISSION - 40%</h2>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600 mb-1">€0.00</div>
                    <div className="text-xs text-gray-600">APPROVED</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-600 mb-1">€2,505.08</div>
                    <div className="text-xs text-gray-600">PENDING</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600 mb-1">€0.00</div>
                    <div className="text-xs text-gray-600">REJECTED</div>
                  </div>
                </div>
              </div>

              {/* Section METRICS */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">METRICS</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-xl font-bold text-blue-600 mb-1">28</div>
                    <div className="text-xs text-gray-600">ORDERS - NET</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-purple-600 mb-1">€223.67</div>
                    <div className="text-xs text-gray-600">AOV</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-indigo-600 mb-1">4,419</div>
                    <div className="text-xs text-gray-600">CLICKS</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-green-600 mb-1">12</div>
                    <div className="text-xs text-gray-600">ACTIVE PUBLISHERS</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-orange-600 mb-1">7</div>
                    <div className="text-xs text-gray-600">PRODUCTIVE PUBLISHERS</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-pink-600 mb-1">10,940</div>
                    <div className="text-xs text-gray-600">IMPRESSIONS</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Colonne droite */}
            <div className="space-y-6">
              {/* Section TYPE DE CLIENT */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">TYPE DE CLIENT</h2>
                <p className="text-xs text-gray-600 mb-3">1er août 2025 - 20 août 2025</p>
                <div className="flex items-center justify-center">
                  <div className="relative w-32 h-32">
                    <div className="absolute inset-0 rounded-full border-4 border-blue-200"></div>
                    <div className="absolute inset-0 rounded-full border-4 border-yellow-200" style={{clipPath: 'polygon(50% 50%, 50% 0%, 100% 0%, 100% 50%)'}}></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-lg font-bold text-gray-900">82.1%</div>
                        <div className="text-xs text-gray-600">New</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-center space-x-4 mt-3">
                  <div className="flex items-center space-x-1">
                    <div className="w-3 h-3 bg-blue-200 rounded"></div>
                    <span className="text-xs text-gray-600">New: 82.1%</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-3 h-3 bg-yellow-200 rounded"></div>
                    <span className="text-xs text-gray-600">Repeat: 17.9%</span>
                  </div>
                </div>
              </div>

              {/* Section RÉPARTITION DES VENTES */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">RÉPARTITION DES VENTES</h2>
                <p className="text-xs text-gray-600 mb-3">1er août 2025 - 20 août 2025</p>
                <div className="flex items-center justify-center">
                  <div className="relative w-32 h-32">
                    <div className="absolute inset-0 rounded-full border-4 border-blue-200"></div>
                    <div className="absolute inset-0 rounded-full border-4 border-yellow-200" style={{clipPath: 'polygon(50% 50%, 50% 0%, 100% 0%, 100% 50%)'}}></div>
                    <div className="absolute inset-0 rounded-full border-4 border-red-200" style={{clipPath: 'polygon(50% 50%, 100% 50%, 100% 100%, 50% 100%)'}}></div>
                    <div className="absolute inset-0 rounded-full border-4 border-green-200" style={{clipPath: 'polygon(50% 50%, 50% 100%, 0% 100%, 0% 50%)'}}></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-lg font-bold text-gray-900">67.9%</div>
                        <div className="text-xs text-gray-600">Price Comparison</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-3">
                  <div className="flex items-center space-x-1">
                    <div className="w-3 h-3 bg-blue-200 rounded"></div>
                    <span className="text-xs text-gray-600">Price Comparison: 67.9%</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-3 h-3 bg-yellow-200 rounded"></div>
                    <span className="text-xs text-gray-600">Coupons/Deals: 25%</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-3 h-3 bg-red-200 rounded"></div>
                    <span className="text-xs text-gray-600">Cashback</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-3 h-3 bg-green-200 rounded"></div>
                    <span className="text-xs text-gray-600">Loyalty/Rewards</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section PERFORMANCE PAR TYPE D'ÉDITEUR - Pleine largeur */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">PERFORMANCE PAR TYPE D'ÉDITEUR</h2>
            <p className="text-xs text-gray-600 mb-4">AUG 1, 2025 - AUG 20, 2025</p>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Publisher Type
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Orders - Net
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Revenue - Approved
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Revenue - Pending
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      AOV
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Clicks
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr className="hover:bg-gray-50">
                    <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                      Price Comparison
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">19</td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">€0.00</td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">€4,682.80</td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">€246.46</td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">4,266</td>
                  </tr>
                  <tr className="hover:bg-gray-50 bg-gray-50">
                    <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                      Cashback
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">7</td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">€0.00</td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">€1,426.00</td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">€203.71</td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">75</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                      Loyalty/Rewards
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">1</td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">€0.00</td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">€153.90</td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">€153.90</td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">49</td>
                  </tr>
                  <tr className="hover:bg-gray-50 bg-gray-50">
                    <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                      Coupons/Deals
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">1</td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">€0.00</td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">€0.00</td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">€0.00</td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">7</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                      Retargeting/Remarketing
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">0</td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">€0.00</td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">€0.00</td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">€0.00</td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">18</td>
                  </tr>
                  <tr className="hover:bg-gray-50 bg-gray-50">
                    <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                      Review Sites
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">0</td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">€0.00</td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">€0.00</td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">€0.00</td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">2</td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                      (Not Set)
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">0</td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">€0.00</td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">€0.00</td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">€0.00</td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">2</td>
                  </tr>
                  <tr className="hover:bg-gray-50 bg-blue-50 border-t-2 border-blue-200">
                    <td className="px-3 py-2 whitespace-nowrap text-sm font-bold text-gray-900">
                      Total
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm font-bold text-gray-900">28</td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm font-bold text-gray-900">€0.00</td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm font-bold text-gray-900">€6,262.70</td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm font-bold text-gray-900">€223.67</td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm font-bold text-gray-900">4,419</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
