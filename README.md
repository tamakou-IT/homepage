# homepage

## 進捗
- 形のみのヘッダーフッターを実装（ダークテーマ・スマートヘッダー・SNSリンク対応完了）
- worksを実装（ジャンル・対応端末・日付右下固定・エラーハンドリング対応）
- reportsを実装（一覧表示・新着表示・エラーハンドリング対応）
- reportを実装（Markdown自動HTML変換・KaTeX数式表示・前後記事ナビゲーション・report.css適用）
- index.htmlのデザイン刷新（セクション分け・もっと見るボタン設置）

## 伝言
これからは進捗はissueで管理したい
ファイルを入れていなかったのでdata/reports・images/reportsフォルダが消えているので追加してください

# サークル紹介サイト 仕様書(改訂版)

## 0. 全体方針

- フロントエンドのみで完結する静的サイト(ビルドツール・バックエンドなし)
- GitHub Pagesの**プロジェクトページ**(`username.github.io/リポジトリ名/`)として公開
- 上記に伴い、すべてのパス(fetch先、`<link>`、`<img>`、内部リンク等)は**先頭 `/` を付けない相対パス**で統一する(絶対パスだとリポジトリ名の階層がずれて動かなくなるため)

---

## 1. ディレクトリ構成

```
├── index.html
├── works.html
├── reports.html
├── report.html
│
├── css/
│   ├── common.css          … 全ページ共通(基本タイポグラフィ, 色, レイアウトの土台, リセットCSS等。header/footerのCSSは含まない)
│   ├── index.css           … index.html固有
│   ├── works.css           … works.html固有
│   ├── reports.css         … reports.html固有
│   ├── report.css          … report.html固有 (個別レポート本文・数式・ナビゲーション等)
│   ├── workdesign.css      … 成果物カード部品の見た目
│   └── reportsdesign.css   … レポートカード部品の見た目
│
├── js/
│   ├── headfooter.js       … ヘッダー/フッター自動挿入・スクロール連動
│   ├── works.js            … 成果物カード生成 (エラーハンドリング付き)
│   ├── reports.js          … レポートカード一覧生成 (エラーハンドリング付き)
│   └── report.js           … 個別レポート描画 (Markdownパース・KaTeX・前後ナビ)
│
├── data/
│   ├── templates/
│   │   ├── workdesign.html     … 成果物カードの型(単体表示可能な完全なHTML文書)
│   │   └── reportsdesign.html  … レポートカードの型(同上)
│   ├── works/
│   │   └── list.json
│   └── reports/
│       ├── list.json
│       └── *.md                 … レポート本文
│
└── images/
    ├── works/
    │   └── *.png (等)
    ├── reports/
    │   └── *.png (等)
    └── icon.svg              … favicon / サイトロゴ
```

### 分類の考え方
- `data/` = JSが**fetchしてテキストとして解釈・加工する**もの(JSON, Markdown, テンプレートHTML)
- `css/` `images/` = ブラウザが**直接リソースとして読み込む**もの(JSが中身を解釈しない)

---

## 2. 命名・データ形式の共通ルール

- 日付形式: `YYYY-MM-DD` (ISO 8601)。並び替えは `new Date(date)` で比較し、**新しい日付が先頭**になるよう降順ソートする
- JSONのキー名は英小文字、1単語で統一(例: `title`, `picture`, `genre`, `device`, `text`, `date`, `url`)
- 命名規則: **`reports`(複数形)= 一覧表示に関わるもの**(`reports.js`, `reports.html`, `reportsdesign.html`)、**`report`(単数形)= 個別ページの表示に関わるもの**(`report.js`, `report.html`, `report.css`)という使い分けで統一する。なお works は個別の詳細ページを持たず(カードは外部URLへ直接遷移)、`report.html` に相当する単数形ページが存在しないため、`work` 単体のファイルはない

---

## 3. ページ仕様

### 3.1 index.html
- `headfooter.js` を読み込み、ヘッダー/フッターを自動挿入
- **ヒーローセクション (`.hero`)**: キャッチコピー、サークル紹介文、`works.html` へのボタン
- **成果物セクション (`.section_works`)**:
  - `works.js` を読み込み、`<div class="site_works" data-count="4"></div>` を設置して新着4件を表示
  - 下部に `works.html` へ遷移する「もっと見る」ボタン (`.section_more_btn`) を配置
- **活動報告セクション (`.section_reports`)**:
  - `reports.js` を読み込み、`<div class="site_reports" data-count="4"></div>` を設置して新着4件を表示
  - 下部に `reports.html` へ遷移する「もっと見る」ボタン (`.section_more_btn`) を配置
- CSSは `common.css`, `index.css`, `workdesign.css`, `reportsdesign.css` を読み込む

### 3.2 works.html
- `<div class="site_works"></div>`(data-count省略 = 全件表示)

### 3.3 reports.html
- `<div class="site_reports"></div>`(data-count省略 = 全件表示)

