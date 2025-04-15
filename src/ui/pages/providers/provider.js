document.addEventListener('DOMContentLoaded', async function () {
    const servicesContainer = document.getElementById('servicesContainer');
    const userId = localStorage.getItem('userId'); // Получаем userId

    // Проверка на наличие userId
    if (!userId) {
        alert('Пожалуйста, войдите в систему.');
        window.location.href = "../index.html"; // Перенаправляем на страницу входа
        return;
    }

    try {
        const utilities = await getAllUtilities(); // Получаем все утилиты
        utilities.forEach(service => {
            const serviceCard = createServiceCard(service); // Создаем карточку для каждой утилиты
            servicesContainer.appendChild(serviceCard); // Вставляем карточку в контейнер
        });
    } catch (error) {
        console.error('Ошибка при получении утилит:', error);
        alert('Ошибка при загрузке услуг.');
    }
});

// Функция для создания карточки утилиты
function createServiceCard(service) {
    const card = document.createElement('div');
    card.className = 'service-card';

    // Создаем HTML для карточки
    card.innerHTML = `
        <div class="service-header">${service.name}</div>
        <div class="service-info">
            Цена за единицу: ${service.price_per_unit} ₽<br>
            Компания: ${service.company}
        </div>
        <button class="add-button" data-service-id="${service.id}">+ Подключить</button>
    `;

    // Получаем кнопку
    const addButton = card.querySelector('.add-button');

    // Добавляем обработчик для кнопки "Подключить"
    if (addButton) {
        addButton.addEventListener('click', function () {
            const serviceId = addButton.getAttribute('data-service-id');
            addUtilityToUser(userId, serviceId); // Добавляем услугу пользователю
        });
    } else {
        console.error('Ошибка: кнопка не найдена');
    }

    return card;
}

// Функция для получения всех утилит с сервера
async function getAllUtilities() {
    try {
        const response = await window.api.getAllUtilities();
        if (response.success) {
            return response.utilities; // Возвращаем список утилит
        } else {
            throw new Error('Не удалось получить утилиты');
        }
    } catch (error) {
        alert(`Не удалось загрузить утилиты. ${error}`);
    }
}

// Функция для добавления утилиты пользователю
async function addUtilityToUser(userId, serviceId) {
    try {
        const response = await window.api.addUtilityToUser(userId, serviceId);
        if (response.success) {
            alert(`Услуга успешно добавлена: ${response.message}`);
        } else {
            throw new Error('Не удалось добавить услугу');
        }
    } catch (error) {
        alert(`Не удалось добавить услугу. ${error}`);
    }
}
