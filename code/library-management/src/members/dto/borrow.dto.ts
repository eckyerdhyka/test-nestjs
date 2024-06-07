// borrow.dto.ts
import { IsInt } from 'class-validator';

export class BorrowDto {
  @IsInt()
  memberId: number;

  @IsInt()
  bookId: number;
}
