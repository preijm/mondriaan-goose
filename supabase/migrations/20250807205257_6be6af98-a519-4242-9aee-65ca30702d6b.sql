-- Remove likes from tests dated January 1, 1970
DELETE FROM likes 
WHERE milk_test_id IN (
  SELECT id FROM milk_tests 
  WHERE DATE(created_at) = '1970-01-01'
);

-- Remove comments from tests dated January 1, 1970
DELETE FROM comments 
WHERE milk_test_id IN (
  SELECT id FROM milk_tests 
  WHERE DATE(created_at) = '1970-01-01'
);