### 3.4 report.html
- `report.js` を読み込み、URLクエリ `?file=xxx.md` の内容を表示
- `<div id="site_report">` がmdを表示する場所になる
- `file` パラメータが空の場合は `reports.html` にリダイレクト
- `file` パラメータは存在するが該当するmdファイルのfetchに失敗した場合(存在しないファイル名等)は、`reports.html` へのリダイレクトはせず、`report.html` 内に以下のメッセージを `report.js` からHTMLとして挿入して表示する

  ```
  お探しのページは見つかりませんでした
  トップに戻る (index.htmlへのリンク)
  ```

- 外部ライブラリ:
  - Markdownパーサー: `marked.js` (UMD形式)
  - 数式レンダラー: `KaTeX` (CSS & JS)
  - アイコン: `FontAwesome`

---

## 4. JSモジュール仕様

### headfooter.js
- html/cssをJS内に直書き(fetchによる表示遅延を避けるため)
- `<div id="site_header"></div>` があればその中に、なければページ先頭に自動挿入
- `<div id="site_footer"></div>` があればその中に、なければページ末尾に自動挿入
- クラス名は他CSSとの競合を避けるため `hf_` プレフィックスを使用
- **ヘッダー構成**:
  - ロゴ画像 (`images/icon.svg`) ＋ サイト名「ITサークル」
  - グラスモーフィズム調ダークテーマ (`background: rgba(13, 19, 31, 0.75)`)
  - ナビゲーションリンク: ホーム (`index.html`) / 作品 (`works.html`) / レポート (`reports.html`)
  - 現在開いているページのリンクに `aria-current="page"` を自動付与
  - **スマートヘッダー**: スクロール追従。下スクロールで隠し (`#site_header.hf_hidden`)、上スクロールで再表示
- **フッター構成**:
  - ダークテーマ (`background: #0d131f`)
  - 公式SNSリンク: Instagram、X (旧Twitter) のアイコン
  - コピーライト年号の自動計算 (`new Date().getFullYear()`)

### works.js
- `<div class="site_works" data-count="N">` を検出し、`data/templates/workdesign.html` と `data/works/list.json` をfetch
- `list.json` を `date` 降順にソートし、`data-count` が指定されていればその件数だけ、未指定なら全件を、テンプレートの `class` 箇所に差し込んで表示
- カード自体が `<a class="card" href="...">` となっており、クリックで `list.json` の `url` (外部リンク) へ遷移
- `card_picture` に挿入する `<img>` の `alt` 属性には `list.json` の `title` の値をそのまま使用する
- `genre` (ジャンル) があれば `.card_genre` に表示、未指定なら非表示
- `device` (対応端末) があれば `.card_device` に表示、未指定なら非表示
- `.card_footer` 内に `.card_device` と `.card_date` を配置し、カード下部の左右両端に固定
- **エラーハンドリング**: fetch失敗時やJSON破損時は `console.error` に詳細を出力し、コンテナ内に「作品情報の読み込みに失敗しました。」という案内を表示

### reports.js
- `<div class="site_reports" data-count="N">` を検出し、`data/templates/reportsdesign.html` と `data/reports/list.json` をfetch
- `date` 降順ソート、`data-count` に応じて表示件数を制御(`index.html` では新着4件、`reports.html` では全件)
- カード自体が `<a class="card" href="...">` となっており、クリックで `report.html?file=` + `list.json` の `file` の値(`encodeURIComponent` でエスケープ)へ遷移
- `file` の値はパスを含まないファイル名のみ(例: `"test.md"`)。`report.js` 側で `data/reports/` を前置してfetchする
- `card_picture` に挿入する `<img>` の `alt` 属性には `list.json` の `title` の値をそのまま使用する
- **エラーハンドリング**: fetch失敗時やJSON破損時は `console.error` に詳細を出力し、コンテナ内に「活動報告の読み込みに失敗しました。」という案内を表示

### report.js
- URLの `file` パラメータを取得。空なら `reports.html` にリダイレクト
- パス走査(`..` や `/` など)が含まれる場合は不正アクセス防止のため404表示
- `data/reports/` + `file` をfetchし、`marked.js` でHTMLに変換して `<div id="site_report">` に描画
- 最初の見出し (`h1`) を取得し、`document.title` に「見出し | 情報技術サークル」として反映
- fetchが失敗した場合(該当mdファイルが存在しない等)は `reports.html` へリダイレクトせず、3.4節の「お探しのページは見つかりませんでした」メッセージを表示する
- **KaTeX 数式表示対応**:
  - `report.html` に KaTeX (CSS & JS) を読み込み
  - `report.js` 内で `marked` のカスタム拡張を登録し、Markdownエスケープ前に数式をトークン化して KaTeX (`katex.renderToString`) でレンダリング
  - `throwOnError: false`, `strict: false` により、非標準記法や数式内の日本語も安全に表示
  - 対応記法:
    - インライン数式: `\( ... \)`, `$ ... $`
    - ブロック数式: `\[ ... \]`, `$$ ... $$`
  - `report.css` で `.katex-display-wrapper` によるレスポンシブ横スクロール対応 (`overflow-x: auto`) を実施
