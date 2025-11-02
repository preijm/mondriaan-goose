-- Delete old format notifications that don't have the new pipe-separated format
DELETE FROM public.notifications 
WHERE message LIKE '%liked your test of%'
  OR message LIKE '%commented on your test of%';