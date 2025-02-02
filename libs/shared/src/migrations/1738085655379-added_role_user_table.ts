import {
  Column,
  MigrationInterface,
  QueryRunner,
  Table,
  TableColumn,
} from 'typeorm';
import { UserRoleEnum } from '../enums/role.enum';

export class AddedRoleUserTable1738085655379 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const hasColumn = await queryRunner.hasColumn('user.users', 'role');
    if (!hasColumn) {
      await queryRunner.addColumn(
        'user.users',
        new TableColumn({
          name: 'role',
          type: 'enum',
          enum: Object.values(UserRoleEnum),
          isNullable: false,
        }),
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('user.users', 'role');
  }
}
