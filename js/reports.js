document.addEventListener("DOMContentLoaded", async () => {
    const containers = document.querySelectorAll(".site_reports");

    if (containers.length === 0) {
        return;
    }

    try {
        const templateResponse = await fetch("data/templates/reportsdesign.html");
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

        const listResponse = await fetch("data/reports/list.json");
        if (!listResponse.ok) {
            throw new Error(`List fetch failed: ${listResponse.status}`);
        }
        const list = await listResponse.json();

        list.sort((a, b) => new Date(b.date) - new Date(a.date));

        containers.forEach(container => {
            const count = container.dataset.count;

            const displayList =
                count === undefined
                    ? list
                    : list.slice(0, Number(count));

            displayList.forEach(item => {
                const card = template.cloneNode(true);

                card.href = `report.html?file=${encodeURIComponent(item.file)}`;

                card.querySelector(".card_title").textContent = item.title;

                const picture = card.querySelector(".card_picture");
                picture.src = item.picture;
                picture.alt = item.title;

                card.querySelector(".card_date").textContent = item.date;

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
