import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BorrowRecordsService } from './borrow-records.service';
import { BorrowRecordsController } from './borrow-records.controller';
import { BorrowRecord } from './entities/borrow-record.entity';
import { Book } from '../books/entities/book.entity';
import { Member } from '../members/entities/member.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BorrowRecord, Book, Member])],
  providers: [BorrowRecordsService],
  controllers: [BorrowRecordsController],
})
export class BorrowRecordsModule {}
