# 1. 本のドメイン規則

## 目的

最初の章では、NestJSを起動しません。本のタイトルを正規化し、空白だけのタイトルを拒否する規則を、フレームワークから独立したテストで作ります。HTTPの入力検証だけに規則を置くと、バッチやメッセージ処理などHTTP以外の入口から作られる本に同じ制約を適用できません。まずドメインに規則を置きます。

## 最初のテスト

完成実装の `src/reading-list/domain/book.ts` を一時的に退避してから、次だけを実行します。

```bash
npm run test:unit -- book.spec.ts
```

テストは `Book.create()` が本を作れることを要求します。実装を隠していれば、最初は `Cannot find module './book'` で失敗します。このコンパイルエラーは、まだAPIが存在しないという有効なRedです。

```ts
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
```

## Greenにする

最小実装は、タイトルを`trim()`し、空文字列なら専用例外を送出し、`unread`を設定することです。完成実装は [`src/reading-list/domain/book.ts`](../src/reading-list/domain/book.ts) にあります。

```ts
const title = props.title.trim();
if (title.length === 0) {
  throw new InvalidBookTitleError();
}
```

この段階では、DB、UUID、コントローラを追加しません。テストの失敗を通すために不要なコードを増やすと、どの設計判断を学んでいるかが見えにくくなります。

## 次の一歩

正常系がGreenになったら、空文字列と空白だけの文字列を`test.each`で追加します。次の練習として、著者名の必須化や最大文字数を追加できます。ただし、規則を増やす前に、まずその規則を示すテストを一つ書きます。

## 確認

```bash
npm run test:unit -- book.spec.ts
```
