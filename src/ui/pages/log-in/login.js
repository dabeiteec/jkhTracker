document.addEventListener("DOMContentLoaded", function () {
    const loginButton = document.getElementById('loginButton');
    const registerButton = document.getElementById('registerButton');

    loginButton.addEventListener('click', function (event) {
        event.preventDefault();
        event.stopPropagation(); // важно
        login();
    });

    registerButton.addEventListener('click', function (event) {
        event.preventDefault();
        event.stopPropagation(); // важно
        register();
    });
});

function login() {
    const loginInput = document.getElementById('login');
    const passwordInput = document.getElementById('password');

    const login = loginInput.value.trim();
    const password = passwordInput.value.trim();

    if (!login || !password) {
        alert("Пожалуйста, заполните все поля!");
        return;
    }

    alert(`Логин: ${login} Пароль: ${password}`);

    // после успешной проверки — переход
    window.location.href = "../company/company.html";
}

function register() {
    const loginInput = document.getElementById('login');
    const passwordInput = document.getElementById('password');

    const login = loginInput.value.trim();
    const password = passwordInput.value.trim();

    if (!login || !password) {
        alert("Пожалуйста, заполните все поля!");
        return;
    }
    
    alert(`Регистрация: Логин: ${login} Пароль: ${password}`);
    window.location.href = "../user/user.html";
}
