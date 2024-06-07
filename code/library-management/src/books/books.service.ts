// src/books/books.service.ts
import { Injectable,ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book } from './book.entity';
import { CreateBookDto } from './dto/create-book.dto';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book)
    private booksRepository: Repository<Book>,
  ) {}

  async findAll(): Promise<Book[]> {
    // Fetch all books
    const allBooks = await this.booksRepository.find();

    // Fetch IDs of borrowed books
    const borrowedBooks = await this.booksRepository
      .createQueryBuilder('book')
      .leftJoinAndSelect('book.borrowings', 'borrowing')
      .where('borrowing.bookId IS NOT NULL')
      .andWhere('borrowing.returnDate IS NULL')
      .getMany();

    const borrowedBookIds = borrowedBooks.map(book => book.id);

    // Filter out the borrowed books
    const availableBooks = allBooks.filter(book => !borrowedBookIds.includes(book.id));

    return availableBooks;
  }

  findOne(id: number): Promise<Book> {
    return this.booksRepository.findOne({ where: { id } });
  }

  async create(createBookDto: CreateBookDto): Promise<Book> {
    const existingBook = await this.booksRepository.findOne({ where: { code: createBookDto.code } });
    if (existingBook) {
      throw new ConflictException('Book with the same code already exists');
    }
    const book = new Book();
    book.code = createBookDto.code;
    book.title = createBookDto.title;
    book.author = createBookDto.author;
    book.stock = createBookDto.stock;

    return this.booksRepository.save(book);
  }

  async remove(id: number): Promise<void> {
    await this.booksRepository.delete(id);
  }
}
