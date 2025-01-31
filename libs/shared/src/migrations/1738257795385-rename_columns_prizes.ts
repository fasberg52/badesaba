import { MigrationInterface, QueryRunner } from 'typeorm';

export class RenameColumnsPrizes1738257795385 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.renameColumn('spinner.prizes', 'created_at', 'createdAt');
    await queryRunner.renameColumn('spinner.prizes', 'updated_at', 'updatedAt');
    await queryRunner.renameColumn('spinner.prizes', 'deleted_at', 'deletedAt');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
