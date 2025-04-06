const { contextBridge } = require('electron');
const userService = require('./core/services/userService');

contextBridge.exposeInMainWorld('api', {
  login: userService.login,
  register: userService.register,
  // дальше добавим другие сервисы
});
