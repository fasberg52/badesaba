import { MigrationInterface, QueryRunner } from 'typeorm';

export class InsertPrizes1738249853148 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
          INSERT INTO spinner.prizes (name, type, weight)
          VALUES 
            ('کد تخفیف ۲۰ درصدی خرید اشتراک حبل المتین', 'DISCOUNT', 1),
            ('کد تخفیف ۵۰ درصدی خرید اشتراک حبل المتین', 'DISCOUNT', 0.8),
            ('شانس شرکت در قرعه کشی آخر ماه', 'CHANCE', 2.5),
            ('۳ شانس شرکت در قرعه کشی آخر ماه', 'CHANCE', 1.5),
            ('مبلغ ۲ میلیون تومان جایزه نقدی', 'MONEY', 0.2),
            ('کد تخفیف ۳۰ درصدی خرید از دیجیکالا', 'DISCOUNT', 1.5),
            ('کد تخفیف ۳۰ درصدی خرید از طلاسی', 'DISCOUNT', 1.5);
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
          DELETE FROM prizes WHERE name IN (
            'کد تخفیف ۲۰ درصدی خرید اشتراک حبل المتین',
            'کد تخفیف ۵۰ درصدی خرید اشتراک حبل المتین',
            'شانس شرکت در قرعه کشی آخر ماه',
            '۳ شانس شرکت در قرعه کشی آخر ماه',
            'مبلغ ۲ میلیون تومان جایزه نقدی',
            'کد تخفیف ۳۰ درصدی خرید از دیجیکالا',
            'کد تخفیف ۳۰ درصدی خرید از طلاسی'
          );
        `);
  }
}
