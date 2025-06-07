CREATE OR REPLACE FUNCTION count_books_by_year_range(start_year INT, end_year INT)
RETURNS TABLE(publicationYear INT, book_count INT)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT publicationYear, COUNT(*) AS book_count
  FROM books
  WHERE publicationYear BETWEEN start_year AND end_year
  GROUP BY publicationYear
  ORDER BY publicationYear;
END;
$$;
