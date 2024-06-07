// src/books/dto/create-book.dto.ts
import { IsString, IsInt, Min } from 'class-validator';

export class CreateBookDto {
  @IsString()
  readonly code: string;

  @IsString()
  readonly title: string;

  @IsString()
  readonly author: string;

  @IsInt()
  @Min(1)
  readonly stock: number;
}
