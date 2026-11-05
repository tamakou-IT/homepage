/**
 * report.js
 * URLパラメータ ?file=xxx.md で指定されたMarkdownファイルを取得し、
 * HTMLへ変換して #site_report に描画する。
 */
document.addEventListener("DOMContentLoaded", async () => {
    const reportContainer = document.getElementById("site_report");
    if (!reportContainer) return;

    const urlParams = new URLSearchParams(window.location.search);
    const rawFileName = urlParams.get("file");

    // 1. file パラメータが空の場合は reports.html にリダイレクト
    if (!rawFileName || rawFileName.trim() === "") {
        window.location.href = "reports.html";
        return;
    }

    // パス指定が付いている場合でも安全にファイル名部分を抽出 (例: data/reports/test.md -> test.md)
    let fileName = rawFileName.trim().replace(/^[./\\]*(data[./\\]+reports[./\\]+)?/, "");

    // セキュリティ対策: パス走査（../など）による親ディレクトリ脱出を防止
    if (fileName.includes("..") || fileName.includes("/") || fileName.includes("\\")) {
        showNotFound();
        return;
    }

    try {
        // 2. data/reports/ から Markdown ファイルを取得
        // 環境によるURLエンコードの差異を吸収するためフォールバックを実装
        let response = await fetch(`data/reports/${encodeURIComponent(fileName)}`);

        if (!response.ok) {
            response = await fetch(`data/reports/${fileName}`);
        }
        if (!response.ok) {
            try {
                response = await fetch(`data/reports/${decodeURIComponent(fileName)}`);
            } catch (_) {}
        }

        if (!response.ok) {
            showNotFound();
            return;
        }

        const mdText = await response.text();

        // marked拡張の初期化（数式、マーカー、Mermaid、コードハイライトなど）
        initMarkedExtensions();

        // 3. marked を用いて Markdown を HTML にパース
        const parseMarkdown = (window.marked && window.marked.parse) 
            ? window.marked.parse 
            : (text) => text;

        reportContainer.innerHTML = parseMarkdown(mdText, {
            breaks: true,
            gfm: true
        });

        // 4. アラート記法の変換処理 (> [!NOTE] 等)
        processAlerts(reportContainer);

        // 5. 目次 (TOC) の生成・挿入
        processTableOfContents(reportContainer);

        // 6. コードブロックのシンタックスハイライト (highlight.js)
        if (window.hljs) {
            reportContainer.querySelectorAll("pre code:not(.language-mermaid)").forEach((block) => {
                window.hljs.highlightElement(block);
            });
        }

        // 7. Mermaid ダイアグラムのレンダリング (GitHub標準仕様)
        if (window.mermaid) {
            const mermaidNodes = reportContainer.querySelectorAll(".mermaid");
            if (mermaidNodes.length > 0) {
                try {
                    window.mermaid.initialize({
                        startOnLoad: false,
                        theme: "dark",
                        securityLevel: "loose",
                        themeVariables: {
                            darkMode: true,
                            background: "#0d1117",
                            mainBkg: "#161b22",
                            nodeBorder: "#1f6feb",
                            lineColor: "#1f6feb",
                            textColor: "#f0f6fc",
                            nodeTextColor: "#ffffff",
                            edgeLabelBackground: "transparent",
                            clusterBkg: "#0d1117",
                            clusterBorder: "#30363d",
                            titleColor: "#f0f6fc",
                            actorBkg: "#161b22",
                            actorBorder: "#1f6feb",
                            actorTextColor: "#ffffff",
                            actorLineColor: "#1f6feb",
                            signalColor: "#1f6feb",
                            signalTextColor: "#f0f6fc"
                        }
                    });
                    await window.mermaid.run({
                        nodes: mermaidNodes
                    });

                    // GitHub風 Mermaid操作ツールバーを初期化
                    initMermaidToolbars(reportContainer);
                } catch (mermaidError) {
                    console.error("Mermaid rendering error:", mermaidError);
                }
            }
        }

        // 8. 最初の見出し (h1) があれば、ページタイトルに反映
        const firstH1 = reportContainer.querySelector("h1");
        if (firstH1 && firstH1.textContent.trim()) {
            document.title = `${firstH1.textContent.trim()} | 情報技術サークル`;
        }

        // 9. 前後の記事へのナビゲーションリンクを生成・挿入
        await setupPagination(fileName, reportContainer);

    } catch (error) {
        console.error("レポートの読み込みに失敗しました:", error);
        showNotFound();
    }

    // marked 拡張の初期化
    function initMarkedExtensions() {
        if (!window.marked || window.__marked_custom_extensions_registered) return;

        // ブロック数式拡張 (\[ ... \], $$ ... $$)
        const mathBlockExtension = {
            name: "mathBlock",
            level: "block",
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
                if (!window.katex) return escapeHtml(token.raw);
                try {
                    const rendered = window.katex.renderToString(token.text, {
                        displayMode: true,
                        throwOnError: false,
                        strict: false
                    });
                    return '<div class="katex-display-wrapper">' + rendered + '</div>';
                } catch (err) {
                    console.error("KaTeX block render error:", err);
                    return '<div class="katex-error">' + escapeHtml(token.text) + '</div>';
                }
            }
        };

        // インライン数式拡張 (\( ... \), $ ... $)
        const mathInlineExtension = {
            name: "mathInline",
            level: "inline",
            start(src) {
                const match = src.match(/\\\(|\$/);
                return match ? match.index : -1;
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
                if (!window.katex) return escapeHtml(token.raw);
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

        // マーカー風テキスト拡張 (==テキスト==)
        const markerExtension = {
            name: "marker",
            level: "inline",
            start(src) {
                return src.indexOf("==");
            },
            tokenizer(src) {
                const match = src.match(/^==((?:\\=|[^\n=])+?)==/);
                if (match) {
                    return {
                        type: "marker",
                        raw: match[0],
                        text: match[1]
                    };
                }
            },
            renderer(token) {
                return `<mark class="md-marker">${this.parser.parseInline(token.tokens || []) || escapeHtml(token.text)}</mark>`;
            }
        };

        // marked レンダラーのカスタマイズ (GitHub Mermaidプレビュー準拠)
        const renderer = {
            code(token) {
                const code = typeof token === "object" ? (token.text || "") : (token || "");
                const lang = typeof token === "object" ? ((token.lang || "").match(/\S*/)?.[0] || "") : "";

                if (lang === "mermaid") {
                    return `<div class="mermaid-wrapper"><div class="mermaid-container"><pre class="mermaid">${escapeHtml(code)}</pre></div></div>\n`;
                }
                return false;
            }
        };

        window.marked.use({
            extensions: [mathBlockExtension, mathInlineExtension, markerExtension],
            renderer: renderer
        });
        window.__marked_custom_extensions_registered = true;
    }

    // アラート記法 (> [!NOTE] 等) の後処理
    function processAlerts(container) {
        const alertConfig = {
            NOTE: {
                className: "md-alert-note",
                icon: "fa-solid fa-circle-info",
                title: "Note"
            },
            TIP: {
                className: "md-alert-tip",
                icon: "fa-solid fa-lightbulb",
                title: "Tip"
            },
            IMPORTANT: {
                className: "md-alert-important",
                icon: "fa-solid fa-circle-exclamation",
                title: "Important"
            },
            WARNING: {
                className: "md-alert-warning",
                icon: "fa-solid fa-triangle-exclamation",
                title: "Warning"
            },
            CAUTION: {
                className: "md-alert-caution",
                icon: "fa-solid fa-circle-xmark",
                title: "Caution"
            }
        };

        const blockquotes = container.querySelectorAll("blockquote");
        blockquotes.forEach((bq) => {
            const firstP = bq.querySelector("p");
            if (!firstP) return;

            const text = firstP.innerHTML.trim();
            const match = text.match(/^\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]/i);
            if (match) {
                const type = match[1].toUpperCase();
                const config = alertConfig[type];
                if (!config) return;

                bq.classList.add("md-alert", config.className);

                // 先頭の [!TYPE] を削除
                firstP.innerHTML = text.replace(/^\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\s*(<br\s*\/?>)?/i, "").trim();

                // ヘッダー要素を作成して先頭に挿入
                const header = document.createElement("div");
                header.className = "md-alert-title";
                header.innerHTML = `<i class="${config.icon}"></i><span>${config.title}</span>`;
                bq.insertBefore(header, bq.firstChild);

                // firstP が空になった場合は削除
                if (!firstP.textContent.trim() && firstP.children.length === 0) {
                    firstP.remove();
                }
            }
        });
    }

    // 目次 (TOC: Table of Contents) の自動生成
    function processTableOfContents(container) {
        // <!-- toc --> または [TOC] の検出
        // marked 変換後、<!-- toc --> はHTMLコメントまたは無視され、[TOC] は <p>[TOC]</p> または <p><a href="...">TOC</a></p> になる
        const walker = document.createTreeWalker(container, NodeFilter.SHOW_COMMENT | NodeFilter.SHOW_ELEMENT);
        let tocPlaceholderNode = null;

        while (walker.nextNode()) {
            const node = walker.currentNode;
            if (node.nodeType === Node.COMMENT_NODE && node.nodeValue.trim().toLowerCase() === "toc") {
                tocPlaceholderNode = node;
                break;
            } else if (node.nodeType === Node.ELEMENT_NODE && node.tagName === "P") {
                if (node.textContent.trim() === "[TOC]") {
                    tocPlaceholderNode = node;
                    break;
                }
            }
        }

        if (!tocPlaceholderNode) return;

        // 見出し（h2, h3, h4）を収集
        const headings = container.querySelectorAll("h2, h3, h4");
        if (headings.length === 0) {
            if (tocPlaceholderNode.parentNode) tocPlaceholderNode.remove();
            return;
        }

        const tocContainer = document.createElement("div");
        tocContainer.className = "md-toc";
        tocContainer.innerHTML = '<div class="md-toc-title"><i class="fa-solid fa-list-ul"></i><span>目次</span></div>';

        const tocList = document.createElement("ul");
        tocList.className = "md-toc-list";

        headings.forEach((heading, index) => {
            const level = parseInt(heading.tagName.substring(1), 10);
            if (!heading.id) {
                heading.id = `heading-${index + 1}-${encodeURIComponent(heading.textContent.trim().toLowerCase().replace(/\s+/g, "-"))}`;
            }

            const item = document.createElement("li");
            item.className = `md-toc-item md-toc-level-${level}`;

            const link = document.createElement("a");
            link.href = `#${heading.id}`;
            link.textContent = heading.textContent.trim();
            item.appendChild(link);

            tocList.appendChild(item);
        });

        tocContainer.appendChild(tocList);
        tocPlaceholderNode.parentNode.replaceChild(tocContainer, tocPlaceholderNode);
    }

    // 前後の記事ナビゲーション設定
    async function setupPagination(currentFile, container) {
        try {
            const listRes = await fetch("data/reports/list.json");
            if (!listRes.ok) return;

            const listJson = await listRes.json();
            // visible !== false の記事のみを対象として日付降順ソート
            const list = listJson.filter(item => item.visible !== false);
            list.sort((a, b) => new Date(b.date) - new Date(a.date));

            const decodedCurrent = decodeURIComponent(currentFile);
            const currentIndex = list.findIndex(item => item.file === currentFile || item.file === decodedCurrent);

            // list.json に登録されていない（または非表示の）記事の場合でも「一覧へ戻る」ボタンを表示
            if (currentIndex === -1) {
                const nav = document.createElement("nav");
                nav.className = "report_pagination";
                nav.setAttribute("aria-label", "ナビゲーション");
                nav.innerHTML = `
                    <div class="report_pagination_placeholder"></div>
                    <a class="report_pagination_list" href="reports.html" aria-label="レポート一覧へ戻る" title="レポート一覧へ">
                        <i class="fa-solid fa-grip"></i>
                        <span>一覧へ</span>
                    </a>
                    <div class="report_pagination_placeholder"></div>
                `;
                container.appendChild(nav);
                return;
            }

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
    
    // GitHub風 Mermaid 操作ツールバーの実装
    function initMermaidToolbars(container) {
        const containers = container.querySelectorAll(".mermaid-container");
        containers.forEach((box) => {
            const svg = box.querySelector("svg");
            if (!svg) return;

            let scale = 1;
            let translateX = 0;
            let translateY = 0;
            let isDragging = false;
            let startX = 0;
            let startY = 0;

            const updateTransform = () => {
                svg.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
                svg.style.transformOrigin = "center center";
                svg.style.transition = isDragging ? "none" : "transform 0.15s ease-out";
            };

            const toolbar = document.createElement("div");
            toolbar.className = "mermaid-toolbar";
            toolbar.innerHTML = `
                <button type="button" class="mermaid-toolbar-btn btn-pan" title="ドラッグで移動" aria-label="ドラッグで移動">
                    <i class="fa-solid fa-up-down-left-right"></i>
                </button>
                <button type="button" class="mermaid-toolbar-btn btn-zoom-out" title="縮小" aria-label="縮小">
                    <i class="fa-solid fa-magnifying-glass-minus"></i>
                </button>
                <button type="button" class="mermaid-toolbar-btn btn-zoom-in" title="拡大" aria-label="拡大">
                    <i class="fa-solid fa-magnifying-glass-plus"></i>
                </button>
                <button type="button" class="mermaid-toolbar-btn btn-reset" title="全体を表示" aria-label="全体を表示">
                    <i class="fa-solid fa-expand"></i>
                </button>
            `;

            box.appendChild(toolbar);

            toolbar.querySelector(".btn-zoom-in").addEventListener("click", () => {
                scale = Math.min(scale * 1.25, 4);
                updateTransform();
            });

            toolbar.querySelector(".btn-zoom-out").addEventListener("click", () => {
                scale = Math.max(scale / 1.25, 0.4);
                updateTransform();
            });

            toolbar.querySelector(".btn-reset").addEventListener("click", () => {
                scale = 1;
                translateX = 0;
                translateY = 0;
                updateTransform();
            });

            box.addEventListener("mousedown", (e) => {
                if (e.target.closest(".mermaid-toolbar")) return;
                isDragging = true;
                startX = e.clientX - translateX;
                startY = e.clientY - translateY;
                box.style.cursor = "grab";
            });

            window.addEventListener("mousemove", (e) => {
                if (!isDragging) return;
                translateX = e.clientX - startX;
                translateY = e.clientY - startY;
                box.style.cursor = "grabbing";
                updateTransform();
            });

            window.addEventListener("mouseup", () => {
                if (!isDragging) return;
                isDragging = false;
                box.style.cursor = "default";
                updateTransform();
            });
        });
    }

    function showNotFound() {
        reportContainer.innerHTML = `
            <div class="report_not_found">
                <p class="report_not_found_title">お探しのページは見つかりませんでした</p>
                <a class="report_not_found_link" href="index.html">トップに戻る</a>
            </div>
        `;
    }
});
