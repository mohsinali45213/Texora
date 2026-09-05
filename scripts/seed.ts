import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { SeedRunner } from './seed/SeedRunner';

const isReset = process.argv.includes('--reset');

const runner = new SeedRunner(isReset);

runner.run().catch(err => {
  console.error('❌ Seeder failed:', err);
  process.exit(1);
});
