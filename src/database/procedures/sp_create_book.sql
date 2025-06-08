CREATE OR REPLACE FUNCTION sp_create_book(
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
    -- Check if book already exists
    IF EXISTS (
        SELECT 1 FROM books b
        WHERE b.name = p_name AND b.author = p_author
    ) THEN
        RAISE EXCEPTION 'Book already exists' USING ERRCODE = 'P0001';
    END IF;

    -- Insert and return the new book
    RETURN QUERY
    INSERT INTO books (name, author, isbn, publicationYear)
    VALUES (p_name, p_author, p_isbn, p_publicationYear)
    RETURNING *;
END;
$$ LANGUAGE plpgsql;