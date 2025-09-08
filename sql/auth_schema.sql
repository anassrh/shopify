-- Script de configuration de la base de données pour AwinManager
-- À exécuter dans l'éditeur SQL de Supabase

-- 1. Créer la table profiles
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    full_name TEXT,
    email TEXT,
    role TEXT DEFAULT 'user' CHECK (role IN ('admin', 'manager', 'user')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Créer la table shops
CREATE TABLE IF NOT EXISTS public.shops (
    shop_id TEXT PRIMARY KEY,
    nom TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Créer la table commande (principale)
CREATE TABLE IF NOT EXISTS public.commande (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    advertiser_id INTEGER,
    advertiser_name TEXT,
    attribue BOOLEAN DEFAULT false,
    click_date TIMESTAMP WITH TIME ZONE,
    click_device TEXT,
    code_promo TEXT,
    couleur_globale TEXT,
    cout_annonceur DECIMAL(10,2),
    montant_ancienne_commission DECIMAL(10,2),
    montant_commission DECIMAL(10,2),
    montant_total DECIMAL(10,2),
    customer_acquisition TEXT,
    customer_id INTEGER,
    customer_nom TEXT,
    customer_pays TEXT,
    customer_prenom TEXT,
    date_transaction TIMESTAMP WITH TIME ZONE,
    date_validation TIMESTAMP WITH TIME ZONE,
    frais_awin DECIMAL(10,2),
    id_eshop INTEGER,
    id_order TEXT,
    id_transaction_awin INTEGER,
    lapse_time INTEGER,
    prix_validation TEXT,
    statut_commission TEXT,
    statut_validation TEXT CHECK (statut_validation IN ('valide', 'refuse', null)),
    statut_validation_text TEXT,
    publisher_id INTEGER,
    publisher_shop_name TEXT,
    publisher_url TEXT,
    raison_decline TEXT,
    taux_commission DECIMAL(5,2),
    total_vente DECIMAL(10,2),
    valide_par TEXT,
    shop_id TEXT REFERENCES public.shops(shop_id),
    slug TEXT
);

-- 4. Créer la table marques
CREATE TABLE IF NOT EXISTS public.marques (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    nom TEXT NOT NULL,
    advertiser_id INTEGER UNIQUE,
    description TEXT,
    logo_url TEXT,
    site_url TEXT,
    statut TEXT DEFAULT 'actif' CHECK (statut IN ('actif', 'inactif', 'suspendu')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Activer RLS (Row Level Security)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shops ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.commande ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marques ENABLE ROW LEVEL SECURITY;

-- 6. Politiques de sécurité pour profiles
CREATE POLICY "Les utilisateurs peuvent voir leur propre profil" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Les utilisateurs peuvent mettre à jour leur propre profil" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Les admins peuvent voir tous les profils" ON public.profiles
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- 7. Politiques de sécurité pour shops
CREATE POLICY "Tous les utilisateurs authentifiés peuvent voir les shops" ON public.shops
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Seuls les admins et managers peuvent modifier les shops" ON public.shops
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND role IN ('admin', 'manager')
        )
    );

-- 8. Politiques de sécurité pour commande
CREATE POLICY "Tous les utilisateurs authentifiés peuvent voir les commandes" ON public.commande
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Seuls les admins et managers peuvent modifier les commandes" ON public.commande
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND role IN ('admin', 'manager')
        )
    );

-- 9. Politiques de sécurité pour marques
CREATE POLICY "Tous les utilisateurs authentifiés peuvent voir les marques" ON public.marques
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Seuls les admins et managers peuvent modifier les marques" ON public.marques
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND role IN ('admin', 'manager')
        )
    );

-- 10. Fonction pour mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 11. Triggers pour updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_shops_updated_at BEFORE UPDATE ON public.shops
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_commande_updated_at BEFORE UPDATE ON public.commande
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_marques_updated_at BEFORE UPDATE ON public.marques
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 12. Insérer des données de test
INSERT INTO public.shops (shop_id, nom) VALUES 
    ('shop_001', 'Shop Fashion'),
    ('shop_002', 'Tech Store'),
    ('shop_003', 'Beauty Shop'),
    ('shop_004', 'Home Decor'),
    ('shop_005', 'Sports Shop')
ON CONFLICT (shop_id) DO NOTHING;

INSERT INTO public.marques (nom, advertiser_id, description, site_url) VALUES 
    ('Fashion Brand', 1001, 'Marque de mode tendance', 'https://fashion-brand.com'),
    ('TechCorp', 1002, 'Technologie et électronique', 'https://techcorp.com'),
    ('Beauty Plus', 1003, 'Cosmétiques et beauté', 'https://beautyplus.com'),
    ('Home Style', 1004, 'Décoration et mobilier', 'https://homestyle.com'),
    ('SportMax', 1005, 'Équipements sportifs', 'https://sportmax.com')
ON CONFLICT (advertiser_id) DO NOTHING;

-- 13. Insérer des commandes de test
INSERT INTO public.commande (
    advertiser_id, advertiser_name, click_date, date_transaction, 
    id_order, montant_total, montant_commission, customer_acquisition,
    statut_validation, publisher_shop_name, publisher_id, shop_id,
    lapse_time, total_vente, taux_commission
) VALUES 
    (1001, 'Fashion Brand', NOW() - INTERVAL '2 hours', NOW() - INTERVAL '1 hour',
     'ORD-001', 89.99, 8.99, 'nouveau', 'valide', 'Shop Fashion', 2001, 'shop_001',
     60, 89.99, 10.0),
    (1002, 'TechCorp', NOW() - INTERVAL '4 hours', NOW() - INTERVAL '3 hours',
     'ORD-002', 299.99, 29.99, 'retour', 'refuse', 'Tech Store', 2002, 'shop_002',
     120, 299.99, 10.0),
    (1003, 'Beauty Plus', NOW() - INTERVAL '1 day', NOW() - INTERVAL '23 hours',
     'ORD-003', 45.50, 4.55, 'nouveau', null, 'Beauty Shop', 2003, 'shop_003',
     1440, 45.50, 10.0),
    (1004, 'Home Style', NOW() - INTERVAL '6 hours', NOW() - INTERVAL '5 hours',
     'ORD-004', 156.75, 15.68, 'retour', 'valide', 'Home Decor', 2004, 'shop_004',
     300, 156.75, 10.0),
    (1005, 'SportMax', NOW() - INTERVAL '3 hours', NOW() - INTERVAL '2 hours',
     'ORD-005', 78.00, 7.80, 'nouveau', null, 'Sports Shop', 2005, 'shop_005',
     180, 78.00, 10.0)
ON CONFLICT DO NOTHING;
