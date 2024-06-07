import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Member } from './member.entity';
import { Book } from '../books/book.entity';

@Entity()
export class BorrowedBook {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Member, member => member.borrowedBooks)
  member: Member;

  @ManyToOne(() => Book)
  book: Book;

  @Column({ type: 'timestamp' })
  borrowDate: Date;

  @Column({ type: 'timestamp', nullable: true })
  returnDate: Date;
}