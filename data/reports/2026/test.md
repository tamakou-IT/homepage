# Markdown記法・拡張機能 総合チェックリスト

## 1. 標準Markdown（CommonMark）

| 記法名 | 記法・構文 |
|---|---|
| ATX見出し | `# 見出し` ～ `###### 見出し` |
| Setext見出し | `見出し` + `===` / `---` |
| 段落 | 空行で段落を区切る |
| ソフト改行 | 行末で改行 |
| ハード改行 | 行末に半角スペース2つ / `\` |
| 水平線 | `---` / `***` / `___` |
| 引用 | `> 引用文` |
| 入れ子の引用 | `> > 引用文` |
| 箇条書きリスト | `- 項目` / `* 項目` / `+ 項目` |
| 番号付きリスト | `1. 項目` / `1) 項目` |
| 入れ子のリスト | インデント + リスト記号 |
| リスト内の複数段落 | インデント + 空行 |
| インデントコードブロック | 行頭に半角スペース4つ / タブ |
| フェンスコードブロック | ```` ```コード``` ```` |
| チルダフェンスコードブロック | `~~~コード~~~` |
| コードブロックの言語指定 | ```` ```python ```` |
| インラインコード | `` `コード` `` |
| イタリック | `*文字列*` / `_文字列_` |
| 太字 | `**文字列**` / `__文字列__` |
| 強調の入れ子 | `**太字と_斜体_**` |
| インラインリンク | `[リンク文字列](URL)` |
| リンクタイトル | `[リンク](URL "タイトル")` |
| 参照リンク定義 | `[参照名]: URL "タイトル"` |
| 参照リンク | `[リンク文字列][参照名]` |
| 省略型参照リンク | `[参照名][]` |
| ショートカット参照リンク | `[参照名]` |
| インライン画像 | `![代替テキスト](画像URL)` |
| 画像タイトル | `![代替テキスト](画像URL "タイトル")` |
| 参照画像 | `![代替テキスト][参照名]` |
| 自動リンク（URL） | `<https://example.com>` |
| 自動リンク（メール） | `<user@example.com>` |
| インラインHTML | `<u>下線</u>` |
| ブロックHTML | `<div>HTMLブロック</div>` |
| バックスラッシュエスケープ | `\*` / `\#` / `\_` / `\[` |
| 名前付き文字参照 | `&copy;` / `&amp;` |
| 数値文字参照 | `&#169;` / `&#x00A9;` |

## 2. GitHub Flavored Markdown（GFM正式仕様）

| 記法名 | 記法・構文 |
|---|---|
| テーブル | `\| 列1 \| 列2 \|` + 区切り行 |
| テーブル左揃え | `\| :--- \|` |
| テーブル中央揃え | `\| :---: \|` |
| テーブル右揃え | `\| ---: \|` |
| タスクリスト（未完了） | `- [ ] タスク` |
| タスクリスト（完了） | `- [x] タスク` |
| 大文字Xのタスクリスト | `- [X] タスク` |
| 取り消し線 | `~~文字列~~` |
| URL自動リンク | `https://example.com` |
| メールアドレス自動リンク | `user@example.com` |
| Raw HTMLフィルタリング | `<script>...</script>` / `<iframe>...</iframe>` |

## 3. GitHub.com追加機能（GFM正式仕様外）

| 記法名 | 記法・構文 |
|---|---|
| アラート（Note） | `> [!NOTE]` |
| アラート（Tip） | `> [!TIP]` |
| アラート（Important） | `> [!IMPORTANT]` |
| アラート（Warning） | `> [!WARNING]` |
| アラート（Caution） | `> [!CAUTION]` |
| 脚注参照 | `[^1]` |
| 脚注定義 | `[^1]: 脚注の内容` |
| 絵文字ショートコード | `:smile:` / `:rocket:` |
| インライン数式 | `$a^2+b^2=c^2$` |
| ブロック数式 | `$$ ... $$` |
| Mermaid図 | ```` ```mermaid ```` |
| ユーザーメンション | `@username` |
| Issue参照 | `#123` |
| Pull Request参照 | `#123` |
| リポジトリ横断参照 | `owner/repository#123` |
| コミット参照 | `コミットSHA` |

