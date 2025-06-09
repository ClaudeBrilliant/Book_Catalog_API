CREATE OR REPLACE FUNCTION count_books_by_year(p_year VARCHAR)
RETURNS INTEGER AS $$
DECLARE
    book_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO book_count
    FROM books
    WHERE publicationYear = p_year;

    RETURN book_count;
END;
$$ LANGUAGE plpgsql;
