import { Injectable } from '@nestjs/common';

import type { BookRepository } from '../application/reading-list.service';
import type { BookProps } from '../domain/book';

@Injectable()
export class InMemoryBookRepository implements BookRepository {
  private readonly books: BookProps[] = [];

  public async findByTitle(title: string): Promise<BookProps | undefined> {
    return this.books.find((book) => book.title === title);
  }

  public async save(book: BookProps): Promise<void> {
    this.books.push(book);
  }

  public async findAll(): Promise<readonly BookProps[]> {
    return [...this.books];
  }
}
