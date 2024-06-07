// src/members/members.controller.ts
import { Controller, Get, Param, Post,Patch, Body,HttpException,ConflictException,Query } from '@nestjs/common';
import { MembersService } from './members.service';
import { Member } from './member.entity';
import { MemberDto } from './dto/member.dto';
import { BorrowDto } from './dto/borrow.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam,ApiQuery, ApiBody } from '@nestjs/swagger';

@Controller('members')
@ApiTags('members')
export class MembersController {
  constructor(private readonly membersService: MembersService) {}

  @Get()
  findAll() {
    return this.membersService.findAllWithBorrowedBooksCount();
  }
  
  @Post()
  @ApiOperation({ summary: 'Create a new member' })
  @ApiResponse({ status: 201, description: 'The member has been successfully created.' })
  @ApiBody({
    type: MemberDto,
    description: 'Member data',
    examples: {
      'example1': {
        value: {
          code: "M001",
          name: "Angga"
        }
      }
    }
  })
  async create(@Body() memberDto: MemberDto): Promise<Member> {
    try {
      return await this.membersService.create(memberDto);
    } catch (error) {
      if (error instanceof ConflictException) {
        throw new HttpException(error.message, 409); // Conflict
      }
      throw error;
    }
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a member' })
  @ApiResponse({ status: 200, description: 'The member has been successfully updated.' })
  @ApiParam({ name: 'id', description: 'Member ID' })
  @ApiBody({ type: MemberDto, description: 'Member data' })
  async update(@Param('id') id: number, @Body() memberDto: MemberDto): Promise<Member> {
    return await this.membersService.update(id, memberDto);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.membersService.findOne(id);
  }

  @Post('/borrow')
  @ApiOperation({ summary: 'Borrow a book by member ID and book ID' })
  @ApiResponse({ status: 200, description: 'Book successfully borrowed' })
  @ApiResponse({ status: 404, description: 'Member or book not found' })
  @ApiBody({
    type: BorrowDto,
    description: 'Borrow book',
    examples: {
      'example1': {
        value: {
          memberId: 1,
          bookId: 7
        }
      }
    }
  })
  async borrowBook(@Body() createborrowDto: BorrowDto) {
    try {
      await this.membersService.borrowBook(createborrowDto)
      return "Borrow a book success";
    } catch (error) {
      throw new HttpException(error.message, 201);
    }
  }

  @Post('/return')
  @ApiOperation({ summary: 'Return a book by member ID and book ID' })
  @ApiBody({
    type: BorrowDto,
    description: 'Return book',
    examples: {
      'example1': {
        value: {
          memberId: 1,
          bookId: 7
        }
      }
    }
  })
  async returnBook(@Body() createborrowDto: BorrowDto) {
    try {
      await this.membersService.returnBook(createborrowDto);
      return "Return a book success";
    } catch (error) {
      throw new HttpException(error.message, 201);
    }
  }
}
