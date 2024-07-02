/* eslint-disable prettier/prettier */
import { DataSource } from 'typeorm';
import { Book } from './books/entities/book.entity';
import { Member } from './members/entities/member.entity';
import { BorrowRecord } from './borrow-records/entities/borrow-record.entity';
import { SeedBooksAndMembers1719882383566 } from './migration/1719882383566-SeedBooksAndMembers';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'arsyaalifian2018',
  database: 'library-management',
  entities: [Book, Member, BorrowRecord],
  migrations: [SeedBooksAndMembers1719882383566],
  synchronize: false,
});
