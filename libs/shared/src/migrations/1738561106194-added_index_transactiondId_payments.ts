import { MigrationInterface, QueryRunner, TableIndex } from 'typeorm';

export class AddedIndexTransactiondIdPayments1738561106194
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createIndex(
      'payment.payments',
      new TableIndex({
        name: 'IDX_TRANSACTION_ID',
        columnNames: ['transactionId'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex('payment.payments', 'IDX_TRANSACTION_ID');
  }
}
