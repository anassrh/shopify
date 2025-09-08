# 🚀 AwinManager - Application de Gestion AWIN

Application complète de gestion des commandes et de l'affiliation AWIN avec système d'authentification, tableau de bord et gestion des commandes.

## 📋 Table des matières

- [Fonctionnalités](#-fonctionnalités)
- [Technologies utilisées](#-technologies-utilisées)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Utilisation](#-utilisation)
- [Structure du projet](#-structure-du-projet)
- [Base de données](#-base-de-données)
- [Déploiement](#-déploiement)

## ✨ Fonctionnalités

### 🔐 Authentification
- **Connexion/Inscription** par email et mot de passe
- **Système de rôles** : Admin, Manager, Utilisateur
- **Gestion des sessions** avec Supabase Auth
- **Interface moderne** avec dégradés et animations

### 📊 Dashboard
- **Statistiques en temps réel** des commandes
- **Graphiques interactifs** (statut, shops, mensuel)
- **Actions rapides** vers les principales fonctionnalités
- **Métriques clés** : total commandes, montants, taux de validation

### 🛒 Gestion des Commandes
- **Tableau complet** avec toutes les colonnes AWIN
- **Filtres avancés** : recherche, statut, shop
- **Sélection multiple** avec actions en lot
- **Validation/Refus** des commandes en un clic
- **États visuels** : effets de succès/erreur
- **Pagination** et tri des données

### 🏢 Gestion des Marques
- **Liste des partenaires** et annonceurs
- **Statistiques par marque**
- **Gestion des statuts** (actif, inactif, suspendu)
- **Informations détaillées** : description, site web, logo

### ⏰ Dernières Commandes
- **Activité récente** avec filtres temporels
- **Actions rapides** de validation
- **Statistiques périodiques**
- **Alertes** pour les commandes en attente

### 👤 Gestion du Compte
- **Profil utilisateur** avec informations personnelles
- **Gestion des rôles** et permissions
- **Paramètres de sécurité**
- **Statistiques personnelles**

## 🛠 Technologies utilisées

- **Frontend** : Next.js 15, React 19, TypeScript
- **Styling** : Tailwind CSS avec animations personnalisées
- **Backend** : Supabase (PostgreSQL, Auth, RLS)
- **Icons** : Lucide React
- **State Management** : React Context API

## 🚀 Installation

### Prérequis
- Node.js 18+ 
- npm ou yarn
- Compte Supabase

### 1. Cloner le projet
```bash
git clone <url-du-repo>
cd awin-manager
```

### 2. Installer les dépendances
```bash
npm install
# ou
yarn install
```

### 3. Configuration des variables d'environnement
```bash
cp env.example .env.local
```

Éditez le fichier `.env.local` avec vos informations Supabase :
```env
NEXT_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
N8N_WEBHOOK_URL=https://n8n.srv893229.hstgr.cloud/webhook-test/...
```

### 4. Configuration de la base de données
1. Connectez-vous à votre projet Supabase
2. Allez dans l'éditeur SQL
3. Exécutez le script `sql/auth_schema.sql`
4. Exécutez le script `sql/simple_profiles_setup.sql`

### 5. Lancer l'application
```bash
npm run dev
# ou
yarn dev
```

L'application sera accessible sur [http://localhost:3000](http://localhost:3000)

## ⚙️ Configuration

### Base de données Supabase

#### 1. Créer un projet Supabase
- Allez sur [supabase.com](https://supabase.com)
- Créez un nouveau projet
- Récupérez l'URL et les clés API

#### 2. Exécuter les scripts SQL
```sql
-- Exécuter dans l'éditeur SQL de Supabase
-- Voir sql/auth_schema.sql pour le schéma complet
```

#### 3. Configurer l'authentification
- Activez l'authentification par email dans Supabase
- Configurez les politiques RLS (Row Level Security)

### Variables d'environnement

| Variable | Description | Exemple |
|----------|-------------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | URL de votre projet Supabase | `https://abc123.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Clé publique Supabase | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |
| `SUPABASE_SERVICE_ROLE_KEY` | Clé de service Supabase | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |
| `N8N_WEBHOOK_URL` | URL webhook N8N (optionnel) | `https://n8n.example.com/webhook/...` |

## 📖 Utilisation

### 1. Première connexion
1. Créez un compte avec l'email `admin@awinmanager.com` pour obtenir le rôle admin
2. Ou créez un compte normal qui aura le rôle utilisateur

### 2. Navigation
- **Dashboard** : Vue d'ensemble et statistiques
- **Commandes** : Gestion et validation des commandes AWIN
- **Marques** : Gestion des partenaires et annonceurs
- **Dernières** : Activité récente et commandes à traiter
- **Compte** : Profil et paramètres utilisateur

### 3. Gestion des commandes
1. Allez dans la page "Commandes"
2. Utilisez les filtres pour trouver les commandes
3. Sélectionnez une ou plusieurs commandes
4. Cliquez sur "Valider" ou "Refuser"
5. Les actions sont sauvegardées en temps réel

### 4. Rôles et permissions

#### 👑 Administrateur
- Accès complet à toutes les fonctionnalités
- Gestion des utilisateurs
- Paramètres système

#### 👨‍💼 Manager
- Gestion des commandes et marques
- Accès aux statistiques
- Validation des commandes

#### 👤 Utilisateur
- Consultation des données
- Validation des commandes
- Gestion du profil

## 📁 Structure du projet

```
awin-manager/
├── src/
│   ├── app/                    # Pages Next.js 15 (App Router)
│   │   ├── globals.css        # Styles globaux
│   │   ├── layout.tsx         # Layout principal
│   │   ├── page.tsx           # Dashboard
│   │   ├── auth/              # Page d'authentification
│   │   ├── ventes/            # Gestion des commandes
│   │   ├── marques/           # Gestion des marques
│   │   ├── dernieres-commandes/ # Dernières commandes
│   │   └── compte/            # Gestion du compte
│   ├── components/            # Composants réutilisables
│   │   ├── AuthForm.tsx       # Formulaire d'authentification
│   │   ├── Navbar.tsx         # Barre de navigation
│   │   ├── ProtectedLayout.tsx # Layout protégé
│   │   ├── DynamicStats.tsx   # Statistiques dynamiques
│   │   └── OrderCharts.tsx    # Graphiques des commandes
│   ├── contexts/              # Contextes React
│   │   └── AuthContext.tsx    # Contexte d'authentification
│   └── lib/                   # Utilitaires et configuration
│       ├── supabase.ts        # Configuration Supabase
│       ├── n8nWebhook.ts      # Webhooks N8N
│       └── syncShops.ts       # Synchronisation des shops
├── sql/                       # Scripts SQL
│   ├── auth_schema.sql        # Schéma de base de données
│   └── simple_profiles_setup.sql # Configuration des profils
├── public/                    # Fichiers statiques
├── package.json               # Dépendances
├── tailwind.config.js         # Configuration Tailwind
├── tsconfig.json              # Configuration TypeScript
└── README.md                  # Documentation
```

## 🗄️ Base de données

### Tables principales

#### `profiles`
- Informations des utilisateurs
- Rôles et permissions
- Liée à `auth.users` de Supabase

#### `commande`
- Commandes AWIN principales
- Toutes les colonnes de l'API AWIN
- Statuts de validation

#### `shops`
- Magasins et partenaires
- Informations de base

#### `marques`
- Marques et annonceurs
- Statuts et descriptions

### Politiques de sécurité (RLS)
- Les utilisateurs ne peuvent voir que leurs propres données
- Les admins ont accès à tout
- Les managers peuvent gérer les commandes et marques

## 🚀 Déploiement

### Vercel (Recommandé)
1. Connectez votre repo GitHub à Vercel
2. Configurez les variables d'environnement
3. Déployez automatiquement

### Netlify
1. Build : `npm run build`
2. Publish directory : `.next`
3. Configurez les variables d'environnement

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 🔧 Développement

### Scripts disponibles
```bash
npm run dev          # Développement
npm run build        # Build de production
npm run start        # Serveur de production
npm run lint         # Linting ESLint
```

### Ajout de nouvelles fonctionnalités
1. Créez vos composants dans `src/components/`
2. Ajoutez vos pages dans `src/app/`
3. Utilisez TypeScript pour la robustesse
4. Suivez les conventions de nommage

## 🐛 Dépannage

### Problèmes courants

#### Erreur de connexion Supabase
- Vérifiez vos variables d'environnement
- Assurez-vous que l'URL et les clés sont correctes

#### Erreur d'authentification
- Vérifiez que les politiques RLS sont configurées
- Exécutez les scripts SQL dans l'ordre

#### Erreur de build
- Vérifiez que toutes les dépendances sont installées
- Assurez-vous d'utiliser Node.js 18+

## 📞 Support

Pour toute question ou problème :
1. Vérifiez la documentation
2. Consultez les issues GitHub
3. Contactez l'équipe de développement

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

---

**AwinManager** - Gestion efficace de vos commandes AWIN 🚀
