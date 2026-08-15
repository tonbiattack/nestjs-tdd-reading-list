# 2. 読書リストのユースケース

## 目的

この章では、本を保存するユースケースを作ります。サービスがUUIDを直接生成し、DBへ直接接続すると、テストがランダム値と外部資源に依存します。そこで、ID発行と保存を小さな契約として受け取ります。NestJSのDIは、アプリケーションを組み立てるときに実装を結線するために使います。ユースケース自体のテストでは、まずコンストラクタへ手書きフェイクを渡します。

## 最初のテスト

完成実装の `reading-list.service.ts` を隠して、次を実行します。

```bash
npm run test:unit -- reading-list.service.spec.ts
```

テストでは、配列に保存内容を記録する`InMemoryBookRepository`と、常に`book-1`を返す`FixedBookIdGenerator`を用意します。最初の要求は、本を未読で保存し、正規化済みの本を返すことです。

```ts
const repository = new InMemoryBookRepository();
const service = new ReadingListService(repository, new FixedBookIdGenerator());

await expect(
  service.add({ title: '  テスト駆動開発  ', author: '  Kent Beck  ' }),
).resolves.toEqual({
  id: 'book-1',
  title: 'テスト駆動開発',
  author: 'Kent Beck',
  status: 'unread',
});
```

## Greenにする

`ReadingListService.add()`は、`Book.create()`で入力をドメインへ渡し、同じタイトルが存在するかを確認してから保存します。完成実装は [`src/reading-list/application/reading-list.service.ts`](../src/reading-list/application/reading-list.service.ts) です。

| 契約 | ユースケースが必要とすること | テストのフェイク | Nestで結線する実装 |
|---|---|---|---|
| `BookRepository` | タイトル検索、保存、一覧取得 | 配列へ保存するクラス | `InMemoryBookRepository` |
| `BookIdGenerator` | 次のIDを一つ返す | 固定値を返すクラス | `RandomBookIdGenerator` |

TypeScriptのinterfaceは実行時には存在しません。そのためNestで実装を注入するときは、`BOOK_REPOSITORY`と`BOOK_ID_GENERATOR`という`Symbol`トークンを使います。テストで直接コンストラクタを呼ぶことと、アプリケーションでトークンを使うことは矛盾しません。前者は狭い振る舞い、後者は配線を確認する役割です。

## 次の一歩

現在のテストは同じタイトルの登録を拒否し、保存件数が増えないことを確認します。次の練習では、タイトルを大文字・小文字を区別せず比較するか、著者まで含めて重複とするかを仕様として決め、先にテストで表現してください。

## 確認

```bash
npm run test:unit -- reading-list.service.spec.ts
```
