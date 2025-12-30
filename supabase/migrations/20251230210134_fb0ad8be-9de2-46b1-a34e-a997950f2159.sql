-- Drop the overly permissive INSERT policy
DROP POLICY IF EXISTS "System can insert notifications for users" ON public.notifications;

-- Create a restrictive policy that only allows service role to insert
-- This prevents any authenticated user from inserting notifications for others
-- SECURITY DEFINER triggers (like create_comment_notification, create_like_notification) bypass RLS
CREATE POLICY "Only service role can insert notifications"
ON public.notifications
FOR INSERT
TO service_role
WITH CHECK (true);