-- Update notification triggers to use dash separator instead of bullet point

-- Update the notify_like_with_details function
CREATE OR REPLACE FUNCTION public.notify_like_with_details()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  milk_test_data RECORD;
  liker_username TEXT;
  product_desc TEXT;
  properties_arr TEXT[];
  preferences RECORD;
BEGIN
  -- Get detailed product data
  SELECT 
    mt.user_id,
    b.name as brand_name, 
    n.name as product_name,
    pr.is_barista,
    ARRAY_AGG(DISTINCT prop.name) FILTER (WHERE prop.name IS NOT NULL) as properties,
    ARRAY_AGG(DISTINCT f.name) FILTER (WHERE f.name IS NOT NULL) as flavors
  INTO milk_test_data
  FROM public.milk_tests mt
  LEFT JOIN public.products pr ON mt.product_id = pr.id
  LEFT JOIN public.brands b ON pr.brand_id = b.id
  LEFT JOIN public.names n ON pr.name_id = n.id
  LEFT JOIN public.product_properties pp ON pr.id = pp.product_id
  LEFT JOIN public.properties prop ON pp.property_id = prop.id
  LEFT JOIN public.product_flavors pf ON pr.id = pf.product_id
  LEFT JOIN public.flavors f ON pf.flavor_id = f.id
  WHERE mt.id = NEW.milk_test_id
  GROUP BY mt.user_id, b.name, n.name, pr.is_barista;

  -- Only create notification if the liker is not the test owner
  IF milk_test_data.user_id != NEW.user_id THEN
    -- Get notification preferences
    SELECT likes_enabled INTO preferences
    FROM public.notification_preferences
    WHERE user_id = milk_test_data.user_id;

    -- Check if user has disabled like notifications (default to enabled if no preference set)
    IF preferences.likes_enabled IS NULL OR preferences.likes_enabled = true THEN
      -- Get liker username
      SELECT username INTO liker_username
      FROM public.profiles
      WHERE id = NEW.user_id;

      -- Build product description with brand - product format
      product_desc := COALESCE(milk_test_data.brand_name, 'Unknown Brand');
      
      IF milk_test_data.product_name IS NOT NULL THEN
        product_desc := product_desc || ' - ' || milk_test_data.product_name;
      END IF;
      
      -- Add barista indicator
      IF milk_test_data.is_barista = true THEN
        product_desc := product_desc || '|BARISTA';
      END IF;
      
      -- Add properties
      IF milk_test_data.properties IS NOT NULL AND array_length(milk_test_data.properties, 1) > 0 THEN
        product_desc := product_desc || '|PROPERTIES:' || array_to_string(milk_test_data.properties, ',');
      END IF;
      
      -- Add flavors
      IF milk_test_data.flavors IS NOT NULL AND array_length(milk_test_data.flavors, 1) > 0 THEN
        product_desc := product_desc || '|FLAVORS:' || array_to_string(milk_test_data.flavors, ',');
      END IF;

      -- Create the notification with the new format
      INSERT INTO public.notifications (
        user_id,
        type,
        title,
        message,
        milk_test_id,
        triggered_by_user_id
      )
      VALUES (
        milk_test_data.user_id,
        'like',
        'New Like on Your Test',
        COALESCE(liker_username, 'Someone') || '|' || product_desc,
        NEW.milk_test_id,
        NEW.user_id
      );
    END IF;
  END IF;

  RETURN NEW;
END;
$function$;

-- Update the notify_comment_with_details function
CREATE OR REPLACE FUNCTION public.notify_comment_with_details()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  milk_test_data RECORD;
  commenter_username TEXT;
  product_desc TEXT;
  properties_arr TEXT[];
  preferences RECORD;
BEGIN
  -- Get detailed product data
  SELECT 
    mt.user_id,
    b.name as brand_name, 
    n.name as product_name,
    pr.is_barista,
    ARRAY_AGG(DISTINCT prop.name) FILTER (WHERE prop.name IS NOT NULL) as properties,
    ARRAY_AGG(DISTINCT f.name) FILTER (WHERE f.name IS NOT NULL) as flavors
  INTO milk_test_data
  FROM public.milk_tests mt
  LEFT JOIN public.products pr ON mt.product_id = pr.id
  LEFT JOIN public.brands b ON pr.brand_id = b.id
  LEFT JOIN public.names n ON pr.name_id = n.id
  LEFT JOIN public.product_properties pp ON pr.id = pp.product_id
  LEFT JOIN public.properties prop ON pp.property_id = prop.id
  LEFT JOIN public.product_flavors pf ON pr.id = pf.product_id
  LEFT JOIN public.flavors f ON pf.flavor_id = f.id
  WHERE mt.id = NEW.milk_test_id
  GROUP BY mt.user_id, b.name, n.name, pr.is_barista;

  -- Only create notification if the commenter is not the test owner
  IF milk_test_data.user_id != NEW.user_id THEN
    -- Get notification preferences
    SELECT comments_enabled INTO preferences
    FROM public.notification_preferences
    WHERE user_id = milk_test_data.user_id;

    -- Check if user has disabled comment notifications (default to enabled if no preference set)
    IF preferences.comments_enabled IS NULL OR preferences.comments_enabled = true THEN
      -- Get commenter username
      SELECT username INTO commenter_username
      FROM public.profiles
      WHERE id = NEW.user_id;

      -- Build product description with brand - product format
      product_desc := COALESCE(milk_test_data.brand_name, 'Unknown Brand');
      
      IF milk_test_data.product_name IS NOT NULL THEN
        product_desc := product_desc || ' - ' || milk_test_data.product_name;
      END IF;
      
      -- Add barista indicator
      IF milk_test_data.is_barista = true THEN
        product_desc := product_desc || '|BARISTA';
      END IF;
      
      -- Add properties
      IF milk_test_data.properties IS NOT NULL AND array_length(milk_test_data.properties, 1) > 0 THEN
        product_desc := product_desc || '|PROPERTIES:' || array_to_string(milk_test_data.properties, ',');
      END IF;
      
      -- Add flavors
      IF milk_test_data.flavors IS NOT NULL AND array_length(milk_test_data.flavors, 1) > 0 THEN
        product_desc := product_desc || '|FLAVORS:' || array_to_string(milk_test_data.flavors, ',');
      END IF;

      -- Create the notification with the new format
      INSERT INTO public.notifications (
        user_id,
        type,
        title,
        message,
        milk_test_id,
        triggered_by_user_id
      )
      VALUES (
        milk_test_data.user_id,
        'comment',
        'New Comment on Your Test',
        COALESCE(commenter_username, 'Someone') || '|' || product_desc,
        NEW.milk_test_id,
        NEW.user_id
      );
    END IF;
  END IF;

  RETURN NEW;
END;
$function$;

-- Update existing notifications to use dash separator
UPDATE public.notifications
SET message = REPLACE(message, ' • ', ' - ')
WHERE message LIKE '%•%';