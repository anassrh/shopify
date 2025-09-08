import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Ninja Studio - Gestion des Commandes AWIN',
  description: 'Application de gestion des commandes et de l\'affiliation AWIN avec tableau de bord.',
  keywords: 'awin, affiliation, commandes, gestion, dashboard',
  authors: [{ name: 'Ninja Studio Team' }],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
