CREATE OR REPLACE FUNCTION sp_update_book(
  p_id INT,
  p_name TEXT,
  p_author TEXT,
  p_isbn INT,
  p_year INT
)
RETURNS TABLE(id INT, name TEXT, author TEXT, isbn INT, published_year INT) AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM books WHERE id = p_id) THEN
    RAISE EXCEPTION 'Book with ID % not found', p_id;
  END IF;

  RETURN QUERY
  UPDATE books
  SET
    name = COALESCE(p_name, name),
    author = COALESCE(p_author, author),
    isbn = COALESCE(p_isbn, isbn),
    publicationYear = COALESCE(p_year, publicationYear)
  WHERE id = p_id
  RETURNING *;
END;
$$ LANGUAGE plpgsql;