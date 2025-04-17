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
        utilities.forEach((service, index) => {
            const serviceCard = document.getElementById(`service-card-${index + 1}`);
            const priceElement = serviceCard.querySelector('.price-per-unit');
            const companyElement = serviceCard.querySelector('.company');
            const addButton = serviceCard.querySelector('.add-button');

            // Заполняем данные в карточке
            priceElement.textContent = service.price_per_unit; // Заполняем цену
            companyElement.textContent = service.company; // Заполняем компанию

            // Добавляем обработчик для кнопки "Подключить"
            addButton.addEventListener('click', async function () {
                const serviceId = addButton.getAttribute('data-service-id');
                await addUtilityToUser(userId, serviceId); // Добавляем услугу пользователю
                addButton.disabled = true; // Блокируем кнопку, если услуга была успешно добавлена
                addButton.innerText = 'Подключено'; // Изменяем текст на кнопке
            });
        });
    } catch (error) {
        console.error('Ошибка при получении утилит:', error);
        alert('Ошибка при загрузке услуг.');
    }
});

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
            alert(response.message);
        } else {
            throw new Error(response.message);
        }
    } catch (error) {
        alert(`Не удалось добавить услугу. ${error.message}`);
    }
}
