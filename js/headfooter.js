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

#site_header {
    position: sticky;
    top: 0;
    z-index: 1000;
    transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    will-change: transform;
}

#site_header.hf_hidden {
    transform: translateY(-100%);
}

.hf_header {

    position: sticky;
    top: 0;
    z-index: 1000;

    display: flex;
    justify-content: space-between;
    align-items: center;

    padding: 16px 32px;

    background: rgba(13, 19, 31, 0.75);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);

    border-bottom: 1px solid rgba(255, 255, 255, 0.1);

    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);

}

/* サイトタイトル */

.hf_title {

    font-size: 1.5rem;
    font-weight: 700;

    color: #ffffff;
    text-decoration: none;

    transition: color .2s;
    transform: translateY(-5px);

}

.hf_title:hover {

    color: #60a5fa;

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

    color: #cbd5e1;
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

    background: #60a5fa;

    transform: scaleX(0);
    transform-origin: center;

    transition: transform .2s;

}

.hf_nav a:hover,
.hf_nav a[aria-current="page"] {

    color: #60a5fa;

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

    background: #0d131f;

    border-top: 1px solid #1e293b;

    color: #94a3b8;

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
.hf_social {
    display: flex;
    justify-content: center;
    gap: 20px;
    margin-bottom: 16px;
}

.hf_social a {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    text-decoration: none;
}

.hf_social i {

    font-size: 32px;

    color: #94a3b8;

    transition:
        color .2s,
        transform .2s;

}

.hf_social a:hover i {

    color: #60a5fa;

    transform: scale(1.15);

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

    // スクロールに応じたヘッダーの出し入れ（下スクロールで隠し、上スクロールで表示）
    initScrollHeader(headerSlot || header);
  }

  function initScrollHeader(headerElement) {
    let lastScrollY = window.scrollY;

    window.addEventListener('scroll', function () {
      const currentScrollY = window.scrollY;

      // ページ最上部（50px以内）では常に表示
      if (currentScrollY <= 50) {
        headerElement.classList.remove('hf_hidden');
        lastScrollY = currentScrollY;
        return;
      }

      // 微小なスクロール（手ブレや数pxの移動）は無視
      if (Math.abs(currentScrollY - lastScrollY) < 5) {
        return;
      }

      if (currentScrollY > lastScrollY) {
        // 下スクロール → 画面外へ隠す
        headerElement.classList.add('hf_hidden');
      } else {
        // 上スクロール → スムーズに表示
        headerElement.classList.remove('hf_hidden');
      }

      lastScrollY = currentScrollY;
    }, { passive: true });
  }

  // <head> で読み込まれても <body> 末尾で読み込まれても動くようにする
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', insert);
  } else {
    insert();
  }
})();
