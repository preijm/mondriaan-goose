
-- Validation trigger for comments (defense-in-depth)
CREATE OR REPLACE FUNCTION public.validate_comment_content()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path TO 'public'
AS $$
BEGIN
  -- Strip < and > to prevent XSS
  NEW.content = regexp_replace(NEW.content, '[<>]', '', 'g');
  
  -- Ensure content is not empty after trimming
  IF length(trim(NEW.content)) = 0 THEN
    RAISE EXCEPTION 'Comment content cannot be empty';
  END IF;
  
  -- Enforce max length
  IF length(NEW.content) > 1000 THEN
    RAISE EXCEPTION 'Comment content must be 1000 characters or less';
  END IF;
  
  RETURN NEW;
END;
$$;

-- Apply trigger on INSERT and UPDATE
CREATE TRIGGER validate_comment_before_write
BEFORE INSERT OR UPDATE ON public.comments
FOR EACH ROW EXECUTE FUNCTION public.validate_comment_content();
