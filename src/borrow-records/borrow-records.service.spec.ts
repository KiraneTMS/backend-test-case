/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { BorrowRecordsService } from './borrow-records.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BorrowRecord } from './entities/borrow-record.entity';
import { Member } from '../members/entities/member.entity';
import { Book } from '../books/entities/book.entity';
import { Repository } from 'typeorm';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('BorrowRecordsService', () => {
  let service: BorrowRecordsService;
  let borrowRecordRepository: Repository<BorrowRecord>;
  let memberRepository: Repository<Member>;
  let bookRepository: Repository<Book>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BorrowRecordsService,
        {
          provide: getRepositoryToken(BorrowRecord),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Member),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Book),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<BorrowRecordsService>(BorrowRecordsService);
    borrowRecordRepository = module.get<Repository<BorrowRecord>>(getRepositoryToken(BorrowRecord));
    memberRepository = module.get<Repository<Member>>(getRepositoryToken(Member));
    bookRepository = module.get<Repository<Book>>(getRepositoryToken(Book));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('borrowBook', () => {
    it('should throw NotFoundException if member does not exist', async () => {
      jest.spyOn(memberRepository, 'findOne').mockResolvedValueOnce(null);

      await expect(service.borrowBook(1, 'SHR-1')).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException if member is penalized', async () => {
      jest.spyOn(memberRepository, 'findOne').mockResolvedValueOnce({
        id: 1,
        code: 'M001',
        name: 'Angga',
        penaltyEndDate: new Date(Date.now() + 1000 * 60 * 60 * 24),
      } as Member);

      await expect(service.borrowBook(1, 'SHR-1')).rejects.toThrow(BadRequestException);
    });

    it('should throw NotFoundException if book does not exist', async () => {
      jest.spyOn(memberRepository, 'findOne').mockResolvedValueOnce({} as Member);
      jest.spyOn(bookRepository, 'findOne').mockResolvedValueOnce(null);

      await expect(service.borrowBook(1, 'SHR-1')).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException if book is out of stock', async () => {
      jest.spyOn(memberRepository, 'findOne').mockResolvedValueOnce({} as Member);
      jest.spyOn(bookRepository, 'findOne').mockResolvedValueOnce({
        stock: 0,
      } as Book);

      await expect(service.borrowBook(1, 'SHR-1')).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if member has already borrowed 2 books', async () => {
      jest.spyOn(memberRepository, 'findOne').mockResolvedValueOnce({} as Member);
      jest.spyOn(bookRepository, 'findOne').mockResolvedValueOnce({
        stock: 1,
      } as Book);
      jest.spyOn(borrowRecordRepository, 'count').mockResolvedValueOnce(2);

      await expect(service.borrowBook(1, 'SHR-1')).rejects.toThrow(BadRequestException);
    });
  });

  describe('returnBook', () => {
    it('should throw NotFoundException if borrow record does not exist', async () => {
      jest.spyOn(borrowRecordRepository, 'findOne').mockResolvedValueOnce(null);

      await expect(service.returnBook(1, 1)).rejects.toThrow(NotFoundException);
    });

  });
});
