import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { BorrowRecord } from '../../borrow-records/entities/borrow-record.entity';

@Entity()
export class Book {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  code: string;

  @Column()
  title: string;

  @Column()
  author: string;

  @Column()
  stock: number;

  @OneToMany(() => BorrowRecord, (borrowRecord) => borrowRecord.book)
  borrowRecords: BorrowRecord[];
}
