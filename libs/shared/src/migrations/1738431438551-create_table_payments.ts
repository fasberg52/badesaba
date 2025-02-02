import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';
import { PaymentStatusEnum } from '../enums/payment.enum';

export class CreateTablePayments1738431438551 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createSchema('payment', true);
    await queryRunner.createTable(
      new Table({
        name: 'payments',
        schema: 'payment',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'amount',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'userId',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'status',
            type: 'enum',
            enum: Object.values(PaymentStatusEnum),
            isNullable: false,
          },
          {
            name: 'transactionId',
            type: 'varchar',
            length: '255',
            isUnique: true,
            isNullable: false,
          },

          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      'payment.payments',
      new TableForeignKey({
        columnNames: ['userId'],
        referencedTableName: 'user.users',
        referencedColumnNames: ['id'],
        onDelete: 'SET NULL',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('payment.payments', true, true, true);
    await queryRunner.dropSchema('payment', true, true);
  }
}
