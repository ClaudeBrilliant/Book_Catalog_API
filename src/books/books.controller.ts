import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Get,
  Param,
  Delete,
  ParseIntPipe,
  Patch,
} from '@nestjs/common';
import { BookService } from './books.service';
import { CreateBookDto } from './dtos/create-book.dto';
import { UpdateBookDto } from './dtos/update-book.dto';
import { ApiResponse } from 'src/shared/interface/api-response/api-response.interface';
import { Book } from './interface/book.interface';

@Controller('books')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() data: CreateBookDto): Promise<ApiResponse<Book>> {
    try {
      const book = await this.bookService.create(data);
      return {
        success: true,
        message: 'Book added successfully',
        data: book,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to add book [Controller]',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  @Get()
  async findAll(): Promise<ApiResponse<Book[]>> {
    try {
      const books = await this.bookService.findAll();
      return {
        success: true,
        message: 'Books retrieved successfully',
        data: books,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to retrieve books',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ApiResponse<Book>> {
    try {
      const book = await this.bookService.findOne(id);
      return {
        success: true,
        message: 'Book retrieved successfully',
        data: book,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to retrieve book',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  @Get('isbn/:isbn')
  async findByIsbn(@Param('isbn') isbn: string): Promise<ApiResponse<Book>> {
    try {
      const book = await this.bookService.findByIsbn(isbn);
      return {
        success: true,
        message: 'Book retrieved successfully',
        data: book,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to retrieve book by ISBN',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  @Get('count/:year')
  async countByYear(@Param('year') publicationYear: string): Promise<any> {
    try {
      const result = await this.bookService.countByYear(publicationYear);
      return {
        success: true,
        message: `Count of books in year ${publicationYear}`,
        book: result,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to count books by year',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateBookDto,
  ): Promise<ApiResponse<Book>> {
    try {
      const book = await this.bookService.update(id, data);
      return {
        success: true,
        message: 'Book updated successfully',
        data: book,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to update book',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  @Delete(':id')
  async softDelete(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ApiResponse<{ message: string }>> {
    try {
      const result = await this.bookService.remove(id);
      return {
        success: true,
        message: result.message,
        data: result,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to soft delete book',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  @Delete(':id/permanent')
  async hardDelete(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ApiResponse<{ message: string }>> {
    try {
      const result = await this.bookService.delete(id);
      return {
        success: true,
        message: `Book permanently deleted: ${result.message}`,
        data: result,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to hard delete book',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}
