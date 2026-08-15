import type { BookProps } from '../domain/book';
import {
  DuplicateBookError,
  ReadingListService,
  type BookIdGenerator,
  type BookRepository,
} from './reading-list.service';

class InMemoryBookRepository implements BookRepository {
  public readonly saved: BookProps[] = [];

  public async findByTitle(title: string): Promise<BookProps | undefined> {
    return this.saved.find((book) => book.title === title);
  }

  public async save(book: BookProps): Promise<void> {
    this.saved.push(book);
  }

  public async findAll(): Promise<readonly BookProps[]> {
    return this.saved;
  }
}

class FixedBookIdGenerator implements BookIdGenerator {
  public next(): string {
    return 'book-1';
  }
}

describe('ReadingListService', () => {
  let repository: InMemoryBookRepository;
  let service: ReadingListService;

  beforeEach(() => {
    repository = new InMemoryBookRepository();
    service = new ReadingListService(repository, new FixedBookIdGenerator());
  });

  it('本を未読として登録し、正規化済みの値を保存する', async () => {
    await expect(
      service.add({ title: '  テスト駆動開発  ', author: '  Kent Beck  ' }),
    ).resolves.toEqual({
      id: 'book-1',
      title: 'テスト駆動開発',
      author: 'Kent Beck',
      status: 'unread',
    });

    expect(repository.saved).toHaveLength(1);
  });

  it('同じタイトルの本は保存せずに拒否する', async () => {
    await service.add({ title: 'テスト駆動開発', author: 'Kent Beck' });

    await expect(
      service.add({ title: 'テスト駆動開発', author: '別の著者' }),
    ).rejects.toThrow(DuplicateBookError);

    expect(repository.saved).toHaveLength(1);
  });

  it('登録順に読書リストを返す', async () => {
    await service.add({ title: 'テスト駆動開発', author: 'Kent Beck' });

    await expect(service.list()).resolves.toEqual([
      {
        id: 'book-1',
        title: 'テスト駆動開発',
        author: 'Kent Beck',
        status: 'unread',
      },
    ]);
  });
});
