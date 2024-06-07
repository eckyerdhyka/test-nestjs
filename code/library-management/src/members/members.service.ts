import { Injectable,ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Member } from './member.entity';
import { BorrowedBook } from './borrowed-book.entity';
import { Book } from '../books/book.entity';
import { MemberDto } from './dto/member.dto';
import { BorrowDto } from './dto/borrow.dto';

@Injectable()
export class MembersService {
  constructor(
    @InjectRepository(Member)
    private membersRepository: Repository<Member>,
    @InjectRepository(BorrowedBook)
    private borrowedBooksRepository: Repository<BorrowedBook>,
  ) {}

  async findAllWithBorrowedBooksCount(): Promise<{ id: number; code: string;name: string; borrowedBooksCount: number }[]> {
    return await this.membersRepository
    .createQueryBuilder('member')
    .leftJoin('member.borrowedBooks', 'borrowedBook', 'borrowedBook.returnDate IS NULL')
    .select('member.id', 'id')
    .addSelect('member.code', 'code')
    .addSelect('member.name', 'name')
    .addSelect('COUNT(borrowedBook.id)', 'borrowedBooksCount')
    .groupBy('member.id')
    .getRawMany();
  }

  findOne(id: number): Promise<Member> {
    return this.membersRepository.findOne({ where: { id }, relations: ['borrowedBooks'] });
  }


  async create(memberDto: MemberDto): Promise<Member> {
    const existingMember = await this.membersRepository.findOne({ where: { code: memberDto.code } });
    if (existingMember) {
      throw new ConflictException('Member with the same code already exists');
    }
    const member = new Member();
    member.code = memberDto.code;
    member.name = memberDto.name;
    return await this.membersRepository.save(member);
  }

  async update(id: number, memberDto: MemberDto): Promise<Member> {
    const member = await this.membersRepository.findOne({ where: { id }});
    if (!member) {
      return null; // Or throw an exception
    }
    member.code = memberDto.code;
    member.name = memberDto.name;
    return await this.membersRepository.save(member);
  }

  async borrowBook(createborrowDto: BorrowDto): Promise<void> {
    const member = await this.membersRepository.findOne({ where: { id: createborrowDto.memberId }, relations: ['borrowedBooks'] });
    const book = await this.borrowedBooksRepository.manager.findOne(Book, { where: { id: createborrowDto.bookId } });

    if (!member) {
      throw new Error('Cannot borrow book,Member not find.');
    }

    if (!book) {
      throw new Error('Cannot borrow book,Book not find.');
    }

    if (book.stock < 1) {
      throw new Error('Cannot borrow book,Book stock empty.');
    }

    if (member.isPenalized) {
      throw new Error('Cannot borrow book,Member is penalized.');
    }

    const borrowedBooksToReturn = member.borrowedBooks.filter(borrowedBook => borrowedBook.returnDate === null);
    if (borrowedBooksToReturn.length >= 2 ) {
      throw new Error('Cannot borrow book,member already take 2 book');
    }

    const  memberId = createborrowDto.memberId;
    const  bookId = createborrowDto.bookId;
    const activeBorrowing = await this.borrowedBooksRepository
      .createQueryBuilder('borrowedBook')
      .leftJoinAndSelect('borrowedBook.member', 'member')
      .leftJoinAndSelect('borrowedBook.book', 'book')
      .where('book.id = :bookId', { bookId })
      .andWhere('returnDate IS NULL')
      .getOne();
      
    if (activeBorrowing) {
      throw new Error('Cannot borrow book,book already take by other member');
    }

    const borrowedBook = new BorrowedBook();
    borrowedBook.book = book;
    borrowedBook.member = member;
    borrowedBook.borrowDate = new Date();

    book.stock -= 1;

    await this.borrowedBooksRepository.save(borrowedBook);
    await this.borrowedBooksRepository.manager.save(book);
  }

  async returnBook(createborrowDto: BorrowDto): Promise<void> {
    const member = await this.membersRepository.findOne({ where: { id:createborrowDto.memberId }, relations: ['borrowedBooks'] });
    // const borrowedBook = await this.borrowedBooksRepository.findBy({ where: { member: { id: memberId }, book: { id: bookId }, returnDate: null } });
    const  memberId = createborrowDto.memberId;
    const  bookId = createborrowDto.bookId;
    const borrowedBook = await this.borrowedBooksRepository
      .createQueryBuilder('borrowedBook')
      .leftJoinAndSelect('borrowedBook.member', 'member')
      .leftJoinAndSelect('borrowedBook.book', 'book')
      .where('member.id = :memberId', { memberId })
      .andWhere('book.id = :bookId', { bookId })
      .andWhere('returnDate IS NULL')
      .getOne();

    if (!borrowedBook) {
      throw new Error('Book not borrowed by this member or Book already returned');
    }

    borrowedBook.returnDate = new Date();

    const book = await this.borrowedBooksRepository.manager.findOne(Book, { where: { id: bookId } });
    book.stock += 1;

    const borrowDuration = Math.ceil((borrowedBook.returnDate.getTime() - borrowedBook.borrowDate.getTime()) / (1000 * 3600 * 24));
    if (borrowDuration > 7) {
      member.isPenalized = true;
      member.penaltyEndDate = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000); // 3 days penalty
    }

    await this.borrowedBooksRepository.save(borrowedBook);
    await this.borrowedBooksRepository.manager.save(book);
    await this.membersRepository.save(member);
  }
}
