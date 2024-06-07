// src/books/books.controller.ts
import { Controller, Get, Post, Body, Param, Delete ,ConflictException,HttpException} from '@nestjs/common';
import { BooksService } from './books.service';
import { Book } from './book.entity';
import { CreateBookDto } from './dto/create-book.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

@Controller('books')
@ApiTags('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Get()
  @ApiOperation({ summary: 'Get all books' })
  @ApiResponse({ status: 200, description: 'List of all books' })
  findAll(): Promise<Book[]> {
    return this.booksService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get book by ID' })
  @ApiResponse({ status: 200, description: 'The book with the given ID' })
  findOne(@Param('id') id: number): Promise<Book> {
    return this.booksService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new book' })
  @ApiResponse({ status: 201, description: 'The book has been successfully created.' })
  @ApiBody({
    type: CreateBookDto,
    description: 'Book data',
    examples: {
      'example1': {
        value: {
          code: 'NRN-7',
          title: 'The Lion, the Witch and the Wardrobe',
          author: 'C.S. Lewis',
          stock: 1
        }
      }
    }
  })
  async create(@Body() createBookDto: CreateBookDto): Promise<Book> {
    try {
      return await this.booksService.create(createBookDto);
    } catch (error) {
      if (error instanceof ConflictException) {
        throw new HttpException(error.message, 409); // Conflict
      }
      throw error;
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete book by ID' })
  @ApiResponse({ status: 200, description: 'The book has been successfully deleted.' })
  remove(@Param('id') id: number): Promise<void> {
    return this.booksService.remove(id);
  }
}
