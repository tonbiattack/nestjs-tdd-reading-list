import { Module } from '@nestjs/common';

import {
  BOOK_ID_GENERATOR,
  BOOK_REPOSITORY,
  ReadingListService,
} from './application/reading-list.service';
import { InMemoryBookRepository } from './infrastructure/in-memory-book.repository';
import { RandomBookIdGenerator } from './infrastructure/random-book-id.generator';
import { ReadingListController } from './presentation/reading-list.controller';

@Module({
  controllers: [ReadingListController],
  providers: [
    ReadingListService,
    { provide: BOOK_REPOSITORY, useClass: InMemoryBookRepository },
    { provide: BOOK_ID_GENERATOR, useClass: RandomBookIdGenerator },
  ],
})
export class ReadingListModule {}
