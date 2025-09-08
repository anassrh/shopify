'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { 
  Home, 
  ShoppingCart, 
  Package, 
  Building2, 
  Users
} from 'lucide-react';

const Navbar = () => {
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: 'Dashboard', icon: Home },
    { href: '/ventes', label: 'Commandes à Checker', icon: ShoppingCart },
    { href: '/dernieres-commandes', label: 'Commandes à Valider', icon: Package },
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