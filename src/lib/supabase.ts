import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types pour la base de données
export interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  role: 'admin' | 'manager' | 'user' | 'client';
  created_at: string;
  updated_at: string;
}

export interface Commande {
  id: string;
  created_at: string;
  updated_at: string;
  advertiser_id: number;
  advertiser_name: string;
  attribue: boolean;
  click_date: string;
  click_device: string;
  code_promo: string;
  couleur_globale: string;
  cout_annonceur: number;
  montant_ancienne_commission: number;
  montant_commission: number;
  montant_total: number;
  customer_acquisition: string;
  customer_id: number;
  customer_nom: string;
  customer_pays: string;
  customer_prenom: string;
  date_transaction: string;
  date_validation: string | null;
  frais_awin: number;
  id_eshop: number;
  id_order: string;
  id_transaction_awin: number;
  lapse_time: number;
  prix_validation: string;
  statut_commission: string;
  statut_validation: string | null;
  statut_validation_text: string;
  publisher_id: number;
  publisher_shop_name: string;
  publisher_url: string;
  raison_decline: string;
  taux_commission: number;
  total_vente: number;
  valide_par: string;
  shop_id: string;
  slug: string;
}

export interface Shop {
  id: string;
  created_at: string;
  updated_at: string;
  shop_id: number;
  nom: string;
  is_marque: boolean;
  commission_client_exclusive: number;
  commission_nouveau_client: number;
  pourcentage: number;
  creator: string;
  slug: string;
  commission_nouveau: number;
}
