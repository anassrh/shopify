import { supabase, Shop } from './supabase';

// Fonction pour synchroniser les shops depuis AWIN
export const syncShopsFromAwin = async (): Promise<{ success: boolean; error?: string; shops?: Shop[] }> => {
  try {
    // Simulation de données de shops (à remplacer par l'API AWIN réelle)
    const mockShops: Shop[] = [
      {
        id: '1',
        shop_id: 1,
        nom: 'Shop Fashion',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        is_marque: true,
        commission_client_exclusive: 5.0,
        commission_nouveau_client: 8.0,
        pourcentage: 6.5,
        creator: 'system',
        slug: 'shop-fashion',
        commission_nouveau: 8.0,
      },
      {
        id: '2',
        shop_id: 2,
        nom: 'Tech Store',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        is_marque: true,
        commission_client_exclusive: 4.0,
        commission_nouveau_client: 7.0,
        pourcentage: 5.5,
        creator: 'system',
        slug: 'tech-store',
        commission_nouveau: 7.0,
      },
      {
        id: '3',
        shop_id: 3,
        nom: 'Beauty Shop',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        is_marque: true,
        commission_client_exclusive: 6.0,
        commission_nouveau_client: 9.0,
        pourcentage: 7.5,
        creator: 'system',
        slug: 'beauty-shop',
        commission_nouveau: 9.0,
      },
    ];

    // Insérer ou mettre à jour les shops
    const { error } = await supabase
      .from('shops')
      .upsert(mockShops, { onConflict: 'shop_id' });

    if (error) {
      throw error;
    }

    return { success: true, shops: mockShops };
  } catch (error) {
    console.error('Erreur synchronisation shops:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Erreur inconnue' 
    };
  }
};

// Fonction pour récupérer tous les shops
export const getAllShops = async (): Promise<{ success: boolean; error?: string; shops?: Shop[] }> => {
  try {
    const { data, error } = await supabase
      .from('shops')
      .select('*')
      .order('nom', { ascending: true });

    if (error) {
      throw error;
    }

    return { success: true, shops: data || [] };
  } catch (error) {
    console.error('Erreur récupération shops:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Erreur inconnue' 
    };
  }
};
