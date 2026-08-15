# 対応表

この教材は、[Learn Go with Tests][1] が示す「小さなテストで言語と設計を学ぶ」考え方を、TypeScriptとNestJSのHTTP APIへ再構成したものです。原典の章やコードを転記するものではありません。NestJSのDI、`TestingModule`、SupertestによるHTTP境界を学ぶために、読書リストAPIという独自の題材に置き換えています。

| 学習上の主題 | NestJS版での表現 | 実装・テスト | 状態 | 置換の理由 |
|---|---|---|---|---|
| 値と入力規則 | `Book.create()` | `book.ts` / `book.spec.ts` | 実装済み | 文字列をそのまま渡し回さず、タイトルの不変条件をドメインで固定します。 |
| エラー | `InvalidBookTitleError`、`DuplicateBookError` | ドメイン・サービスのテスト | 実装済み | TypeScriptでは独自`Error`で失敗の意図を表します。 |
| Map・状態 | インメモリ読書リスト | `InMemoryBookRepository` | 実装済み | 学習対象をDB接続ではなく、保存と重複判定の振る舞いに絞ります。 |
| 依存性注入・モック | repositoryとID発行器を注入 | `ReadingListService`の手書きフェイク | 実装済み | 外部境界を契約へ切り出し、ランダムIDと永続化を隔離します。 |
| HTTP | `POST /books`、`GET /books` | controller spec / E2E spec | 実装済み | Nestのデコレータ、TestingModule、Supertestを段階的に扱います。 |
| 非同期 | `Promise`によるrepository契約 | サービスの`async`テスト | 部分実装 | 成功系と重複エラーを対象にし、並列競合やキャンセルは扱いません。 |
| 実永続化 | DBアダプタと統合テスト | 未実装 | 未着手 | 外部DBの準備は教材の最初の反復から意図的に除外しています。 |
| 入力DTO検証 | `class-validator`と400応答 | 未実装 | 未着手 | HTTP入力検証は次の発展課題です。ドメイン規則は既にテスト済みです。 |
| 認証・認可 | GuardとE2Eテスト | 未実装 | 未着手 | 読書リストの最小題材からは除外しています。 |

## 完成の判定

「実装済み」は、章ガイド、振る舞いテスト、完成実装の三つが揃った状態を指します。「部分実装」と「未着手」は、教材の対象外や次の練習課題を曖昧にしないために残しています。

## 参考資料

[1]: https://quii.gitbook.io/learn-go-with-tests "Learn Go with Tests"
