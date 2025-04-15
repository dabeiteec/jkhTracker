document.addEventListener('DOMContentLoaded', async function () {
    const button = document.getElementById('rechargeButton');
    const amountInput = document.getElementById('amount');
    const balanceElement = document.getElementById('balance'); // добавим элемент для баланса

    const userId = localStorage.getItem('userId'); 
    if(!balanceElement){alert("Элемент для отображения баланса не найден."); return;}
    setTimeout(() => {
        amountInput.focus();
    }, 0);
    
    amountInput.value = 500;
    amountInput.min = 100;
    amountInput.max = 5000;

    // Проверка userId и получение баланса
    await handleBalanceDisplay(userId, balanceElement);

    // Обработчик для пополнения баланса
    button.addEventListener('click', async function (event) {
        event.preventDefault(); // ОК
        event.stopPropagation(); // ОК

        const amount = parseInt(amountInput.value);
        if (validateAmount(amount)) {
            if (userId) {           
                await handleRecharge(userId, amount, balanceElement);
            } else {
                alert("Пожалуйста, войдите в систему.");
                window.location.href = "../index.html"; // Перенаправляем на страницу входа
            }
        }
        amountInput.focus(); // Возвращаем фокус на поле ввода суммы
    });
});

// Функция для проверки корректности введенной суммы
function validateAmount(amount) {
    if (isNaN(amount)) {
        alert("Пожалуйста, введите правильную сумму.");
        return false;
    } else if (amount < 100) {
        alert("Сумма не может быть меньше 100 рублей.");
        return false;
    } else if (amount > 5000) {
        alert("Сумма не может быть больше 5000 рублей.");
        return false;
    }
    return true;
}

// Функция для получения и отображения баланса
async function handleBalanceDisplay(userId, balanceElement) {
    if (userId) {
        try {
            const response = await window.api.getUserBalance(userId); // Получаем баланс
            if (response.success) {
                balanceElement.innerHTML = `Баланс: ${response.balance} ₽`; // Обновляем отображение баланса
            } else {
                balanceElement.innerHTML = `Ошибка получения баланса: ${response.message}`;
            }
        } catch (error) {
            console.error('Ошибка:', error);
            alert(`Ошибка при получении баланса: ${error.message}`);
        }
    } else {
        alert("Пожалуйста, войдите в систему.");
        window.location.href = "../index.html"; // Перенаправляем на страницу входа
    }
}

// Функция для пополнения баланса
async function handleRecharge(userId, amount, balanceElement) {
    try {
        const response = await window.api.changeUserBalance(userId, amount); // Пополняем баланс
        if (response.success) {
            alert(`Вы пополнили баланс на ${amount} рублей.`);
            // Обновляем баланс после пополнения
            balanceElement.innerHTML = `Баланс: ${response.user.balance} ₽`;
        } else {
            alert('Ошибка при пополнении баланса: ' + response.message);
        }
    } catch (error) {
        console.error('Ошибка пополнения баланса:', error);
        alert('Произошла ошибка при пополнении баланса.');
    }
}