## 4. MPE独自拡張（基本記法・テキスト装飾）

| 記法名 | 記法・構文 |
|---|---|
| 見出しID指定 | `# 見出し {#heading-id}` |
| 見出しクラス指定 | `# 見出し {.class-name}` |
| 見出し属性指定 | `# 見出し {#id .class}` |
| 上付き文字 | `30^th^` |
| 下付き文字 | `H~2~O` |
| ハイライト | `==文字列==` |
| 脚注 | `本文[^1]` / `[^1]: 脚注内容` |
| 略語定義 | `*[HTML]: Hyper Text Markup Language` |
| 略語参照 | 定義済みの `HTML` |
| 絵文字 | `:smile:` |
| Font Awesomeアイコン | `:fa-car:` |
| タイポグラフィ変換 | `"引用符" ... -- --- (c) (r) (tm)` |
| 定義リスト | `用語` + 改行 + `: 説明` |
| GitHub形式のパイプ付きWikiリンク | `[[表示名 \| リンク先]]` |
| Wikiリンク | `[[ページ名]]` |
| Wikiリンク（別名） | `[[ページ名\|表示名]]` |
| Wikiリンク（見出し参照） | `[[ページ名#見出し]]` |
| Wikiリンク（ブロック参照） | `[[ページ名^block-id]]` |
| Wikiリンク（見出し・ブロック参照） | `[[ページ名#見出し^block-id]]` |
| 同一ファイル内の見出しリンク | `[[#見出し]]` |
| 同一ファイル内のブロックリンク | `[[^block-id]]` |
| ノート埋め込み | `![[ページ名]]` |
| ノート埋め込み（見出し指定） | `![[ページ名#見出し]]` |
| ノート埋め込み（ブロック指定） | `![[ページ名^block-id]]` |
| ノート埋め込み（表示名指定） | `![[ページ名\|表示名]]` |
| ブロックID定義 | `段落の末尾。 ^block-id` |
| タグ | `#tag-name` |
| 階層タグ | `#parent/child` |
| タグの多階層指定 | `#parent/child/grandchild` |

## 5. MPE独自拡張（コードブロック）

| 記法名 | 記法・構文 |
|---|---|
| コードブロックのクラス指定 | ```` ```javascript {.class-name} ```` |
| 複数クラス指定 | ```` ```javascript {.class1 .class2} ```` |
| 行番号表示 | ```` ```javascript {.line-numbers} ```` |
| 単一行ハイライト | ```` ```javascript {highlight=10} ```` |
| 範囲ハイライト | ```` ```javascript {highlight=10-20} ```` |
| 複数範囲ハイライト | ```` ```javascript {highlight=[1-10,15,20-22]} ```` |
| コードブロックの属性指定 | ```` ```javascript {属性名=値} ```` |
| コードチャンク | ```` ```python {cmd=true} ```` |
| コードチャンク（コマンド指定） | ```` ```javascript {cmd="node"} ```` |
| コードチャンク（HTML出力） | ```` ```python {cmd=true output="html"} ```` |
| コードチャンク（Markdown出力） | ```` ```python {cmd=true output="markdown"} ```` |
| コードチャンク（テキスト出力） | ```` ```python {cmd=true output="text"} ```` |
| コードチャンク（画像出力） | ```` ```python {cmd=true output="png"} ```` |
| コードチャンク（出力非表示） | ```` ```python {cmd=true output="none"} ```` |
| コードチャンク（コード非表示） | ```` ```python {cmd=true hide} ```` |
| コードチャンク（引数指定） | ```` ```python {cmd=true args=["引数"]} ```` |
| コードチャンク（前のチャンクを継続） | ```` ```python {cmd=true continue} ```` |
| コードチャンク（Matplotlib） | ```` ```python {cmd=true matplotlib=true} ```` |
| コードチャンク（LaTeX） | ```` ```latex {cmd=true} ```` |

## 6. MPE独自拡張（テーブル）

| 記法名 | 記法・構文 |
|---|---|
| 拡張テーブル | `enableExtendedTableSyntax` |
| 横方向セル結合（colspan） | `>` |
| 縦方向セル結合（rowspan） | `^` |
| セル結合のエスケープ | `\>` / `\^` |

## 7. MPE独自拡張（目次・メタデータ）

| 記法名 | 記法・構文 |
|---|---|
| 目次生成 | `[TOC]` |
| 目次除外 | `## 見出し {ignore=true}` |
| YAML Front Matter | `---` + YAMLデータ + `---` |
| 目次設定（深さ） | `toc: depth_from: 1 / depth_to: 6` |
| 目次設定（番号付き） | `toc: ordered: true` |
| プレゼンテーション設定 | `presentation:` |
| HTML出力設定 | `html:` |
| Markdown出力設定 | `markdown:` |
| 保存時出力設定 | `export_on_save:` |
| eBook出力設定 | `ebook:` |
| Pandoc出力設定 | `pandoc_args:` |

