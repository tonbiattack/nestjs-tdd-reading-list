# 4. E2EテストでHTTPワークフローを確認する

## 目的

最後に、実際のNestアプリケーションをテスト内で起動し、`POST /books`と`GET /books`が連続して動くことを確認します。このテストは、ルーティング、JSONボディの変換、HTTPステータス、モジュールの配線をまとめて守ります。ドメインの細かな境界値をE2Eで網羅するためではありません。

## 最初のテスト

`AppModule`、`ReadingListModule`、インフラ実装を隠して、次を実行します。

```bash
npm run test:e2e
```

最初は`AppModule`が見つからずに失敗します。次に`ReadingListModule`を追加しても、DIトークンと実装が結線されていなければアプリケーションの起動時に失敗します。失敗の種類が、必要な構成要素を一つずつ示します。

```ts
const moduleRef = await Test.createTestingModule({
  imports: [AppModule],
}).compile();

app = moduleRef.createNestApplication();
await app.init();
```

続いてSupertestから本を登録し、同じサーバーへ一覧取得を要求します。

```ts
const created = await request(app.getHttpServer())
  .post('/books')
  .send({ title: 'テスト駆動開発', author: 'Kent Beck' })
  .expect(201);

await request(app.getHttpServer())
  .get('/books')
  .expect(200)
  .expect([created.body]);
```

## Greenにする

`ReadingListModule`でコントローラ、サービス、二つの契約トークンを結線します。NestJSのE2Eテストでは、`createNestApplication()`でHTTPサーバーを作り、Supertestでリクエストを送ります。[1] 完成実装は次のファイルに分かれています。

| パス | 役割 |
|---|---|
| `src/app.module.ts` | アプリケーションの入口モジュール |
| `src/reading-list/reading-list.module.ts` | コントローラ、サービス、実装を結線するモジュール |
| `src/reading-list/infrastructure/in-memory-book.repository.ts` | 学習用の保存アダプタ |
| `src/reading-list/infrastructure/random-book-id.generator.ts` | UUIDを発行するアダプタ |
| `test/reading-list.e2e-spec.ts` | HTTPの一連の振る舞い |

## 次の一歩

次の練習では、重複登録がどのHTTPステータスとJSONを返すべきかを決めます。サービスの`DuplicateBookError`をHTTP例外へ変換する例外フィルタを追加し、先にE2Eテストで409の契約を書いてください。並行した二重登録を扱う場合は、インメモリ実装ではなくDBの一意制約と統合テストが必要です。

## 確認

```bash
npm run test:e2e
```

## 参考資料

[1] [NestJS Documentation: Testing](https://docs.nestjs.com/fundamentals/testing)
