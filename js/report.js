/**
 * report.js
 * URLパラメータ ?file=xxx.md で指定されたMarkdownファイルを取得し、
 * HTMLへ変換して #site_report に描画する。
 */
document.addEventListener("DOMContentLoaded", async () => {
    const reportContainer = document.getElementById("site_report");
    if (!reportContainer) return;

    const urlParams = new URLSearchParams(window.location.search);
    const fileName = urlParams.get("file");

    // 1. file パラメータが空の場合は reports.html にリダイレクト
    if (!fileName || fileName.trim() === "") {
        window.location.href = "reports.html";
        return;
    }

    // セキュリティ対策: パス走査（../など）や不正な文字を防止
    if (fileName.includes("..") || fileName.includes("/") || fileName.includes("\\")) {
        showNotFound();
        return;
    }

    try {
        // 2. data/reports/ から Markdown ファイルを取得
        const response = await fetch(`data/reports/${encodeURIComponent(fileName)}`);

        if (!response.ok) {
            showNotFound();
            return;
        }

        const mdText = await response.text();

        // KaTeX 数式拡張を初期化
        initMathExtensions();

        // 3. marked を用いて Markdown を HTML にパース
        // marked は report.html で UMD 形式で読み込まれている (window.marked)
        const parseMarkdown = (window.marked && window.marked.parse) 
            ? window.marked.parse 
            : (text) => text;

        reportContainer.innerHTML = parseMarkdown(mdText, {
            breaks: true,
            gfm: true
        });

        // 4. 最初の見出し (h1) があれば、ページタイトルに反映
        const firstH1 = reportContainer.querySelector("h1");
        if (firstH1 && firstH1.textContent.trim()) {
            document.title = `${firstH1.textContent.trim()} | 情報技術サークル`;
        }

        // 5. 前後の記事へのナビゲーションリンクを生成・挿入
        await setupPagination(fileName, reportContainer);

    } catch (error) {
        console.error("レポートの読み込みに失敗しました:", error);
        showNotFound();
    }

    // KaTeX 数式拡張の設定
    function initMathExtensions() {
        if (!window.marked || !window.katex || window.__marked_katex_registered) return;

        const mathBlockExtension = {
            name: "mathBlock",
            level: "block",
            start(src) {
                const idx1 = src.indexOf('\[');
                const idx2 = src.indexOf('$$');
                if (idx1 === -1) return idx2;
                if (idx2 === -1) return idx1;
                return Math.min(idx1, idx2);
            },
            tokenizer(src) {
                // \[ ... \]
                const matchBracket = src.match(/^\\\[([\s\S]+?)\\\]/);
                if (matchBracket) {
                    return {
                        type: "mathBlock",
                        raw: matchBracket[0],
                        text: matchBracket[1].trim(),
                        display: true
                    };
                }
                // $$ ... $$
                const matchDollar = src.match(/^\$\$([\s\S]+?)\$\$/);
                if (matchDollar) {
                    return {
                        type: "mathBlock",
                        raw: matchDollar[0],
                        text: matchDollar[1].trim(),
                        display: true
                    };
                }
            },
            renderer(token) {
                try {
                    return '<div class="katex-display-wrapper">' + window.katex.renderToString(token.text, {
                        displayMode: true,
                        throwOnError: false,
                        strict: false
                    }) + '</div>\n';
                } catch (err) {
                    console.error("KaTeX block render error:", err);
                    return '<div class="katex-display-wrapper"><pre class="katex-error">' + escapeHtml(token.text) + '</pre></div>\n';
                }
            }
        };

        const mathInlineExtension = {
            name: "mathInline",
            level: "inline",
            start(src) {
                const idx1 = src.indexOf('\\(');
                const idx2 = src.indexOf('$');
                if (idx1 === -1) return idx2;
                if (idx2 === -1) return idx1;
                return Math.min(idx1, idx2);
            },
            tokenizer(src) {
                // \( ... \)
                const matchParen = src.match(/^\\\((.+?)\\\)/s);
                if (matchParen) {
                    return {
                        type: "mathInline",
                        raw: matchParen[0],
                        text: matchParen[1].trim(),
                        display: false
                    };
                }
                // $ ... $
                const matchDollar = src.match(/^\$([^$\n]+?)\$/);
                if (matchDollar) {
                    return {
                        type: "mathInline",
                        raw: matchDollar[0],
                        text: matchDollar[1].trim(),
                        display: false
                    };
                }
            },
            renderer(token) {
                try {
                    return window.katex.renderToString(token.text, {
                        displayMode: false,
                        throwOnError: false,
                        strict: false
                    });
                } catch (err) {
                    console.error("KaTeX inline render error:", err);
                    return '<span class="katex-error">' + escapeHtml(token.text) + '</span>';
                }
            }
        };

        window.marked.use({ extensions: [mathBlockExtension, mathInlineExtension] });
        window.__marked_katex_registered = true;
    }

    // 前後の記事ナビゲーション設定
    async function setupPagination(currentFile, container) {
        try {
            const listRes = await fetch("data/reports/list.json");
            if (!listRes.ok) return;

            const list = await listRes.json();
            // 日付の降順（新しい順）にソート
            list.sort((a, b) => new Date(b.date) - new Date(a.date));

            const currentIndex = list.findIndex(item => item.file === currentFile);
            if (currentIndex === -1) return;

            // 新しい記事（降順なのでインデックスが -1）
            const nextArticle = currentIndex > 0 ? list[currentIndex - 1] : null;
            // 古い記事（降順なのでインデックスが +1）
            const prevArticle = currentIndex < list.length - 1 ? list[currentIndex + 1] : null;

            if (!prevArticle && !nextArticle) return;

            const nav = document.createElement("nav");
            nav.className = "report_pagination";
            nav.setAttribute("aria-label", "前後の記事");

            // 前の記事（過去の記事）
            const prevHtml = prevArticle
                ? `
                <a class="report_pagination_link report_pagination_prev" href="report.html?file=${encodeURIComponent(prevArticle.file)}">
                    <i class="fa-solid fa-chevron-left"></i>
                    <div class="report_pagination_content">
                        <span class="report_pagination_label">前の記事</span>
                        <span class="report_pagination_title">${escapeHtml(prevArticle.title)}</span>
                    </div>
                </a>`
                : `<div class="report_pagination_placeholder"></div>`;

            // 一覧へ戻るボタン
            const listHtml = `
                <a class="report_pagination_list" href="reports.html" aria-label="レポート一覧へ戻る" title="レポート一覧へ">
                    <i class="fa-solid fa-grip"></i>
                    <span>一覧へ</span>
                </a>`;

            // 次の記事（新しい記事）
            const nextHtml = nextArticle
                ? `
                <a class="report_pagination_link report_pagination_next" href="report.html?file=${encodeURIComponent(nextArticle.file)}">
                    <div class="report_pagination_content">
                        <span class="report_pagination_label">次の記事</span>
                        <span class="report_pagination_title">${escapeHtml(nextArticle.title)}</span>
                    </div>
                    <i class="fa-solid fa-chevron-right"></i>
                </a>`
                : `<div class="report_pagination_placeholder"></div>`;

            nav.innerHTML = prevHtml + listHtml + nextHtml;
            container.appendChild(nav);

        } catch (e) {
            console.warn("ナビゲーションの生成に失敗しました:", e);
        }
    }

    function escapeHtml(str) {
        if (!str) return "";
        return str
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    // 404 / 読み込み失敗メッセージ表示
    function showNotFound() {
        reportContainer.innerHTML = `
            <div class="report_not_found">
                <p class="report_not_found_title">お探しのページは見つかりませんでした</p>
                <a class="report_not_found_link" href="index.html">トップに戻る</a>
            </div>
        `;
    }
});
