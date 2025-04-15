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

async function login() {
    const loginInput = document.getElementById('login');
    const passwordInput = document.getElementById('password');
    
    const STORAGE_KEY = 'userId';

    const login = loginInput.value.trim();
    const password = passwordInput.value.trim();

    if (!login || !password) {
        alert("Пожалуйста, заполните все поля!");
        return;
    }

    try {
        const response = await window.api.login(login, password);
        if (response.success) {
            localStorage.setItem(STORAGE_KEY, response.id);
            if(response.role === 'admin') {
                window.location.href = "../company/company.html"; // Переход на страницу администратора
            }else{
                window.location.href = "../user/user.html"; // Переход на другую страницу
            }
        } else {
            alert(`Ошибка: ${response.message}`);
        }
    } catch (error) {
        alert(`Произошла ошибка при входе. ${error}`);
    }
}

async function register() {
    const loginInput = document.getElementById('login');
    const passwordInput = document.getElementById('password');

    const login = loginInput.value.trim();
    const password = passwordInput.value.trim();

    if (!login || !password) {
        alert("Пожалуйста, заполните все поля!");
        return;
    }

    try {
        const response = await window.api.register(login, password);
        if (response.success) {
            alert('Регистрация прошла успешно!');
            // window.location.href = "../user/user.html";
        } else {
            alert(`Ошибка: ${response.message}`);
        }
    } catch (error) {
        console.error("Ошибка при регистрации:", error);
        alert("Произошла ошибка при регистрации.");
    }
}