## 8. MPE独自拡張（外部ファイルの読み込み）

| 記法名 | 記法・構文 |
|---|---|
| ファイルインポート | `@import "ファイルパス"` |
| HTMLコメント形式インポート | `<!-- @import "ファイルパス" -->` |
| 画像形式インポート | `![](ファイルパス)` |
| Wikiリンク形式インポート | `![[ファイルパス]]` |
| インポート画像サイズ指定 | `@import "image.png" {width="300px" height="200px"}` |
| インポート画像属性指定 | `![](image.png){width=300 height=200}` |
| インポート開始行指定 | `@import "file.md" {line_begin=2}` |
| インポート終了行指定 | `@import "file.md" {line_end=10}` |
| インポート範囲指定 | `@import "file.md" {line_begin=2 line_end=10}` |
| PDFページ指定 | `@import "file.pdf" {page_no=1}` |
| PDFページ範囲指定 | `@import "file.pdf" {page_begin=2 page_end=4}` |
| コードブロックとしてインポート | `@import "file.py" {code_block=true}` |
| コードチャンクとしてインポート | `@import "file.py" {cmd="python3"}` |
| Vega形式としてインポート | `@import "file.json" {as="vega"}` |
| Vega-Lite形式としてインポート | `@import "file.json" {as="vega-lite"}` |

## 9. MPE独自拡張（HTML5メディア埋め込み）

| 記法名 | 記法・構文 |
|---|---|
| 動画埋め込み（画像形式） | `![](video.mp4)` |
| 音声埋め込み（画像形式） | `![](audio.mp3)` |
| 動画埋め込み（リンク形式） | `[](video.mp4)` |
| 音声埋め込み（リンク形式） | `[](audio.mp3)` |
| HTML5 Embed設定 | `enableHTML5Embed` |

## 10. MPE独自拡張（アラート・校正）

| 記法名 | 記法・構文 |
|---|---|
| Admonition | `!!! note タイトル` |
| Admonition本文 | 4スペースインデント + 本文 |
| CriticMarkup（追加） | `{++追加文字列++}` |
| CriticMarkup（削除） | `{--削除文字列--}` |
| CriticMarkup（置換） | `{~~旧文字列~>新文字列~~}` |
| CriticMarkup（コメント） | `{>>コメント<<}` |
| CriticMarkup（ハイライト） | `{==強調文字列==}` |
| CriticMarkup（ハイライト＋コメント） | `{==強調文字列==}{>>コメント<<}` |

## 11. MPE独自拡張（数式）

