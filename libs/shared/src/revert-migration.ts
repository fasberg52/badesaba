import { datasource } from './config';

datasource
  .initialize()
  .then(async () => {
    console.log('datasource initialized');
    await datasource.undoLastMigration();
    console.log('migrations reverted!');
  })

  .catch((error) => console.error('error during revert migrations >> ', error));
