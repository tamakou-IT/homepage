# homepage
## 進捗 形のみのヘッダーフッターを実装（内容は仮
worksを実装
デザインはいずれも仮
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
│   ├── workdesign.css      … 成果物カード部品の見た目
│   └── reportsdesign.css   … レポートカード部品の見た目
│
├── js/
│   ├── headfooter.js
│   ├── works.js
│   ├── reports.js
│   └── report.js
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
    └── icon.png              … favicon
```

### 分類の考え方
- `data/` = JSが**fetchしてテキストとして解釈・加工する**もの(JSON, Markdown, テンプレートHTML)
- `css/` `images/` = ブラウザが**直接リソースとして読み込む**もの(JSが中身を解釈しない)

---

## 2. 命名・データ形式の共通ルール

- 日付形式: `YYYY-MM-DD` (ISO 8601)。並び替えは `new Date(date)` で比較し、**新しい日付が先頭**になるよう降順ソートする
- JSONのキー名は英小文字、1単語で統一(例: `title`, `picture`, `text`, `date`, `url`)
- 命名規則: **`reports`(複数形)= 一覧表示に関わるもの**(`reports.js`, `reports.html`, `reportsdesign.html`)、**`report`(単数形)= 個別ページの表示に関わるもの**(`report.js`, `report.html`)という使い分けで統一する。なお works は個別の詳細ページを持たず(カードは外部URLへ直接遷移)、`report.html` に相当する単数形ページが存在しないため、`work` 単体のファイルはない

---

## 3. ページ仕様

### 3.1 index.html
- `headfooter.js` を読み込み、ヘッダー/フッターを自動挿入
- `works.js` を読み込み、`<div class="site_works" data-count="4"></div>` を設置し、新着成果物4件を表示

### 3.2 works.html
- `<div class="site_works"></div>`(data-count省略 = 全件表示)

### 3.3 reports.html
- `<div class="site_reports"></div>`(data-count省略 = 全件表示)

### 3.4 report.html
- `report.js` を読み込み、URLクエリ `?file=xxx.md` の内容を表示
- `file` パラメータが空の場合は `reports.html` にリダイレクト
- `file` パラメータは存在するが該当するmdファイルのfetchに失敗した場合(存在しないファイル名等)は、`reports.html` へのリダイレクトはせず、`report.html` 内に以下のメッセージを `report.js` からHTMLとして挿入して表示する

  ```
  お探しのページは見つかりませんでした
  トップに戻る (index.htmlへのリンク)
  ```

---

## 4. JSモジュール仕様

### headfooter.js
- html/cssをJS内に直書き(fetchによる表示遅延を避けるため)
- `<div id="site_header"></div>` があればその中に、なければページ先頭に自動挿入
- `<div id="site_footer"></div>` があればその中に、なければページ末尾に自動挿入
- ヘッダーに works / reports ページへのリンクを含む
- 【要確認】ヘッダーに含める要素(サイトタイトル/ロゴの有無、ナビゲーションの表示名) → 質問6参照

### works.js
- `<div class="site_works" data-count="N">` を検出し、`data/templates/workdesign.html` と `data/works/list.json` をfetch(`workdesign.html`は完全なHTML文書のため、`DOMParser`で`.card`要素のみを取り出して使用。5章参照)
- `list.json` を `date` 降順にソートし、`data-count` が指定されていればその件数だけ、未指定なら全件を、テンプレートの `class` 箇所に差し込んで表示
- カード(`class="card"`)クリック時: `list.json` の `url`(外部リンク)へ**同一タブで**遷移(`location.href = url`)
- `card_picture` に挿入する `<img>` の `alt` 属性には `list.json` の `title` の値をそのまま使用する

### reports.js
- `<div class="site_reports" data-count="N">` を検出し、`data/templates/reportsdesign.html` と `data/reports/list.json` をfetch(取り出し方はworks.jsと共通。5章参照)
- `date` 降順ソート、`data-count` に応じて表示件数を制御(仕様はworks.jsと共通)
- カードクリック時: `report.html?file=` + `list.json` の `file` の値(`encodeURIComponent` でエスケープ)へ遷移
  - `file` の値はパスを含まないファイル名のみ(例: `"test.md"`)。`report.js` 側で `data/reports/` を前置してfetchする
- `card_picture` に挿入する `<img>` の `alt` 属性には `list.json` の `title` の値をそのまま使用する

### report.js
- URLの `file` パラメータを取得。空なら `reports.html` にリダイレクト
- `data/reports/` + `file` をfetchし、`marked.js` でHTMLに変換して表示
- `marked.js` は以下を `report.html` の `<head>` で読み込む(バージョン固定、2026年9月時点の最新安定版)

  ```html
  <script src="https://cdn.jsdelivr.net/npm/marked@18.0.4/lib/marked.umd.js"></script>
  ```

- fetchが失敗した場合(該当mdファイルが存在しない等)は `reports.html` へリダイレクトせず、3.4節の「お探しのページは見つかりませんでした」メッセージを表示する

---

## 5. デザインテンプレート仕様

`workdesign.html` / `reportsdesign.html` は、**単体でブラウザで開いてもCSSが反映された状態でカードの見た目を確認できる**よう、断片(フラグメント)ではなく `<!DOCTYPE html>` から始まる完全なHTML文書として作成する。

```html
<!-- data/templates/workdesign.html -->
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <link rel="stylesheet" href="../../css/common.css">
  <link rel="stylesheet" href="../../css/workdesign.css">
