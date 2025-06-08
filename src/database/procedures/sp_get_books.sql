CREATE OR REPLACE FUNCTION sp_get_books()
RETURNS TABLE (
    id INTEGER,
    name VARCHAR(255),
    author VARCHAR(255),
    isbn VARCHAR(255),
    publicationYear VARCHAR(20)
) AS $$
BEGIN
    RETURN QUERY
    SELECT b.id, b.name, b.author, b.isbn, b.publicationYear
    FROM books b
    ORDER BY b.id;
END;
$$ LANGUAGE plpgsql;