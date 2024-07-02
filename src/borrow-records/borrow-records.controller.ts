/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { BorrowRecordsService } from './borrow-records.service';
import { BorrowRecord } from './entities/borrow-record.entity';

@ApiTags('Borrow Records')
@Controller('borrow-records')
export class BorrowRecordsController {
  constructor(
    private readonly borrowRecordsService: BorrowRecordsService
  ) {}

  // @ApiOperation({ summary: 'Get a member\'s details including borrowed book count' })
  // @ApiParam({ name: 'memberId', description: 'ID of the member' })
  // @ApiResponse({ status: 200, description: 'Member details with borrowed book count', type: Member })
  // @ApiResponse({ status: 404, description: 'Member not found' })
  // @Get('members/:memberId')
  // async getMemberDetailsWithBorrowedCount(@Param('memberId') memberId: number): Promise<Member> {
  //   const member = await this.membersService.findOne(memberId);

  //   const borrowedBooksCount = await this.borrowRecordsService.getBorrowedBooksCount(member.id);
  //   member.borrowedBooksCount = borrowedBooksCount;

  //   return member;
  // }

  @ApiOperation({ summary: 'Borrow a book for a member' })
  @ApiParam({ name: 'memberId', description: 'Member ID' })
  @ApiParam({ name: 'bookCode', description: 'Book code' })
  @ApiResponse({ status: 201, description: 'Successfully borrowed the book', type: BorrowRecord })
  @ApiResponse({ status: 404, description: 'Member or book not found' })
  @Post(':memberId/:bookCode')
  async borrowBook(@Param('memberId') memberId: number, @Param('bookCode') bookCode: string): Promise<BorrowRecord> {
    return this.borrowRecordsService.borrowBook(memberId, bookCode);
  }

  @ApiOperation({ summary: 'Return a borrowed book' })
  @ApiParam({ name: 'memberId', description: 'Member ID' })
  @ApiParam({ name: 'bookId', description: 'Book ID' })
  @ApiResponse({ status: 200, description: 'Successfully returned the book', type: BorrowRecord })
  @ApiResponse({ status: 404, description: 'Borrow record not found' })
  @Put(':memberId/:bookId')
  async returnBook(@Param('memberId') memberId: number, @Param('bookId') bookId: number): Promise<BorrowRecord> {
    return this.borrowRecordsService.returnBook(memberId, bookId);
  }
  
}