-- STEP 3: Create Function and Trigger for New Users
-- Copy and paste THIS EXACT CODE into Supabase SQL Editor
-- (Do NOT include the ``` marks)

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profile (user_id, streak, lastActivityDate, streakRecoveryAvailable)
  VALUES (NEW.id, 0, CURRENT_DATE, true);

  INSERT INTO public.user_settings (user_id, displayName, uiScale, language, themeColor, customColor)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', 'User'), 'medium', 'en', 'red', '#dc2626');

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW 
  EXECUTE PROCEDURE public.handle_new_user();
