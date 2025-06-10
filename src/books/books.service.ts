/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  ConflictException,
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Book } from './interface/book.interface';
import { CreateBookDto } from './dtos/create-book.dto';
import { UpdateBookDto } from './dtos/update-book.dto';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class BookService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(data: CreateBookDto): Promise<Book> {
    try {
      const result = await this.databaseService.query(
        'SELECT * FROM sp_create_book($1, $2, $3, $4)',
        [
          data.name,
          data.author,
          data.isbn.toString(), // Convert to string
          data.publicationYear.toString(), // Convert to string
        ],
      );

      if (!result.rows[0]) {
        throw new InternalServerErrorException('Failed to create book');
      }

      return this.mapRowToBook(result.rows[0]);
    } catch (error) {
      if (error.message.includes('already exists')) {
        throw new ConflictException('Book already exists');
      }
      console.error('Create book error:', error);
      throw new InternalServerErrorException('Failed to create book');
    }
  }

  async findAll(): Promise<Book[]> {
    try {
      const result = await this.databaseService.query(
        'SELECT * FROM sp_get_books()',
      );
      return result.rows.map((row: any) => this.mapRowToBook(row));
    } catch {
      throw new InternalServerErrorException('Failed to retrieve books');
    }
  }

  async findOne(id: number): Promise<Book> {
    try {
      const result = await this.databaseService.query(
        'SELECT * FROM sp_get_book_by_id($1)',
        [id],
      );

      if (result.rows.length === 0) {
        throw new NotFoundException(`Book with ID ${id} not found`);
      }

      return this.mapRowToBook(result.rows[0]);
    } catch (error) {
      if (error instanceof Error && error.message.includes('not found')) {
        throw new NotFoundException(`Book with ID ${id} not found`);
      }
      throw new InternalServerErrorException('Failed to retrieve book');
    }
  }

  async findByIsbn(isbn: string): Promise<Book> {
    try {
      const result = await this.databaseService.query(
        'SELECT * FROM sp_get_book_by_isbn($1)',
        [isbn],
      );

      if (result.rows.length === 0) {
        throw new NotFoundException(`Book with isbn ${isbn} not found`);
      }

      return this.mapRowToBook(result.rows[0]);
    } catch (error) {
      if (error instanceof Error && error.message.includes('not found')) {
        throw new NotFoundException(`Book with isbn ${isbn} not found`);
      }
      throw new InternalServerErrorException('Failed to retrieve book');
    }
  }

  async update(id: number, data: UpdateBookDto): Promise<Book> {
    try {
      const result = await this.databaseService.query(
        'SELECT * FROM sp_update_book($1, $2, $3, $4, $5)',
        [
          id,
          data.name || null,
          data.author || null,
          data.isbn || null,
          data.publicationYear || null,
        ],
      );

      if (result.rows.length === 0) {
        throw new NotFoundException(`Book with ID ${id} not found`);
      }

      return this.mapRowToBook(result.rows[0]);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('not found')) {
          throw new NotFoundException(error.message);
        }
        if (error.message.includes('already exists')) {
          throw new ConflictException(error.message);
        }
      }

      throw new InternalServerErrorException('Failed to update book');
    }
  }

  async remove(id: number): Promise<{ message: string }> {
    try {
      const result = await this.databaseService.query(
        'SELECT * FROM sp_soft_delete_book($1)',
        [id],
      );

      if (result.rows.length === 0) {
        throw new NotFoundException(`Book with ID ${id} not found`);
      }

      return { message: result.rows[0].message };
    } catch (error) {
      if (error instanceof Error && error.message.includes('not found')) {
        throw new NotFoundException(`Book with ID ${id} not found`);
      }
      throw new InternalServerErrorException('Failed to soft delete book');
    }
  }

  // async count(publicationYear: number): Promise<number> {
  //   try {
  //     const result = await this.databaseService.query(
  //       'SELECT * FROM sp_count_by_publication_year($1)',
  //       [publicationYear],
  //     );

  //     if (
  //       result.rows.length === 0 ||
  //       result.rows[0].count === undefined ||
  //       result.rows[0].count === null
  //     ) {
  //       throw new NotFoundException(
  //         `No books found for publication year ${publicationYear}`,
  //       );
  //     }
  //     return result.rows[0].count;
  //   } catch (error) {
  //     if (error instanceof Error && error.message.includes('notfound')) {
  //       throw new InternalServerErrorException('Failed to soft delete book');
  //     }
  //     throw new InternalServerErrorException('Failed to count books');
  //   }
  // }
  async countByYear(publicationYear: string) {
    const result = await this.databaseService.query(
      'SELECT count_books_by_year($1)',
      [publicationYear],
    );

    return {
      publicationYear,
      count: result.rows[0].count_books_by_year,
    };
  }

  async delete(id: number): Promise<{ message: string }> {
    try {
      const result = await this.databaseService.query(
        'SELECT * FROM sp_hard_delete_book($1)',
        [id],
      );

      if (result.rows.length === 0) {
        throw new NotFoundException(`Book with ID ${id} not found`);
      }

      return { message: result.rows[0].message };
    } catch (error) {
      if (error instanceof Error && error.message.includes('not found')) {
        throw new NotFoundException(`Book with ID ${id} not found`);
      }
      throw new InternalServerErrorException('Failed to hard delete book');
    }
  }

  private mapRowToBook(row: any): Book {
    return {
      id: row.id,
      name: row.name,
      author: row.author,
      isbn: row.isbn,
      publicationYear: row.publicationYear,
    };
  }
}
