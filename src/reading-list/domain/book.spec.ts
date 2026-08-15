import { Book, InvalidBookTitleError } from './book';

describe('Book', () => {
  it('タイトルと著者名の前後空白を除去して未読の本を作る', () => {
    const book = Book.create({
      id: 'book-1',
      title: '  テスト駆動開発  ',
      author: '  Kent Beck  ',
    });

    expect(book).toEqual({
      id: 'book-1',
      title: 'テスト駆動開発',
      author: 'Kent Beck',
      status: 'unread',
    });
  });

  it.each(['', '   '])('空白だけのタイトルを拒否する: %j', (title) => {
    expect(() =>
      Book.create({ id: 'book-1', title, author: 'Kent Beck' }),
    ).toThrow(InvalidBookTitleError);
  });
});
