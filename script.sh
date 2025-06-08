#!/bin/bash

echo "Setting up book_catalog DB....."

# Create database
psql -U postgres -h localhost -c "CREATE DATABASE books_catalog;"

# Run migrations 
psql -U postgres -h localhost -d books_catalog -f src/database/migrations/001_initial_schema.sql

# CREATE stored procedures
psql -U postgres -h localhost -d books_catalog -f src/database/procedures/sp_create_books.sql
psql -U postgres -h localhost -d books_catalog -f src/database/procedures/sp_count_by_publication_year.sql
psql -U postgres -h localhost -d books_catalog -f src/database/procedures/sp_get_books.sql
psql -U postgres -h localhost -d books_catalog -f src/database/procedures/sp_update_books.sql
psql -U postgres -h localhost -d books_catalog -f src/database/procedures/sp_delete_books.sql
psql -U postgres -h localhost -d books_catalog -f src/database/procedures/sp_get_book_by_id.sql
psql -U postgres -h localhost -d books_catalog -f src/database/procedures/sp_hard_delete_books.sql
psql -U postgres -h localhost -d books_catalog -f src/database/procedures/sp_soft_delete_book.sql

echo "DATABASE setup complete..."
echo "You can now run: npm run start:dev"
