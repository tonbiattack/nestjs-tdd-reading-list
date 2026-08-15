# NestJSをテスト駆動開発で学ぶ：読書リストAPI

NestJSのDI、`TestingModule`、HTTP境界のテストを、読書リストAPIを小さく作りながら学ぶための教材です。各仕様を失敗するテストで表し、最小実装で通し、必要になった境界だけを後から増やします。テストを先に書くことで、ドメイン規則・ユースケース・HTTP変換・アプリケーション配線を別々に説明できる状態を目指します。

> このリポジトリは完成版です。各章の「最初のテスト」を残して実装を一時的に隠すと、**Red → Green → Refactor** の反復を自分で再現できます。

## この教材で扱うこと

NestJSはデフォルトのテストフレームワークとしてJestを提供し、`@nestjs/testing` を通じてDIコンテナをテストに利用できます。[1] 本教材では、フレームワークを起動しないテストから始め、`TestingModule`、最後にSupertestを使うE2Eテストへと検証範囲を広げます。

| 層 | 守る振る舞い | テストの起動範囲 | 主なテスト |
|---|---|---|---|
| ドメイン | タイトルの正規化と空白タイトルの拒否 | 起動しない | `book.spec.ts` |
| アプリケーション | 重複判定、ID発行、保存、一覧取得 | 起動しない | `reading-list.service.spec.ts` |
| コントローラ | HTTP入力をユースケースへ渡すこと | `TestingModule` | `reading-list.controller.spec.ts` |
| HTTP境界 | `POST /books` と `GET /books` の契約 | Nestアプリケーション全体 | `reading-list.e2e-spec.ts` |

## 前提条件

| 項目 | 必要なもの |
|---|---|
| Node.js | 22以上 |
| npm | 10以上 |
| 実行環境 | macOS、Linux、Windows（WSLを含む） |

## はじめ方

```bash
git clone https://github.com/tonbiattack/nestjs-tdd-reading-list.git
cd nestjs-tdd-reading-list
npm ci
npm run typecheck
npm test
```

| コマンド | 用途 |
|---|---|
| `npm run test:unit` | ドメイン、ユースケース、コントローラの単体テストを実行します。 |
| `npm run test:e2e` | Nestアプリケーションをテスト内で起動し、HTTP契約を実行します。 |
| `npm test` | 単体テストとE2Eテストを順に実行します。 |
| `npm run test:cov` | 単体テストのカバレッジを生成します。 |
| `npm run build` | `dist/` にTypeScriptをコンパイルします。 |
| `npm run start:dev` | APIをポート3000で起動します。 |

起動後は、次のように本を登録できます。永続化は学習用のインメモリ実装であるため、プロセスを止めると内容は失われます。

```bash
curl -i -X POST http://localhost:3000/books \
  -H 'Content-Type: application/json' \
  -d '{"title":"テスト駆動開発","author":"Kent Beck"}'

curl -i http://localhost:3000/books
```

## 学び方

各章では、最初にテストを一つだけ実行します。最初の失敗がコンパイルエラーでも構いません。次に、その失敗を通す最小の実装を追加します。テストがGreenになった後に限り、命名、型、重複を整えます。小さなテストで言語や設計を確かめる進め方は、Learn Go with Testsが示すTDDの学習方法をNestJS向けに再構成したものです。[2]

| 順番 | 章 | 最初のテスト | 完成実装 |
|---:|---|---|---|
| 1 | [本のドメイン規則](fundamentals/01-book-domain.md) | 空白タイトルを拒否する | `src/reading-list/domain/book.ts` |
| 2 | [読書リストのユースケース](build-an-application/02-reading-list-service.md) | 本を保存して返す | `src/reading-list/application/reading-list.service.ts` |
| 3 | [HTTPコントローラ](build-an-application/03-reading-list-controller.md) | 登録要求をサービスへ渡す | `src/reading-list/presentation/reading-list.controller.ts` |
| 4 | [HTTPワークフロー](build-an-application/04-reading-list-e2e.md) | `POST`して`GET`で取得する | `test/reading-list.e2e-spec.ts` |
| 5 | [テスト範囲の選び方](questions-and-answers/01-test-scope.md) | どの境界を起動するかを決める | 各テスト設定 |

詳細な導線は [SUMMARY.md](SUMMARY.md)、NestJSでの置換判断は [DESIGN.md](DESIGN.md)、参照教材との対応は [coverage-matrix.md](coverage-matrix.md) を参照してください。

## コード配置

| パス | 内容 |
|---|---|
| `src/` | 完成実装とユニットテスト |
| `test/` | E2Eテストと専用Jest設定 |
| `fundamentals/` | ドメイン規則から始める基礎章 |
| `build-an-application/` | NestJSアプリケーションを組み立てる章 |
| `questions-and-answers/` | テスト範囲と設計の補足 |
| `DESIGN.md` | TypeScriptとNestJSに合わせた設計判断 |
| `coverage-matrix.md` | 参照教材との対応と範囲 |

## 参考資料

[1] [NestJS Documentation: Testing](https://docs.nestjs.com/fundamentals/testing)

[2] [Learn Go with Tests](https://quii.gitbook.io/learn-go-with-tests)

[3] [Jest Documentation](https://jestjs.io/docs/getting-started)
