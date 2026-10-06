
document.addEventListener("DOMContentLoaded", async () => {
    const containers = document.querySelectorAll(".site_works");

    if (containers.length === 0) {
        return;
    }

    const templateResponse = await fetch("data/templates/workdesign.html");
    const templateHtml = await templateResponse.text();

    const parser = new DOMParser();
    const templateDoc = parser.parseFromString(templateHtml, "text/html");
    const template = templateDoc.querySelector(".card");

    const listResponse = await fetch("data/works/list.json");
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

            card.href = item.url;

            card.querySelector(".card_title").textContent = item.title;

            const picture = card.querySelector(".card_picture");
            picture.src = item.picture;
            picture.alt = item.title;

            card.querySelector(".card_text").textContent = item.text;
            card.querySelector(".card_date").textContent = item.date;

            container.appendChild(card);
        });
    });
});

