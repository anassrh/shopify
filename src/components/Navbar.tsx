'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useDemoAuth } from '@/contexts/DemoAuthContext';
import { 
  Home, 
  ShoppingCart, 
  Package, 
  Building2, 
  Users,
  LogOut,
  User,
  ChevronDown,
  ShoppingBag
} from 'lucide-react';

const Navbar = () => {
  const pathname = usePathname();
  const { user, signOut } = useDemoAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const navItems = [
    { href: '/', label: 'Dashboard', icon: Home },
    { href: '/ventes', label: 'Commandes à Checker', icon: ShoppingCart },
    { href: '/dernieres-commandes', label: 'Commandes à Valider', icon: Package },
    { href: '/shopify-commandes', label: 'Commandes Shopify', icon: ShoppingBag },
    { href: '/marques', label: 'Marques', icon: Building2 },
    { href: '/compte', label: 'Comptes', icon: Users },
  ];

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-gradient-to-b from-gray-900 to-black text-white z-50">
      {/* Logo */}
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center space-x-3">
          <Image
            src="/images/ninja.png"
            alt="Ninja Studio Logo"
            width={40}
            height={40}
            className="flex-shrink-0"
          />
          <div>
            <h1 className="text-2xl font-bold text-white">Ninja Studio</h1>
            <p className="text-gray-400 text-sm">Gestion AWIN</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="mt-6">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center px-6 py-3 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-blue-600 text-white border-r-2 border-blue-400'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5 mr-3" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* User Info */}
      {user && (
        <div className="absolute bottom-20 left-0 right-0 p-4 border-t border-gray-700">
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="w-full flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-800 transition-colors"
            >
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-sm font-medium text-white truncate">
                  {user.name}
                </p>
                <p className="text-xs text-gray-400 truncate">
                  {user.email}
                </p>
                <p className="text-xs text-blue-400 capitalize">
                  {user.role}
                </p>
              </div>
              <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
            </button>

            {/* User Menu Dropdown */}
            {showUserMenu && (
              <div className="absolute bottom-full left-0 right-0 mb-2 bg-gray-800 rounded-lg shadow-lg border border-gray-700">
                <button
                  onClick={signOut}
                  className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors rounded-lg"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Se déconnecter</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-700">
        <div className="text-center">
          <p className="text-xs text-gray-400">
            Ninja Studio - Gestion AWIN
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Version 1.0.0
          </p>
        </div>
      </div>
    </div>
  );
};

export default Navbar;