import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class ChangeLengthPassword1738154194663 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      'user.users',
      'password',
      new TableColumn({
        name: 'password', 
        type: 'varchar',
        length: '200', 
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      'user.users',
      'password',
      new TableColumn({
        name: 'password',
        type: 'varchar',
        length: '16', 
      }),
    );
  }
}
