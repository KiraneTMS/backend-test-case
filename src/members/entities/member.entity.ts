import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { BorrowRecord } from '../../borrow-records/entities/borrow-record.entity';

@Entity()
export class Member {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  code: string;

  @Column()
  name: string;

  @Column({ type: 'date', default: '0001-01-01' })
  penaltyEndDate: Date;

  @OneToMany(() => BorrowRecord, (borrowRecord) => borrowRecord.member)
  borrowRecords: BorrowRecord[];

  @Column({ default: 0 }) // Initialize with 0 borrowed books
  borrowedBooksCount: number;
  // borrowedBooksCount: number;
}
