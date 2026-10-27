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
    /* ==========================================================
   Header
   ========================================================== */

.hf_header {

    display: flex;
    justify-content: space-between;
    align-items: center;

    padding: 18px 32px;

    background: #ffffff;

    border-bottom: 1px solid #e6e6e6;

    box-shadow: 0 2px 8px rgba(0,0,0,.04);

}

/* サイトタイトル */

.hf_title {

    font-size: 1.5rem;
    font-weight: 700;

    color: #222;
    text-decoration: none;

    transition: color .2s;
    transform: translateY(-5px);

}

.hf_title:hover {

    color: #2f80ed;

}
.hf_title img {

    width: 36px;
    height: 36px;
    transform: translateY(8px);
    object-fit: contain;

    flex-shrink: 0;

}
/* ナビゲーション */

.hf_nav {

    display: flex;

    gap: 32px;

    margin: 0;
    padding: 0;

    list-style: none;

}

.hf_nav a {

    position: relative;

    color: #444;
    text-decoration: none;

    font-size: 1rem;
    font-weight: 500;

    transition: color .2s;

}

/* 下線アニメーション */

.hf_nav a::after {

    content: "";

    position: absolute;

    left: 0;
    bottom: -6px;

    width: 100%;
    height: 2px;

    background: #2f80ed;

    transform: scaleX(0);
    transform-origin: center;

    transition: transform .2s;

}

.hf_nav a:hover,
.hf_nav a[aria-current="page"] {

    color: #2f80ed;

}

.hf_nav a:hover::after,
.hf_nav a[aria-current="page"]::after {

    transform: scaleX(1);

}

/* ==========================================================
   Footer
   ========================================================== */

.hf_footer {

    margin-top: 64px;

    padding: 32px 24px;

    text-align: center;

    background: #ffffff;

    border-top: 1px solid #e6e6e6;

    color: #777;

    font-size: .9rem;

}

/* ==========================================================
   Responsive
   ========================================================== */

@media (max-width: 768px) {

    .hf_header {

        flex-direction: column;

        gap: 18px;

        padding: 20px;

    }

    .hf_nav {

        gap: 20px;

        flex-wrap: wrap;

        justify-content: center;

    }
  
}
.hf_social i {

    font-size: 24px;

    color: #555;

    transition:
        color .2s,
        transform .2s;

}

.hf_social a:hover i {

    color: #2f80ed;

    transform: scale(1.1);

}
  `;

  /* ------------------------------------------------------------
   * HTML(ヘッダー/フッターの中身を変更する場合はここを書き換える)
   * ---------------------------------------------------------- */
  const HEADER_HTML = `
    <header class="hf_header">
      <a class="hf_title" href="index.html">
        <img src="images/icon.svg" alt="ITサークル ロゴ">
        <span>ITサークル</span>
      </a>
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
      <div class="hf_social">
        <a href="https://www.instagram.com/tama_itcircle?dlrf=bnpsenRqcGo1OG51" aria-label="Instagram">
           <i class="fa-brands fa-instagram"></i>
        </a>
        <a href="https://x.com/TAMA_ITcircle" aria-label="X">
          <i class="fa-brands fa-x-twitter"></i>
        </a>
      </div>
      <p>&copy; <span class="hf_year"></span> ITcircle</p>
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
