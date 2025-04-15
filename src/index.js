// index.js (main process)
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

const UserService = require('./core/services/user.services');
const userService = new UserService();
const UtilityService = require('./core/services/company.services');
const utilityService = new UtilityService();

const createWindow = () => {
  const win = new BrowserWindow({
    width: 1000,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'), // Убедитесь, что путь правильный
    },
  });

  win.loadFile('./src/ui/pages/log-in/login.html');
  win.setMenuBarVisibility(false);
};

// Обработчик для логина
ipcMain.handle('login', async (event, login, password) => {
  try {
    const user = await userService.getlogIn(login, password);
    if (user) {
      return { success: true,
        id: user.id,
        role: user.role 
      };
    } else {
      return { success: false, message: 'Неверный логин или пароль' };
    }
  } catch (err) {
    return { success: false, message: err.message };
  }
});

// Обработчик для регистрации
ipcMain.handle('register', async (event, login, password, fullName) => {
  try {
    const result = await userService.createUser(login, password, fullName);
    return { success: true, message: result.message };
  } catch (err) {
    return { success: false, message: err.message };
  }
});
//Получение баланса пользователя
ipcMain.handle('getUserBalance', async (event, userId) => {
  try {
    const balance = await userService.getUserBalance(userId);
    return { success: true, balance };
  } catch (err) {
    return { success: false, message: err.message };
  }
});

// Изменение баланса пользователя
ipcMain.handle('changeUserBalance', async (event, userId, amount) => {
  try {
    const user = await userService.changeUserBalance(userId, amount);
    return { success: true, user };
  } catch (err) {
    return { success: false, message: err.message };
  }
});

ipcMain.handle('getAllUtilities', async (event) => {
  try {
    const utilities = await utilityService.getAllUtilities();
    return { success: true, utilities };
  } catch (err) {
    return { success: false, message: err.message };
  } 
});

ipcMain.handle('addUtilityToUser', async (event, userId, serviceId) => {
  try {
    const result = await utilityService.addUtilityToUser(userId, serviceId);
    return { success: true, message: result.message };
  } catch (err) {
    return { success: false, message: err.message };
  }
});

app.whenReady().then(() => {
  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
