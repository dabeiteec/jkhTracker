document.addEventListener('DOMContentLoaded', function () {
    const button = document.getElementById('rechargeButton');
    const amountInput = document.getElementById('amount');

    setTimeout(() => {
        amountInput.focus();
    }, 0);
    
    amountInput.value = 500;
    amountInput.min = 100;
    amountInput.max = 5000;

    button.addEventListener('click', function (event) {
        event.preventDefault(); // ОК
        event.stopPropagation(); // ОК

        const amount = parseInt(amountInput.value);

        if (isNaN(amount)) {
            alert("Пожалуйста, введите правильную сумму.");
        } else if (amount < 100) {
            alert("Сумма не может быть меньше 100 рублей.");
        } else if (amount > 5000) {
            alert("Сумма не может быть больше 5000 рублей.");
        } else {
            alert(`Вы пополнили баланс на ${amount} рублей.`);
        }

        // Вернуть фокус в input
        amountInput.focus();
    });
});
