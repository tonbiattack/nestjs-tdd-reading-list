# 5. テスト範囲をどう選ぶか

## 結論

守りたい契約に対して最も狭いテストを選びます。NestJSアプリケーションを毎回起動する必要はありません。ドメイン規則ならプレーンなクラス、DIの結線なら`TestingModule`、ルーティングとJSONならE2Eテストを使います。

| 問い | 選ぶテスト | この教材の例 |
|---|---|---|
| 空白タイトルを拒否できるか | ドメインの単体テスト | `Book.create()` |
| 保存前に重複を拒否できるか | サービスの単体テスト | `ReadingListService.add()` |
| コントローラが入力をサービスに渡すか | `TestingModule`を使うテスト | `ReadingListController.create()` |
| `POST /books`が201を返すか | E2Eテスト | SupertestからのHTTP要求 |
| DBの一意制約が働くか | DB統合テスト | この教材の発展課題 |

## なぜ狭いテストから始めるのか

E2Eテストだけでは、空白タイトルの規則が壊れたときに、ルーティング、DI、JSON、業務規則のどこが原因なのか分かりにくくなります。ドメインテストなら、規則の失敗を数ミリ秒で直接示せます。逆に、コントローラのデコレータが間違っていて`/books`が公開されない問題は、サービスの単体テストでは検出できません。

小さなテストと広いテストは競合しません。小さなテストは設計のフィードバックを速くし、広いテストは実際の接続を確認します。NestJSの公式テストガイドも、孤立テスト、`TestingModule`を使うテスト、E2Eテストを用途別に説明しています。[1]

## `TestingModule`はいつ必要か

クラスを`new`できるだけなら、最初は直接生成します。`ReadingListService`のテストがこれに当たります。プロバイダの解決、コントローラの生成、Nestのデコレータを含む結線を確認したくなったときに`Test.createTestingModule()`を使います。

```ts
const module = await Test.createTestingModule({
  controllers: [ReadingListController],
  providers: [{ provide: ReadingListService, useValue: service }],
}).compile();
```

このコードは、サービスをモックへ差し替えながらコントローラをNestに作らせます。HTTPサーバーを起動するより狭く、単に`new ReadingListController(service)`と書くよりNestの結線に近い検証です。

## 次の設計判断

実永続化を追加するときは、サービスの既存テストを変更せずにrepository実装だけを差し替えます。DB固有のSQL、制約、トランザクションは別の統合テストに置きます。HTTP入力検証を追加するときは、まず期待する400応答をE2Eテストで決め、次にDTOと`ValidationPipe`を追加します。

## 参考資料

[1] [NestJS Documentation: Testing](https://docs.nestjs.com/fundamentals/testing)
