CREATE OR REPLACE FUNCTION sp_create_book(
  p_name TEXT,
  p_author TEXT,
  p_isbn INT,
  p_year INT
)
RETURNS TABLE(
  id INT,
  name TEXT,
  author TEXT,
  isbn INT,
  publicationYear INT
)
AS $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM books
    WHERE name = p_name AND author = p_author
  ) THEN
    RAISE EXCEPTION 'Book already exists';
  END IF;

  RETURN QUERY
  INSERT INTO books(name, author, isbn, publicationYear)
  VALUES (p_name, p_author, p_isbn, p_year)
  RETURNING *;
END;
$$ LANGUAGE plpgsql;
