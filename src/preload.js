const { contextBridge, ipcRenderer } = require('electron');

// Создаем безопасный API для общения между рендером и основным процессом
contextBridge.exposeInMainWorld('api', {
  login: (login, password) => ipcRenderer.invoke('login', login, password),
  register: (login, password, fullName) => ipcRenderer.invoke('register', login, password, fullName),
  getUserBalance: (userId) => ipcRenderer.invoke('getUserBalance', userId),
  changeUserBalance: (userId, amount) => ipcRenderer.invoke('changeUserBalance', userId, amount),
  getAllUtilities: () => ipcRenderer.invoke('getAllUtilities'),
  addUtilityToUser: (userId, serviceId) => ipcRenderer.invoke('addUtilityToUser', userId, serviceId),
});
