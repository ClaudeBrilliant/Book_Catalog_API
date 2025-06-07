-- Create books table
CREATE TABLE IF NOT EXISTS books (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    isbn VARCHAR(255) UNIQUE NOT NULL,
    publicationYear VARCHAR(20)  
);

-- Create index
CREATE INDEX IF NOT EXISTS idx_books_name ON books(name);  
