import { Body, Controller, Get, HttpCode, HttpStatus, Post } from '@nestjs/common';

import {
  ReadingListService,
  type AddBookInput,
} from '../application/reading-list.service';
import type { BookProps } from '../domain/book';

@Controller('books')
export class ReadingListController {
  public constructor(private readonly readingListService: ReadingListService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  public create(@Body() input: AddBookInput): Promise<BookProps> {
    return this.readingListService.add(input);
  }

  @Get()
  public findAll(): Promise<readonly BookProps[]> {
    return this.readingListService.list();
  }
}
