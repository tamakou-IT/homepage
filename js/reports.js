document.addEventListener("DOMContentLoaded", async () => {
    const containers = document.querySelectorAll(".site_reports");

    if (containers.length === 0) {
        return;
    }

    try {
        const [templateResponse, listResponse, categoriesResponse] = await Promise.all([
            fetch("data/templates/reportsdesign.html"),
            fetch("data/reports/list.json"),
            fetch("data/reports/categories.json").catch(() => null)
        ]);

        if (!templateResponse.ok) {
            throw new Error(`Template fetch failed: ${templateResponse.status}`);
        }
        const templateHtml = await templateResponse.text();

        const parser = new DOMParser();
        const templateDoc = parser.parseFromString(templateHtml, "text/html");
        const template = templateDoc.querySelector(".card");
        if (!template) {
            throw new Error("Card template not found in reportsdesign.html");
        }

        if (!listResponse.ok) {
            throw new Error(`List fetch failed: ${listResponse.status}`);
        }
        const list = await listResponse.json();

        let categoriesData = { default: "images/reports/test.jpg", categories: {} };
        if (categoriesResponse && categoriesResponse.ok) {
            try {
                categoriesData = await categoriesResponse.json();
            } catch (e) {
                console.warn("Failed to parse categories.json:", e);
            }
        }

        // visible === false の記事を除外し、日付降順でソート
        const visibleList = list.filter(item => item.visible !== false);
        visibleList.sort((a, b) => new Date(b.date) - new Date(a.date));

        containers.forEach(container => {
            const count = container.dataset.count;

            const displayList =
                count === undefined
                    ? visibleList
                    : visibleList.slice(0, Number(count));

            displayList.forEach(item => {
                const card = template.cloneNode(true);

                card.href = `report.html?file=${encodeURIComponent(item.file)}`;

                // タイトル
                const titleEl = card.querySelector(".card_title");
                if (titleEl) {
                    titleEl.textContent = item.title;
                }

                // 画像の判定: picture優先 -> 種別アイコン -> デフォルトアイコン
                const pictureEl = card.querySelector(".card_picture");
                if (pictureEl) {
                    let imagePath = (item.picture && item.picture.trim() !== "") ? item.picture.trim() : null;
                    if (!imagePath) {
                        const catConfig = categoriesData.categories?.[item.category];
                        imagePath = catConfig?.icon || categoriesData.default || "images/reports/test.jpg";
                    }
                    pictureEl.src = imagePath;
                    pictureEl.alt = item.title || "";
                }

                // 日付
                const dateEl = card.querySelector(".card_date");
                if (dateEl) {
                    dateEl.textContent = item.date || "";
                }

                // 種別
                const categoryEl = card.querySelector(".card_category");
                if (categoryEl) {
                    if (item.category && item.category.trim() !== "") {
                        categoryEl.textContent = item.category.trim();
                    } else {
                        categoryEl.style.display = "none";
                    }
                }

                // 著者
                const authorEl = card.querySelector(".card_author");
                const authorNameEl = card.querySelector(".card_author_name");
                if (authorEl && authorNameEl) {
                    if (item.author && item.author.trim() !== "") {
                        authorNameEl.textContent = item.author.trim();
                    } else {
                        authorEl.style.display = "none";
                    }
                }

                container.appendChild(card);
            });
        });
    } catch (error) {
        console.error("活動報告データの読み込みに失敗しました:", error);
        containers.forEach(container => {
            container.innerHTML = '<p class="site_error_message" style="color:#64748b;font-size:0.95rem;padding:16px 0;">活動報告の読み込みに失敗しました。</p>';
        });
    }
});
