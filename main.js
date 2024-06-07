// meow :3

const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');

//const { app, BrowserWindow, ipcMain } = require('electron');
//const path = require('path');
const fs = require('fs');

const slotsFilePath = path.join(app.getPath('userData'), 'slots.json');

//For creation of main application window
function createWindow () {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  mainWindow.loadFile('index.html');
}

// Save slots data to a file
ipcMain.on('save-slots', (event, slots) => {
  fs.writeFileSync(slotsFilePath, JSON.stringify(slots, null, 2));
});

// Load slots data from a file
ipcMain.handle('load-slots', async () => {
  if (fs.existsSync(slotsFilePath)) {
    const data = fs.readFileSync(slotsFilePath, 'utf-8');
    return JSON.parse(data);
  }
  return [];
});

// Event listener to create the main window when the app is ready
app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Handle IPC events for dialogs
ipcMain.handle('show-input-dialog', async (event, message) => {
  const { response } = await dialog.showMessageBox({
    type: 'question',
    buttons: ['Cancel', 'OK'],
    defaultId: 1,
    title: 'Input',
    message: message,
    input: true // Custom property to identify this is an input dialog
  });

  return response;
});
