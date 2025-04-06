// Заглушка: данные по услугам
const services = [
    { id: 1, name: "Газ", pricePerUnit: 6.5 },
    { id: 2, name: "Вода", pricePerUnit: 4.2 },
    { id: 3, name: "Электричество", pricePerUnit: 5.8 },
];

const servicesContainer = document.getElementById('servicesContainer');

services.forEach(service => {
    const card = document.createElement('div');
    card.className = 'service-card';

    card.innerHTML = `
        <div class="service-header">${service.name}</div>
        <div class="input-group">
            <label for="input-${service.id}">Показания:</label>
            <input type="number" class="custom-input" id="input-${service.id}" min="0" />
        </div>
        <div class="pay-button">
            <button class="button">Оплатить ${service.name}</button>
        </div>
    `;

    servicesContainer.appendChild(card);
});
