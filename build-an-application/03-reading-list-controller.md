# 3. TestingModuleでコントローラを検証する

## 目的

ドメイン規則とユースケースができたら、HTTPコントローラを追加します。この章の焦点は、HTTP入力をサービスへ渡し、サービスの結果を返すことです。重複判定やタイトルの正規化をコントローラで再テストしません。責務の異なる失敗を一つのテストへ混ぜないためです。

## 最初のテスト

完成実装の `reading-list.controller.ts` を隠して、次を実行します。

```bash
npm run test:unit -- reading-list.controller.spec.ts
```

NestJSの`Test.createTestingModule()`でコントローラだけを登録し、`ReadingListService`をJestのモックへ差し替えます。Nestの公式ガイドで説明されている`TestingModule`は、プロバイダを取得・置換できるテスト用のDIコンテナです。[1]

```ts
const module = await Test.createTestingModule({
  controllers: [ReadingListController],
  providers: [{ provide: ReadingListService, useValue: service }],
}).compile();

controller = module.get(ReadingListController);
```

ここでの最初の期待は、`create()`が`title`と`author`をそのままサービスへ渡し、サービスが返した本を返すことです。サービスの結果は`mockResolvedValue()`で固定します。

## Greenにする

完成するコントローラは`@Controller('books')`、`@Post()`、`@Get()`を持つ薄い変換層です。完成実装は [`src/reading-list/presentation/reading-list.controller.ts`](../src/reading-list/presentation/reading-list.controller.ts) にあります。

```ts
@Post()
@HttpCode(HttpStatus.CREATED)
public create(@Body() input: AddBookInput): Promise<BookProps> {
  return this.readingListService.add(input);
}
```

この実装により、HTTP固有のデコレータを使いながらも、ユースケースの重複判定を再実装せずに済みます。

## 次の一歩

HTTP入力を検証したい場合は、DTOクラス、`class-validator`、`ValidationPipe`を追加します。先に「空のJSON」「`title`なし」「文字列ではない`title`」のどれを400にするかをテストで決め、E2EテストでHTTP応答を確認してください。ドメインの空白タイトル規則とは、目的が異なることを保ちます。

## 確認

```bash
npm run test:unit -- reading-list.controller.spec.ts
```

## 参考資料

[1] [NestJS Documentation: Testing](https://docs.nestjs.com/fundamentals/testing)
