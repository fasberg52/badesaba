import { MigrationInterface, QueryRunner, TableIndex } from 'typeorm';

export class CreateIndexUserIdSocres1738220925546
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createIndex(
      'score.scores',
      new TableIndex({
        name: 'IDX_SCORE_USER_ID',
        columnNames: ['userId'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex('score.scores', 'IDX_SCORE_USER_ID');
  }
}
