/* eslint-disable prettier/prettier */
import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedBooksAndMembers1719882383566 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      INSERT INTO book (code, title, author, stock) VALUES 
      ('JK-45', 'Harry Potter', 'J.K Rowling', 1),
      ('SHR-1', 'A Study in Scarlet', 'Arthur Conan Doyle', 1),
      ('TW-11', 'Twilight', 'Stephenie Meyer', 1),
      ('HOB-83', 'The Hobbit, or There and Back Again', 'J.R.R. Tolkien', 1),
      ('NRN-7', 'The Lion, the Witch and the Wardrobe', 'C.S. Lewis', 1);
    `);

    await queryRunner.query(`
      INSERT INTO member (code, name, "penaltyEndDate") VALUES 
      ('M001', 'Angga', '0001-01-01'),
      ('M002', 'Ferry', '0001-01-01'),
      ('M003', 'Putri', '0001-01-01');
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DELETE FROM book WHERE code IN ('JK-45', 'SHR-1', 'TW-11', 'HOB-83', 'NRN-7');`,
    );
    await queryRunner.query(
      `DELETE FROM member WHERE code IN ('M001', 'M002', 'M003');`,
    );
  }
}