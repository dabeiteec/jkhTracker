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

document.addEventListener('DOMContentLoaded', async function () {
    // Навигация
    const depositButton = document.getElementById('toDeposit');
    depositButton.addEventListener('click', function () {
        window.location.href = "../deposit/payment.html";
    });
    const providerButton = document.getElementById('toProvider');
    providerButton.addEventListener('click', function () {
        window.location.href = "../providers/provider.html";
    });
    const balanceElement = document.getElementById('balance');
    const userId = localStorage.getItem('userId');
    
    if (userId) {
        try {
            const response = await window.api.getUserBalance(userId);
            if (response.success) {
                balanceElement.innerHTML = `Баланс: ${response.balance} ₽`;
            } else {
                balanceElement.innerHTML = `Ошибка получения баланса: ${response.message}`;
            }
        } catch (error) {
            balanceElement.innerHTML = `Произошла ошибка: ${error.message}`;
        }
    } else {
        balanceElement.innerHTML = 'Пользователь не найден. Пожалуйста, войдите заново.';
    }
});