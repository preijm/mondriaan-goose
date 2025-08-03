-- Fix search_path security warnings by updating functions with proper search_path

-- Update create_like_notification function with proper search_path
CREATE OR REPLACE FUNCTION public.create_like_notification()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  milk_test_owner UUID;
  milk_test_data RECORD;
  preferences RECORD;
BEGIN
  -- Get the milk test owner and data
  SELECT mt.user_id, mt.id, p.username, b.name as brand_name, n.name as product_name
  INTO milk_test_data
  FROM public.milk_tests mt
  LEFT JOIN public.profiles p ON mt.user_id = p.id
  LEFT JOIN public.products pr ON mt.product_id = pr.id
  LEFT JOIN public.brands b ON pr.brand_id = b.id
  LEFT JOIN public.names n ON pr.name_id = n.id
  WHERE mt.id = NEW.milk_test_id;
  
  -- Don't create notification if user likes their own test
  IF milk_test_data.user_id = NEW.user_id THEN
    RETURN NEW;
  END IF;
  
  -- Check user's notification preferences
  SELECT likes_enabled INTO preferences
  FROM public.notification_preferences
  WHERE user_id = milk_test_data.user_id;
  
  -- If no preferences found, default to enabled
  IF preferences IS NULL OR preferences.likes_enabled = true THEN
    -- Get the liker's username
    INSERT INTO public.notifications (
      user_id,
      type,
      title,
      message,
      milk_test_id,
      triggered_by_user_id
    )
    SELECT 
      milk_test_data.user_id,
      'like',
      'New Like on Your Test',
      liker.username || ' liked your test of ' || COALESCE(milk_test_data.brand_name || ' ' || milk_test_data.product_name, 'a product'),
      NEW.milk_test_id,
      NEW.user_id
    FROM public.profiles liker
    WHERE liker.id = NEW.user_id;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Update create_comment_notification function with proper search_path
CREATE OR REPLACE FUNCTION public.create_comment_notification()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  milk_test_owner UUID;
  milk_test_data RECORD;
  preferences RECORD;
BEGIN
  -- Get the milk test owner and data
  SELECT mt.user_id, mt.id, p.username, b.name as brand_name, n.name as product_name
  INTO milk_test_data
  FROM public.milk_tests mt
  LEFT JOIN public.profiles p ON mt.user_id = p.id
  LEFT JOIN public.products pr ON mt.product_id = pr.id
  LEFT JOIN public.brands b ON pr.brand_id = b.id
  LEFT JOIN public.names n ON pr.name_id = n.id
  WHERE mt.id = NEW.milk_test_id;
  
  -- Don't create notification if user comments on their own test
  IF milk_test_data.user_id = NEW.user_id THEN
    RETURN NEW;
  END IF;
  
  -- Check user's notification preferences
  SELECT comments_enabled INTO preferences
  FROM public.notification_preferences
  WHERE user_id = milk_test_data.user_id;
  
  -- If no preferences found, default to enabled
  IF preferences IS NULL OR preferences.comments_enabled = true THEN
    -- Get the commenter's username
    INSERT INTO public.notifications (
      user_id,
      type,
      title,
      message,
      milk_test_id,
      triggered_by_user_id
    )
    SELECT 
      milk_test_data.user_id,
      'comment',
      'New Comment on Your Test',
      commenter.username || ' commented on your test of ' || COALESCE(milk_test_data.brand_name || ' ' || milk_test_data.product_name, 'a product'),
      NEW.milk_test_id,
      NEW.user_id
    FROM public.profiles commenter
    WHERE commenter.id = NEW.user_id;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Update create_default_notification_preferences function with proper search_path
CREATE OR REPLACE FUNCTION public.create_default_notification_preferences()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  INSERT INTO public.notification_preferences (user_id, likes_enabled, comments_enabled)
  VALUES (NEW.id, true, true);
  RETURN NEW;
END;
$$;