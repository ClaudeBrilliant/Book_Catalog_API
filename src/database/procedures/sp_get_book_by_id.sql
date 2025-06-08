CREATE OR REPLACE FUNCTION sp_get_book_by_id(p_id INTEGER)
RETURNS TABLE (
    id INTEGER,
    name VARCHAR(255),
    author VARCHAR(255),
    isbn VARCHAR(255),
    publicationYear VARCHAR(20)
) AS $$
BEGIN
    -- Check if book exists
    IF NOT EXISTS (
        SELECT 1 FROM books b WHERE b.id = p_id
    ) THEN
        RAISE EXCEPTION 'Book with ID % not found', p_id USING ERRCODE = 'P0002';
    END IF;

    RETURN QUERY
    SELECT b.id, b.name, b.author, b.isbn, b.publicationYear
    FROM books b
    WHERE b.id = p_id;
END;
$$ LANGUAGE plpgsql;
