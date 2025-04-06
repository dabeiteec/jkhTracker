const { app, BrowserWindow } = require('electron');
const path = require('path');
const { initializeDatabase } = require('./core/database/databaseInit');

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 1000,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  mainWindow.loadFile('./src/ui/pages/log-in/login.html');
  mainWindow.setMenuBarVisibility(false);
};

app.whenReady().then(async () => {
  await initializeDatabase();
  createWindow();
});
