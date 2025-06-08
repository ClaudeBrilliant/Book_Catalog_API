CREATE OR REPLACE FUNCTION sp_soft_delete_book(p_id INT)
RETURNS VOID AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM books WHERE id = p_id) THEN
    RAISE EXCEPTION 'Book with ID % not found', p_id;
  END IF;

  UPDATE books
  SET deleted_at = NOW()
  WHERE id = p_id;
END;
$$ LANGUAGE plpgsql;
