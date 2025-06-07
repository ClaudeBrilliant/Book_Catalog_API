import { Module } from '@nestjs/common';
import { BookController } from './books.controller';
import { BookService } from './books.service';
import { DatabaseModule } from 'src/database/database.modules';

@Module({
  controllers: [BookController],
  providers: [BookService],
  exports: [BookService],
  imports: [DatabaseModule],
})
export class BooksModule {}