| 記法名 | 記法・構文 |
|---|---|
| インライン数式（ドル記号） | `$a^2+b^2=c^2$` |
| インライン数式（括弧） | `\(a^2+b^2=c^2\)` |
| ブロック数式（ドル記号） | `$$ ... $$` |
| ブロック数式（角括弧） | `\[ ... \]` |
| 数式コードブロック | ```` ```math ```` |
| LaTeX数式環境 | `\begin{align} ... \end{align}` |
| KaTeXレンダリング | KaTeX対応LaTeX構文 |
| MathJaxレンダリング | MathJax対応LaTeX構文 |

## 12. MPE独自拡張（ダイアグラム・グラフ）

| 記法名 | 言語識別子・構文 |
|---|---|
| Flowchart.js | ```` ```flow ```` |
| Sequence Diagram | ```` ```sequence ```` |
| Mermaid | ```` ```mermaid ```` |
| PlantUML | ```` ```puml ```` |
| PlantUML | ```` ```plantuml ```` |
| WaveDrom | ```` ```wavedrom ```` |
| WaveDrom Bitfield | ```` ```bitfield ```` |
| Graphviz | ```` ```viz ```` |
| Graphviz DOT | ```` ```dot ```` |
| D2 | ```` ```d2 ```` |
| TikZ | ```` ```tikz ```` |
| WebSequenceDiagrams | ```` ```wsd ```` |
| Vega | ```` ```vega ```` |
| Vega-Lite | ```` ```vega-lite ```` |
| Kroki | ```` ```blockdiag {kroki=true} ```` |
| Kroki（図の種類指定） | ```` ```javascript {kroki="wavedrom"} ```` |
| Ditaa | ```` ```ditaa ```` |
| CSVテーブル | ```` ```csv ```` |
| Python Matplotlib | ```` ```python {cmd=true matplotlib=true} ```` |
| Plotly | ```` ```javascript {cmd=true output="html"} ```` |
| LaTeX図形 | ```` ```latex {cmd=true} ```` |

## 13. MPE独自拡張（プレゼンテーション）

| 記法名 | 記法・構文 |
|---|---|
| スライド区切り | `<!-- slide -->` |
| スライド区切り（属性指定） | `<!-- slide data-background-image="URL" -->` |
| 垂直スライド | `<!-- slide vertical=true -->` |
| スライド背景画像 | `data-background-image="URL"` |
| スライド背景動画・Webページ | `data-background-iframe="URL"` |
| スライド遷移指定 | `data-transition="zoom"` |
| スライド内フラグメント | `<!-- .element: class="fragment" -->` |
| フラグメント順序指定 | `data-fragment-index="1"` |
| スピーカーノート | `<!-- slide data-notes="ノート内容" -->` |
| プレゼンテーション設定 | YAML Front Matter内の `presentation:` |
| プレゼンテーションテーマ | `presentation: theme: white.css` |
| プレゼンテーションサイズ | `presentation: width: 960 / height: 700` |

## 14. MPE拡張（パーサー・設定依存）

| 記法名 | 記法・構文 |
|---|---|
| 定義リスト | `用語` + `: 説明` |
| Callout | `> [!NOTE]` |
| Markdown_yo数式 | `$...$` / `$$...$$` |
| Markdown_yo絵文字 | `:smile:` |
| Markdown_yo Wikiリンク | `[[ページ名]]` |
| Markdown_yo CriticMarkup | `{++ ++}` / `{-- --}` / `{~~ ~~}` |
| Markdown_yo略語 | `*[HTML]: Hyper Text Markup Language` |
| Markdown_yo定義リスト | `用語` + `: 説明` |
| Markdown_yo Admonition | Admonition構文 |
| Markdown_yo Callout | Callout構文 |
| Markdown_yoハイライト | `==文字列==` |
| Markdown_yo上付き文字 | `^{文字列}` |
| Markdown_yo下付き文字 | `_{文字列}` |