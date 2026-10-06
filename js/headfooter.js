/**
 * headfooter.js
 * 全ページ共通のヘッダー/フッターを自動挿入する。
 *
 * - html/css はJS内に直書き(fetchによる表示遅延を避けるため)
 * - <div id="site_header"></div> があればその中に、なければページ先頭に挿入
 * - <div id="site_footer"></div> があればその中に、なければページ末尾に挿入
 * - すべてのリンクは先頭 `/` なしの相対パス(GitHub Pages プロジェクトページ対応)
 */
(function () {
  'use strict';

  /* ------------------------------------------------------------
   * CSS(common.css には header/footer の CSS を含めない方針のためここで注入)
   * クラス名は他CSSとの衝突を避けるため hf_ を接頭辞にする
   * ---------------------------------------------------------- */
  const CSS = `
    .hf_header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 0.5rem 1.5rem;
      padding: 0.75rem 1.5rem;
      background: #fff;
      border-bottom: 1px solid #ddd;
      box-sizing: border-box;
    }
    .hf_title {
      font-size: 1.25rem;
      font-weight: bold;
      color: inherit;
      text-decoration: none;
    }
    .hf_nav {
      display: flex;
      flex-wrap: wrap;
      gap: 0.25rem 1.25rem;
      margin: 0;
      padding: 0;
      list-style: none;
    }
    .hf_nav a {
      color: inherit;
      text-decoration: none;
      padding: 0.25rem 0;
      border-bottom: 2px solid transparent;
    }
    .hf_nav a:hover,
    .hf_nav a:focus-visible,
    .hf_nav a[aria-current="page"] {
      border-bottom-color: currentColor;
    }
    .hf_footer {
      padding: 1.5rem;
      text-align: center;
      font-size: 0.85rem;
      color: #666;
      background: #f7f7f7;
      border-top: 1px solid #ddd;
      box-sizing: border-box;
    }
  `;

  /* ------------------------------------------------------------
   * HTML(ヘッダー/フッターの中身を変更する場合はここを書き換える)
   * ---------------------------------------------------------- */
  const HEADER_HTML = `
    <header class="hf_header">
      <a class="hf_title" href="index.html">サークル名</a>
      <nav aria-label="メインナビゲーション">
        <ul class="hf_nav">
          <li><a href="index.html">ホーム</a></li>
          <li><a href="works.html">作品</a></li>
          <li><a href="reports.html">レポート</a></li>
        </ul>
      </nav>
    </header>
  `;

  const FOOTER_HTML = `
    <footer class="hf_footer">
      <p>&copy; <span class="hf_year"></span> サークル名</p>
    </footer>
  `;

  /* ------------------------------------------------------------
   * 挿入処理
   * ---------------------------------------------------------- */

  // 現在のページのファイル名(ルート直下のページのみなので末尾要素で判定)
  function currentPage() {
    const name = location.pathname.split('/').pop();
    return name === '' ? 'index.html' : name;
  }

  // 同じスタイルを二重に注入しない
  function injectStyle() {
    if (document.getElementById('hf_style')) return;
    const style = document.createElement('style');
    style.id = 'hf_style';
    style.textContent = CSS;
    document.head.appendChild(style);
  }

  // HTML文字列を要素に変換する
  function toElement(html) {
    const tpl = document.createElement('template');
    tpl.innerHTML = html.trim();
    return tpl.content.firstElementChild;
  }

  function insert() {
    injectStyle();

    // ヘッダー: #site_header があればその中、なければ <body> の先頭
    const header = toElement(HEADER_HTML);
    const page = currentPage();
    header.querySelectorAll('.hf_nav a').forEach(function (a) {
      if (a.getAttribute('href') === page) a.setAttribute('aria-current', 'page');
    });
    const headerSlot = document.getElementById('site_header');
    if (headerSlot) {
      headerSlot.appendChild(header);
    } else {
      document.body.insertBefore(header, document.body.firstChild);
    }

    // フッター: #site_footer があればその中、なければ <body> の末尾
    const footer = toElement(FOOTER_HTML);
    footer.querySelector('.hf_year').textContent = new Date().getFullYear();
    const footerSlot = document.getElementById('site_footer');
    if (footerSlot) {
      footerSlot.appendChild(footer);
    } else {
      document.body.appendChild(footer);
    }
  }

  // <head> で読み込まれても <body> 末尾で読み込まれても動くようにする
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', insert);
  } else {
    insert();
  }
})();
