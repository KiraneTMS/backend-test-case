/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BorrowRecord } from './entities/borrow-record.entity';
import { Member } from '../members/entities/member.entity';
import { Book } from '../books/entities/book.entity';

@Injectable()
export class BorrowRecordsService {
  constructor(
    @InjectRepository(BorrowRecord)
    private readonly borrowRecordRepository: Repository<BorrowRecord>,
    @InjectRepository(Member)
    private readonly memberRepository: Repository<Member>,
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,
  ) {}

  async borrowBook(memberId: number, bookCode: string): Promise<BorrowRecord> {
    // Find the member by ID
    const member = await this.memberRepository.findOne({ where: { id: memberId } });
    if (!member) {
      throw new NotFoundException(`Member with ID ${memberId} not found.`);
    }
  
    // Log member details for debugging (optional)
    // console.log(`Member found: ${JSON.stringify(member)}`);
  
    // Check if the member is penalized and the penalty period has not ended
    const currentDate = new Date();
    const penaltyEndDate = new Date(member.penaltyEndDate); // Convert to Date object
  
    // Log penalty and current dates for debugging (optional)
    // console.log(`Penalty Date found: ${penaltyEndDate} and Current Date found: ${currentDate}`);
  
    if (penaltyEndDate && currentDate < penaltyEndDate) {
      throw new BadRequestException(`Member with ID ${memberId} is currently penalized until ${penaltyEndDate.toISOString()}.`);
    }
  
    // Find the book by code
    const book = await this.bookRepository.findOne({ where: { code: bookCode } });
    if (!book) {
      throw new NotFoundException(`Book with code ${bookCode} not found.`);
    }
  
    // Check if the book is in stock
    if (book.stock <= 0) {
      throw new BadRequestException(`Book with code ${bookCode} is out of stock.`);
    }
  
    // Check if the member has already borrowed 2 books
    const borrowedBooksCount = await this.borrowRecordRepository.count({
      where: { member, isReturned: false },
    });
    if (borrowedBooksCount >= 2) {
      throw new BadRequestException(`Member with ID ${memberId} has already borrowed 2 books.`);
    }
  
    // Create a new borrow record
    const borrowRecord = new BorrowRecord();
    borrowRecord.member = member;
    borrowRecord.book = book;
  
    // Decrement the book stock
    await this.bookRepository.decrement({ id: book.id }, 'stock', 1);
  
    // Update member's borrowed book count (NEW)
    member.borrowedBooksCount += 1;
    await this.memberRepository.save(member); // Save updated member data
  
    // Save the borrow record
    return this.borrowRecordRepository.save(borrowRecord);
  }  
  
  

  async returnBook(memberId: number, bookId: number): Promise<BorrowRecord> {
    try {
      // Find the borrow record
      const borrowRecord = await this.borrowRecordRepository.findOne({
        where: { member: { id: memberId }, book: { id: bookId }, isReturned: false },
        relations: ['book'],
      });
  
      // Check if the borrow record exists
      if (!borrowRecord) {
        throw new NotFoundException(`No active borrow record found for Member ID ${memberId} and Book ID ${bookId}.`);
      }
  
      // Update the borrow record
      borrowRecord.returnDate = new Date();
      borrowRecord.isReturned = true;
  
      // Calculate the number of borrowed days
      const borrowedDays = Math.ceil(
        (borrowRecord.returnDate.getTime() - borrowRecord.borrowDate.getTime()) / (1000 * 60 * 60 * 24)
      );
  
      // If the borrowed days exceed 7, update the member's penalty end date
      if (borrowedDays >= 0) {
        const member = await this.memberRepository.findOne({ where: { id: memberId } });
  
        // Check if the member exists
        if (!member) {
          throw new NotFoundException(`Member with ID ${memberId} not found.`);
        }
  
        const penaltyEndDate = new Date();
        penaltyEndDate.setDate(penaltyEndDate.getDate() + 3); // 3 days penalty
        member.penaltyEndDate = penaltyEndDate;
        await this.memberRepository.save(member);
      }
  
      // Increment the book stock
      await this.bookRepository.increment({ id: borrowRecord.book.id }, 'stock', 1);
      // Save the updated borrow record
      await this.borrowRecordRepository.save(borrowRecord);
  
      return borrowRecord;
    } catch (error) {
      console.error(`Error returning book: ${error.message}`);
      throw error;
    }
  }
  
//   async getBorrowedBooksCount(memberId: number): Promise<number> {
//   const borrowedBooksCount = await this.borrowRecordRepository.count({
//     where: { member: { id: memberId }, isReturned: false },
//   });
//   return borrowedBooksCount;
// }

}
