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

    } catch (error) {
        console.error("レポートの読み込みに失敗しました:", error);
        showNotFound();
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
