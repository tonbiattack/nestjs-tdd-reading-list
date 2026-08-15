import { Inject, Injectable } from '@nestjs/common';

import { Book, type BookProps } from '../domain/book';

export const BOOK_REPOSITORY = Symbol('BOOK_REPOSITORY');
export const BOOK_ID_GENERATOR = Symbol('BOOK_ID_GENERATOR');

export interface BookRepository {
  findByTitle(title: string): Promise<BookProps | undefined>;
  save(book: BookProps): Promise<void>;
  findAll(): Promise<readonly BookProps[]>;
}

export interface BookIdGenerator {
  next(): string;
}

export interface AddBookInput {
  readonly title: string;
  readonly author: string;
}

export class DuplicateBookError extends Error {
  public constructor(title: string) {
    super(`「${title}」は既に読書リストに登録されています。`);
    this.name = 'DuplicateBookError';
  }
}

@Injectable()
export class ReadingListService {
  public constructor(
    @Inject(BOOK_REPOSITORY) private readonly repository: BookRepository,
    @Inject(BOOK_ID_GENERATOR) private readonly idGenerator: BookIdGenerator,
  ) {}

  public async add(input: AddBookInput): Promise<BookProps> {
    const book = Book.create({
      id: this.idGenerator.next(),
      title: input.title,
      author: input.author,
    });
    const duplicate = await this.repository.findByTitle(book.title);

    if (duplicate !== undefined) {
      throw new DuplicateBookError(book.title);
    }

    await this.repository.save(book);
    return book;
  }

  public async list(): Promise<readonly BookProps[]> {
    return this.repository.findAll();
  }
}
