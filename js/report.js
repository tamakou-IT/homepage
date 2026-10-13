import { marked } from "https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.js";

const qstring = window.location.search;
const urlParams = new URLSearchParams(qstring);
const fileName = urlParams.get('file');

// 即時実行の非同期関数 (IIFE)
(async () => {
    try {
        // 1. Markdownファイルの取得
        const mdContent = await fetch(`data/reports/${fileName}`);
        
        if (!mdContent.ok) {
            throw new Error(`HTTP error! status: ${mdContent.status}`);
        }
        
        // 2. テキストデータの抽出
        const mdText = await mdContent.text();
        
        // 3. 【修正位置】テキストが取得できた後に、パースして画面に出力する
        document.getElementById('site_report').innerHTML = marked.parse(mdText, { breaks: true });
        
    } catch (e) {
        console.error(e);
        alert('レポートの読み込みに失敗しました。');
        window.location.href = 'reports.html'; // エラー時にレポート一覧ページにリダイレクト
    }
})();