</head>
<body>
  <div class="card">
    <img class="card_picture" src="" alt="">
    <p class="card_title"></p>
    <p class="card_text"></p>
    <p class="card_date"></p>
  </div>
</body>
</html>
```

- `data/templates/` から見て `css/` は2階層上なので `../../css/...` という相対パスになる
- `reportsdesign.html` も同様の構成とする(`card_text` は含めない。5章の class一覧参照)

### works.js / reports.js 側の取り出し方
テンプレートをfetchしたら、`DOMParser` で一度パースし、`.card` 要素だけを取り出して複製・差し込みに使う(`<head>` やページ全体は無視される)。

```javascript
const res = await fetch('data/templates/workdesign.html');
const html = await res.text();

const parser = new DOMParser();
const doc = parser.parseFromString(html, 'text/html');
const template = doc.querySelector('.card');

list.forEach(item => {
  const card = template.cloneNode(true);
  card.querySelector('.card_title').textContent = item.title;
  // ...他のclassも同様に差し替え
  container.appendChild(card);
});
```

### data/templates/workdesign.html / css/workdesign.css
class一覧(JSで中身を置換する対象):

| class名 | 内容 |
|---|---|
| `card` | カード全体。クリックで `url` に遷移 |
| `card_title` | タイトル |
| `card_picture` | 写真 |
| `card_text` | 説明文 |
| `card_date` | 日付 |

### data/templates/reportsdesign.html / css/reportsdesign.css
class一覧:

| class名 | 内容 |
|---|---|
| `card` | カード全体。クリックで `report.html?file=...` に遷移 |
| `card_title` | タイトル |
| `card_picture` | サムネイル画像 |
| `card_date` | 日付 |

---

## 6. データファイル仕様

### data/works/list.json

```json
[
  {
    "title": "hogehoge",
    "picture": "images/works/work1.png",
    "text": "fugafuga",
    "date": "2023-01-15",
    "url": "https://example.com/hogehoge"
  }
]
```

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
<link rel="icon" type="image/png" href="images/icon.png">
```

- カード部品用CSS(`workdesign.css` / `reportsdesign.css`)は、それぞれ `works.css` / `reports.css` と合わせて該当ページのみで読み込む

---

## 8. 残っている検討事項

大半の仕様は確定しました。残るのは以下のみです(実装のブロッカーではなく、後回しで問題ありません)。

1. **ヘッダーの具体的な内容**: サイト名・ロゴの有無、ナビゲーションの表示文言(「ホーム」「作品」「レポート」等)はまだ未定。`headfooter.js` 内で完結する部分なので、後から中身だけ書き換えれば済む(構造上の手戻りはない)
2. `list.json` の取得自体(ファイルは存在するがJSONが壊れている等)が失敗した場合の挙動は未定義。現状は report.js の404表示のみ定義済みで、works.js / reports.js 側のfetch失敗時の挙動(例: 「読み込みに失敗しました」の表示 or 何も表示しない)は未確認
。