- **前後記事ナビゲーション (`setupPagination`)**:
  - `data/reports/list.json` をfetchして日付降順ソート
  - 現在の記事の前後の記事を判定（前の記事 = 過去、次の記事 = 新しい）
  - 記事末尾に `<nav class="report_pagination">` を生成
  - 前後の記事のタイトルとラベル (`report_pagination_label`, `report_pagination_title`)、中央に「一覧へ戻る」ボタン (`report_pagination_list`) を配置
  - 前後どちらかの記事が存在しない場合は空のプレースホルダー (`report_pagination_placeholder`) を配置してレイアウトを維持
  - タイトルのHTMLエスケープ (`escapeHtml`) によるXSS対策を実施

---

## 5. デザインテンプレート仕様

`workdesign.html` / `reportsdesign.html` は、**単体でブラウザで開いてもCSSが反映された状態でカードの見た目を確認できる**よう、断片(フラグメント)ではなく `<!DOCTYPE html>` から始まる完全なHTML文書として作成する。

### data/templates/workdesign.html

```html
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <link rel="stylesheet" href="../../css/common.css">
  <link rel="stylesheet" href="../../css/workdesign.css">
</head>
<body>
  <a class="card" href="">
    <img class="card_picture" src="" alt="">
    <span class="card_genre"></span>
    <p class="card_title"></p>
    <p class="card_text"></p>
    <div class="card_footer">
      <span class="card_device"></span>
      <p class="card_date"></p>
    </div>
  </a>
</body>
</html>
```

### data/templates/reportsdesign.html

```html
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <link rel="stylesheet" href="../../css/common.css">
  <link rel="stylesheet" href="../../css/reportsdesign.css">
</head>
<body>
  <a class="card" href="">
    <img class="card_picture" src="" alt="">
    <p class="card_title"></p>
    <p class="card_date"></p>
  </a>
</body>
</html>
```

- `data/templates/` から見て `css/` は2階層上なので `../../css/...` という相対パスになる

### works.js / reports.js 側の取り出し方
テンプレートをfetchしたら、`DOMParser` で一度パースし、`.card` 要素だけを取り出して複製・差し込みに使う(`<head>` やページ全体は無視される)。

### data/templates/workdesign.html / css/workdesign.css
class一覧(JSで中身を置換する対象):

| class名        | 内容                                |
| -------------- | ----------------------------------- |
| `card`         | カード全体 (`<a>`タグ)。`url` にリンク |
| `card_picture` | 写真                                |
| `card_genre`   | ジャンルバッジ(任意)                |
| `card_title`   | タイトル                            |
| `card_text`    | 説明文                              |
| `card_footer`  | 下部配置用コンテナ                  |
| `card_device`  | 対応端末(任意、テキスト)            |
| `card_date`    | 日付                                |

### data/templates/reportsdesign.html / css/reportsdesign.css
class一覧:

| class名        | 内容                                                 |
| -------------- | ---------------------------------------------------- |
| `card`         | カード全体 (`<a>`タグ)。`report.html?file=...` にリンク |
| `card_picture` | サムネイル画像                                       |
| `card_title`   | タイトル                                             |
| `card_date`    | 日付                                                 |

---

## 6. データファイル仕様

### data/works/list.json

```json
[
  {
    "title": "hogehoge",
    "picture": "images/works/work1.png",
    "genre": "ゲーム",
    "device": "PC",
    "text": "fugafuga",
    "date": "2023-01-15",
    "url": "https://example.com/hogehoge"
  }
]
```

- `genre` / `device` は任意項目(未指定時はHTML上で非表示)

### data/reports/list.json

```json
[
  {
    "file": "test.md",
    "title": "hogehoge",
    "picture": "images/reports/test.png",
    "date": "2023-01-15"
  }
]
```

- `file`: `data/reports/` 直下のmdファイル名のみ(パスなし)
- `text`(概要文)は含めない

---

## 7. CSS読み込み方針

各HTMLの `<head>` 内で以下の順に読み込む(後発のCSSが上書き調整できるよう、共通→固有の順):

```html
<link rel="stylesheet" href="css/common.css">
<link rel="stylesheet" href="css/(該当ページ).css">
<link rel="icon" type="image/png" href="images/icon.svg">
```

- **index.html**: `common.css` → `index.css` → `workdesign.css` → `reportsdesign.css` の順で読み込み、両方のカードスタイルを適用
- **works.html**: `common.css` → `works.css` → `workdesign.css`
- **reports.html**: `common.css` → `reports.css` → `reportsdesign.css`
- **report.html**: `common.css` → `report.css` ＋ KaTeX CSS
- CSSセレクタのスコープ制限: カードスタイルの干渉を防ぐため、`workdesign.css` は `.site_works .card`、`reportsdesign.css` は `.site_reports .card` で限定定義する
