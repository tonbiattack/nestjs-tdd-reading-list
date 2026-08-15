import { Module } from '@nestjs/common';

import { ReadingListModule } from './reading-list/reading-list.module';

@Module({
  imports: [ReadingListModule],
})
export class AppModule {}
