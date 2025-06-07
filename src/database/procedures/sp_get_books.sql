CREATE OR REPLACE FUNCTION sp_get_all_books()
RETURNS TABLE(id INT, name TEXT, author TEXT, isbn INT,publicationYear INT) AS $$
BEGIN
  RETURN QUERY SELECT * FROM books;
END;
$$ LANGUAGE plpgsql;