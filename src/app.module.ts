import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BookController } from './books/books.controller';
import { BookService } from './books/books.service';
import { BooksModule } from './books/books.module';

@Module({
  imports: [BooksModule],
  controllers: [AppController, BookController],
  providers: [AppService, BookService],
})
export class AppModule {}
