-- Script de données de démonstration pour AwinManager
-- À exécuter après avoir créé le schéma de base

-- Insérer des shops de test
INSERT INTO public.shops (shop_id, nom) VALUES 
    ('shop_001', 'Fashion Store'),
    ('shop_002', 'Tech Hub'),
    ('shop_003', 'Beauty Corner'),
    ('shop_004', 'Home & Garden'),
    ('shop_005', 'Sports World'),
    ('shop_006', 'Electronics Plus'),
    ('shop_007', 'Book Paradise'),
    ('shop_008', 'Pet Supplies'),
    ('shop_009', 'Jewelry Box'),
    ('shop_010', 'Auto Parts')
ON CONFLICT (shop_id) DO NOTHING;

-- Insérer des marques de test
INSERT INTO public.marques (nom, advertiser_id, description, site_url, statut) VALUES 
    ('Fashion Brand', 1001, 'Marque de mode tendance pour tous les âges', 'https://fashion-brand.com', 'actif'),
    ('TechCorp', 1002, 'Technologie et électronique de pointe', 'https://techcorp.com', 'actif'),
    ('Beauty Plus', 1003, 'Cosmétiques et produits de beauté premium', 'https://beautyplus.com', 'actif'),
    ('Home Style', 1004, 'Décoration et mobilier moderne', 'https://homestyle.com', 'actif'),
    ('SportMax', 1005, 'Équipements sportifs professionnels', 'https://sportmax.com', 'actif'),
    ('BookWorld', 1006, 'Librairie en ligne avec millions de titres', 'https://bookworld.com', 'actif'),
    ('PetCare', 1007, 'Accessoires et nourriture pour animaux', 'https://petcare.com', 'inactif'),
    ('Jewelry Store', 1008, 'Bijoux et montres de luxe', 'https://jewelry-store.com', 'suspendu'),
    ('AutoParts', 1009, 'Pièces détachées automobiles', 'https://autoparts.com', 'actif'),
    ('Garden Pro', 1010, 'Outils et plantes pour jardinage', 'https://gardenpro.com', 'actif')
ON CONFLICT (advertiser_id) DO NOTHING;

