import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BooksModule } from './books/books.module';
import { MembersModule } from './members/members.module';
import { BorrowRecordsModule } from './borrow-records/borrow-records.module';
import { Book } from './books/entities/book.entity';
import { Member } from './members/entities/member.entity';
import { BorrowRecord } from './borrow-records/entities/borrow-record.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'arsyaalifian2018',
      database: 'library-management',
      entities: [Book, Member, BorrowRecord],
      synchronize: true,
    }),
    BooksModule,
    MembersModule,
    BorrowRecordsModule,
  ],
})
export class AppModule {}
