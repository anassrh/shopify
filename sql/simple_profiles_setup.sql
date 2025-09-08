-- Script simplifié pour créer un utilisateur admin de test
-- À exécuter après avoir créé un utilisateur via l'interface Supabase Auth

-- 1. Créer un profil admin (remplacer 'USER_ID' par l'ID de l'utilisateur créé)
-- INSERT INTO public.profiles (id, full_name, email, role) 
-- VALUES ('USER_ID', 'Admin User', 'admin@awinmanager.com', 'admin');

-- 2. Ou utiliser cette fonction pour créer automatiquement un profil admin
-- après inscription d'un utilisateur avec l'email admin@awinmanager.com

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'Utilisateur'),
    NEW.email,
    CASE 
      WHEN NEW.email = 'admin@awinmanager.com' THEN 'admin'
      ELSE 'user'
    END
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Créer le trigger pour créer automatiquement un profil
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 4. Instructions pour créer un utilisateur admin :
-- 1. Aller dans l'interface Supabase Auth
-- 2. Créer un nouvel utilisateur avec l'email : admin@awinmanager.com
-- 3. Le profil sera automatiquement créé avec le rôle admin
