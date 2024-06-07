import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { BorrowedBook } from '../members/borrowed-book.entity';
@Entity()
export class Book {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  code: string;

  @Column()
  title: string;

  @Column()
  author: string;

  @Column()
  stock: number;

  @OneToMany(() => BorrowedBook, borrowing => borrowing.book)
  borrowings: BorrowedBook[];
}