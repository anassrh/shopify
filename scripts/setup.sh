#!/bin/bash

# Script d'installation pour AwinManager
echo "🚀 Installation d'AwinManager..."

# Vérifier si Node.js est installé
if ! command -v node &> /dev/null; then
    echo "❌ Node.js n'est pas installé. Veuillez installer Node.js 18+ d'abord."
    exit 1
fi

# Vérifier la version de Node.js
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ requis. Version actuelle: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) détecté"

# Installer les dépendances
echo "📦 Installation des dépendances..."
npm install

# Créer le fichier .env.local s'il n'existe pas
if [ ! -f .env.local ]; then
    echo "📝 Création du fichier .env.local..."
    cp env.example .env.local
    echo "⚠️  Veuillez configurer vos variables d'environnement dans .env.local"
else
    echo "✅ Fichier .env.local existe déjà"
fi

# Vérifier si les variables d'environnement sont configurées
if grep -q "placeholder" .env.local; then
    echo "⚠️  Veuillez configurer vos variables Supabase dans .env.local"
fi

echo ""
echo "🎉 Installation terminée !"
echo ""
echo "📋 Prochaines étapes :"
echo "1. Configurez vos variables d'environnement dans .env.local"
echo "2. Créez un projet Supabase"
echo "3. Exécutez les scripts SQL dans sql/"
echo "4. Lancez l'application avec: npm run dev"
echo ""
echo "📖 Consultez le README.md pour plus d'informations"
