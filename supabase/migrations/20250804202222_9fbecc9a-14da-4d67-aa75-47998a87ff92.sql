-- Create notifications for existing likes (retroactive)
-- Only create notifications for likes where user preferences allow it or no preferences exist
INSERT INTO public.notifications (
  user_id,
  type,
  title,
  message,
  milk_test_id,
  triggered_by_user_id,
  created_at
)
SELECT 
  mt.user_id,
  'like'::notification_type,
  'New Like on Your Test',
  p_liker.username || ' liked your test of ' || COALESCE(b.name || ' ' || n.name, 'a product'),
  l.milk_test_id,
  l.user_id,
  l.created_at
FROM likes l
JOIN milk_tests mt ON l.milk_test_id = mt.id
LEFT JOIN profiles p_liker ON l.user_id = p_liker.id
LEFT JOIN products pr ON mt.product_id = pr.id
LEFT JOIN brands b ON pr.brand_id = b.id
LEFT JOIN names n ON pr.name_id = n.id
LEFT JOIN notification_preferences np ON mt.user_id = np.user_id
WHERE l.user_id != mt.user_id -- Don't include self-likes
  AND (np.likes_enabled = true OR np.likes_enabled IS NULL) -- Include if preferences allow or no preferences exist
  AND NOT EXISTS (
    SELECT 1 FROM notifications 
    WHERE user_id = mt.user_id 
      AND type = 'like' 
      AND milk_test_id = l.milk_test_id 
      AND triggered_by_user_id = l.user_id
  ); -- Don't create duplicates

-- Create notifications for existing comments (retroactive)
-- Only create notifications for comments where user preferences allow it or no preferences exist
INSERT INTO public.notifications (
  user_id,
  type,
  title,
  message,
  milk_test_id,
  triggered_by_user_id,
  created_at
)
SELECT 
  mt.user_id,
  'comment'::notification_type,
  'New Comment on Your Test',
  p_commenter.username || ' commented on your test of ' || COALESCE(b.name || ' ' || n.name, 'a product'),
  c.milk_test_id,
  c.user_id,
  c.created_at
FROM comments c
JOIN milk_tests mt ON c.milk_test_id = mt.id
LEFT JOIN profiles p_commenter ON c.user_id = p_commenter.id
LEFT JOIN products pr ON mt.product_id = pr.id
LEFT JOIN brands b ON pr.brand_id = b.id
LEFT JOIN names n ON pr.name_id = n.id
LEFT JOIN notification_preferences np ON mt.user_id = np.user_id
WHERE c.user_id != mt.user_id -- Don't include self-comments
  AND (np.comments_enabled = true OR np.comments_enabled IS NULL) -- Include if preferences allow or no preferences exist
  AND NOT EXISTS (
    SELECT 1 FROM notifications 
    WHERE user_id = mt.user_id 
      AND type = 'comment' 
      AND milk_test_id = c.milk_test_id 
      AND triggered_by_user_id = c.user_id
  ); -- Don't create duplicates