import { datasource } from './config';

datasource
  .initialize()
  .then(async () => {
    console.log('datasource initialized');
    await datasource.runMigrations();
    console.log('migrations run successfully');
  })
  .catch((error) => console.error('error during run migrations >> ', error));
