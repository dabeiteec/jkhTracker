const users = [
    { username: "ivanov", service: "Газ", debt: 520 },
    { username: "petrov", service: "Вода", debt: 300 },
    { username: "sidorov", service: "Электричество", debt: 740 },
    { username: "maria", service: "Вода", debt: 0 }, // можно фильтровать
];

const container = document.getElementById("usersContainer");

users
    .filter(user => user.debt > 0)
    .forEach(user => {
        const card = document.createElement("div");
        card.className = "user-card";

        card.innerHTML = `
            <h2>${user.username}</h2>
            <div class="user-info">
                <span>Услуга:</span> ${user.service}<br />
                <span>Задолженность:</span> ${user.debt} ₽
            </div>
            <div class="notify-button">
                <button class="button">Уведомить</button>
            </div>
        `;

        container.appendChild(card);
    });