-- Insérer des commandes de test
INSERT INTO public.commande (
    advertiser_id, advertiser_name, click_date, date_transaction, 
    id_order, montant_total, montant_commission, customer_acquisition,
    statut_validation, publisher_shop_name, publisher_id, shop_id,
    lapse_time, total_vente, taux_commission, customer_nom, customer_prenom,
    customer_pays, click_device, code_promo
) VALUES 
    -- Commandes d'aujourd'hui
    (1001, 'Fashion Brand', NOW() - INTERVAL '2 hours', NOW() - INTERVAL '1 hour',
     'ORD-2024-001', 89.99, 8.99, 'nouveau', 'valide', 'Fashion Store', 2001, 'shop_001',
     60, 89.99, 10.0, 'Dupont', 'Marie', 'France', 'desktop', 'WELCOME10'),
     
    (1002, 'TechCorp', NOW() - INTERVAL '4 hours', NOW() - INTERVAL '3 hours',
     'ORD-2024-002', 299.99, 29.99, 'retour', 'refuse', 'Tech Hub', 2002, 'shop_002',
     120, 299.99, 10.0, 'Martin', 'Pierre', 'France', 'mobile', 'TECH20'),
     
    (1003, 'Beauty Plus', NOW() - INTERVAL '1 day', NOW() - INTERVAL '23 hours',
     'ORD-2024-003', 45.50, 4.55, 'nouveau', null, 'Beauty Corner', 2003, 'shop_003',
     1440, 45.50, 10.0, 'Bernard', 'Sophie', 'Belgique', 'tablet', 'BEAUTY15'),
     
    (1004, 'Home Style', NOW() - INTERVAL '6 hours', NOW() - INTERVAL '5 hours',
     'ORD-2024-004', 156.75, 15.68, 'retour', 'valide', 'Home & Garden', 2004, 'shop_004',
     300, 156.75, 10.0, 'Leroy', 'Jean', 'France', 'desktop', 'HOME25'),
     
    (1005, 'SportMax', NOW() - INTERVAL '3 hours', NOW() - INTERVAL '2 hours',
     'ORD-2024-005', 78.00, 7.80, 'nouveau', null, 'Sports World', 2005, 'shop_005',
     180, 78.00, 10.0, 'Moreau', 'Thomas', 'Suisse', 'mobile', 'SPORT10'),
     
    -- Commandes de cette semaine
    (1006, 'BookWorld', NOW() - INTERVAL '2 days', NOW() - INTERVAL '1 day 23 hours',
     'ORD-2024-006', 32.50, 3.25, 'nouveau', 'valide', 'Book Paradise', 2006, 'shop_006',
     2880, 32.50, 10.0, 'Petit', 'Emma', 'France', 'desktop', 'BOOK20'),
     
    (1007, 'PetCare', NOW() - INTERVAL '3 days', NOW() - INTERVAL '2 days 22 hours',
     'ORD-2024-007', 67.80, 6.78, 'retour', 'refuse', 'Pet Supplies', 2007, 'shop_007',
     4320, 67.80, 10.0, 'Roux', 'Lucas', 'France', 'mobile', 'PET15'),
     
    (1008, 'Jewelry Store', NOW() - INTERVAL '4 days', NOW() - INTERVAL '3 days 23 hours',
     'ORD-2024-008', 450.00, 45.00, 'nouveau', 'valide', 'Jewelry Box', 2008, 'shop_008',
     5760, 450.00, 10.0, 'Blanc', 'Camille', 'France', 'desktop', 'JEWEL30'),
     
    (1009, 'AutoParts', NOW() - INTERVAL '5 days', NOW() - INTERVAL '4 days 22 hours',
     'ORD-2024-009', 125.40, 12.54, 'retour', null, 'Auto Parts', 2009, 'shop_009',
     7200, 125.40, 10.0, 'Garcia', 'Antoine', 'Espagne', 'desktop', 'AUTO20'),
     
    (1010, 'Garden Pro', NOW() - INTERVAL '6 days', NOW() - INTERVAL '5 days 23 hours',
     'ORD-2024-010', 89.90, 8.99, 'nouveau', 'valide', 'Garden Pro', 2010, 'shop_010',
     8640, 89.90, 10.0, 'Lopez', 'Isabella', 'France', 'tablet', 'GARDEN25'),
     
    -- Commandes de ce mois
    (1001, 'Fashion Brand', NOW() - INTERVAL '1 week', NOW() - INTERVAL '6 days 23 hours',
     'ORD-2024-011', 156.00, 15.60, 'nouveau', 'valide', 'Fashion Store', 2001, 'shop_001',
     10080, 156.00, 10.0, 'Durand', 'Léa', 'France', 'mobile', 'FASHION20'),
     
    (1002, 'TechCorp', NOW() - INTERVAL '2 weeks', NOW() - INTERVAL '13 days 22 hours',
     'ORD-2024-012', 899.99, 89.99, 'retour', 'valide', 'Tech Hub', 2002, 'shop_002',
     20160, 899.99, 10.0, 'Simon', 'Nicolas', 'France', 'desktop', 'TECH50'),
     
    (1003, 'Beauty Plus', NOW() - INTERVAL '3 weeks', NOW() - INTERVAL '20 days 23 hours',
     'ORD-2024-013', 67.30, 6.73, 'nouveau', 'refuse', 'Beauty Corner', 2003, 'shop_003',
     30240, 67.30, 10.0, 'Michel', 'Julie', 'Belgique', 'mobile', 'BEAUTY30'),
     
    (1004, 'Home Style', NOW() - INTERVAL '4 weeks', NOW() - INTERVAL '27 days 22 hours',
     'ORD-2024-014', 234.50, 23.45, 'retour', 'valide', 'Home & Garden', 2004, 'shop_004',
     40320, 234.50, 10.0, 'Robert', 'Paul', 'France', 'desktop', 'HOME40'),
     
    (1005, 'SportMax', NOW() - INTERVAL '5 weeks', NOW() - INTERVAL '34 days 23 hours',
     'ORD-2024-015', 178.90, 17.89, 'nouveau', 'valide', 'Sports World', 2005, 'shop_005',
     50400, 178.90, 10.0, 'Richard', 'Marc', 'Suisse', 'tablet', 'SPORT25')
ON CONFLICT DO NOTHING;

-- Créer un utilisateur admin de test (optionnel)
-- Note: Ceci doit être fait via l'interface Supabase Auth
-- L'utilisateur sera automatiquement créé avec le rôle admin grâce au trigger

-- Afficher un résumé
SELECT 
    'Shops créés' as type, 
    COUNT(*) as count 
FROM public.shops
UNION ALL
SELECT 
    'Marques créées' as type, 
    COUNT(*) as count 
FROM public.marques
UNION ALL
SELECT 
    'Commandes créées' as type, 
    COUNT(*) as count 
FROM public.commande;
