import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableUnique,
} from 'typeorm';

export class CreateReferralTable1738003634518 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createSchema('referral', true);
    await queryRunner.createTable(
      new Table({
        name: 'referrals',
        schema: 'referral',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'referrerId',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'referredId',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'referralDate',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      'referral.referrals',
      new TableForeignKey({
        columnNames: ['referrerId'],
        referencedTableName: 'users',
        referencedSchema: 'user',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'referral.referrals',
      new TableForeignKey({
        columnNames: ['referredId'],
        referencedTableName: 'users',
        referencedSchema: 'user',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createUniqueConstraint(
      'referral.referrals',
      new TableUnique({
        columnNames: ['referrerId', 'referredId'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('referral.referrals', true, true, true);
  }
}
