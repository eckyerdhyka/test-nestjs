// src/members/dto/member.dto.ts
import { IsString } from 'class-validator';

export class MemberDto {
  @IsString()
  code: string;

  @IsString()
  name: string;
}
