CREATE OR REPLACE FUNCTION sp_update_book(
    p_id INTEGER,
    p_name VARCHAR(255),
    p_author VARCHAR(255),
    p_isbn VARCHAR(255),
    p_publicationYear VARCHAR(20)
)
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

    -- Check for duplicate ISBN if updating ISBN
    IF p_isbn IS NOT NULL AND EXISTS (
        SELECT 1 FROM books b 
        WHERE b.isbn = p_isbn AND b.id != p_id
    ) THEN
        RAISE EXCEPTION 'ISBN % already exists for another book', p_isbn USING ERRCODE = 'P0003';
    END IF;

    RETURN QUERY
    UPDATE books b
    SET
        name = COALESCE(p_name, b.name),
        author = COALESCE(p_author, b.author),
        isbn = COALESCE(p_isbn, b.isbn),
        publicationYear = COALESCE(p_publicationYear, b.publicationYear)
    WHERE b.id = p_id
    RETURNING b.id, b.name, b.author, b.isbn, b.publicationYear;
END;
$$ LANGUAGE plpgsql;
