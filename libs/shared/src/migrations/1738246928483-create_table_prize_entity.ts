import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';
import { PrizeTypeEnum } from '../enums/prize.enum';

export class CreateTablePrizeEntity1738246928483 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createSchema('spinner', true);
    await queryRunner.createTable(
      new Table({
        schema: 'spinner',
        name: 'prizes',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          { name: 'name', type: 'varchar', length: '255', isNullable: false },
          {
            name: 'type',
            type: 'enum',
            enum: Object.values(PrizeTypeEnum),
            isNullable: false,
          },
          { name: 'weight', type: 'float', isNullable: false },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP',
          },
          { name: 'deleted_at', type: 'timestamp', isNullable: true },
        ],
      }),
      true,
    );

    await queryRunner.createTable(
      new Table({
        name: 'user_prizes',
        schema: 'spinner',
        columns: [
          { name: 'userId', type: 'int', isPrimary: true },
          { name: 'prizeId', type: 'int', isPrimary: true },
          { name: 'wonAt', type: 'timestamp', default: 'CURRENT_TIMESTAMP' },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKeys('spinner.user_prizes', [
      new TableForeignKey({
        columnNames: ['userId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'user.users',
        onDelete: 'CASCADE',
      }),
      new TableForeignKey({
        columnNames: ['prizeId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'spinner.prizes',
        onDelete: 'CASCADE',
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('user_prizes');
    await queryRunner.dropTable('prizes');
  }
}
