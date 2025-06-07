CREATE OR REPLACE FUNCTION sp_hard_delete_book(p_id INT)
RETURNS TABLE(message TEXT) AS $$
DECLARE
  book_name TEXT;
BEGIN
  SELECT name INTO book_name FROM books WHERE id = p_id;

  IF book_name IS NULL THEN
    RAISE EXCEPTION 'Book with ID % not found', p_id;
  END IF;

  DELETE FROM books WHERE id = p_id;

  RETURN QUERY SELECT format('Book "%s" has been permanently deleted', book_name)::TEXT;
END;
$$ LANGUAGE plpgsql;