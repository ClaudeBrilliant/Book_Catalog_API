
CREATE OR REPLACE FUNCTION sp_get_book_by_isbn(p_isbn VARCHAR)
RETURNS TABLE (
    id INTEGER,
    name VARCHAR(255),
    author VARCHAR(255),
    isbn VARCHAR(255),
    publicationYear VARCHAR(20)
) AS $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM books b WHERE b.isbn = p_isbn
    ) THEN
        RAISE EXCEPTION 'Book with isbn number % not found', p_isbn;
    END IF;

    RETURN QUERY
    SELECT b.id, b.name, b.author, b.isbn, b.publicationYear
    FROM books b
    WHERE b.isbn = p_isbn;
END;
$$ LANGUAGE plpgsql;
