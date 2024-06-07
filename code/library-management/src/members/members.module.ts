// src/members/members.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MembersService } from './members.service';
import { MembersController } from './members.controller';
import { Member } from './member.entity';
import { BorrowedBook } from './borrowed-book.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Member, BorrowedBook])],
  providers: [MembersService],
  controllers: [MembersController],
})
export class MembersModule {}
