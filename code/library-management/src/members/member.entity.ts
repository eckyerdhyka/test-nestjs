// src/members/member.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { BorrowedBook } from './borrowed-book.entity';

@Entity()
export class Member {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  code: string;

  @Column()
  name: string;

  @Column({ default: false })
  isPenalized: boolean;

  @Column({ type: 'timestamp', nullable: true })
  penaltyEndDate: Date;

  @OneToMany(() => BorrowedBook, borrowedBook => borrowedBook.member)
  borrowedBooks: BorrowedBook[];
}