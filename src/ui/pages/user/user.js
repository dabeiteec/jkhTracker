document.addEventListener('DOMContentLoaded', async function () {
    const balanceElement = document.getElementById('balance');
    const userId = localStorage.getItem('userId');
    navigationButtons();
    

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
const navigationButtons =()=>{
    const depositButton = document.getElementById('toDeposit');
    depositButton.addEventListener('click', function () {
        window.location.href = "../deposit/payment.html";
    });
    const providerButton = document.getElementById('toProvider');
    providerButton.addEventListener('click', function () {
        window.location.href = "../providers/provider.html";
    });
}

async function payService(id, utilityId) {
    //TODO ПРОВЕРИТЬ ОПЛАТУ
    const input = document.getElementById(`input-${id}`);
    const value = input.value.trim();
    const userId = localStorage.getItem('userId');

    if (!value || isNaN(value) || Number(value) <= 0) {
        alert(`Введите корректное значение для услуги`);
        return;
    }

    if (!userId) {
        alert("Пользователь не найден. Пожалуйста, войдите заново.");
        return;
    }

    try {
        const response = await window.api.payUtility({
            userId,
            utilityId,           // теперь используем реальный id из БД
            meterValue: Number(value)
        });

        if (response.success) {
            alert(`✅ Оплата прошла успешно! Списано: ${response.amount} ₽`);

            // Обновим баланс
            const balanceElement = document.getElementById('balance');
            balanceElement.innerHTML = `Баланс: ${response.newBalance} ₽`;

            // Обнулим поле
            input.value = '';

            // Обнулим цену
            const priceElement = document.getElementById(`${id}-price`);
            if (priceElement) priceElement.innerText = '0';
        } else {
            alert(`❌ Ошибка оплаты: ${response.message}`);
        }
    } catch (error) {
        alert(`❌ Ошибка при выполнении оплаты: ${error.message}`);
    }
}
