// Preload script to expose specific Node.js APIs to the renderer process
// This script runs before the renderer process is loaded and helps bridge
// between the Electron main process and the renderer process

// Event listener for when the DOM content is fully loaded
window.addEventListener('DOMContentLoaded', () => {

    // Helper function to replace the text content of a specified element
    const replaceText = (selector, text) => {
        const element = document.getElementById(selector);
        if (element) element.innerText = text;
    };

    for (const dependency of ['chrome', 'node', 'electron']) {
        replaceText(`${dependency}-version`, process.versions[dependency]);
    }
});

// Importing contextBridge and ipcRenderer from Electron
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  
  // Method to show an input dialog by sending a message to the main process and waiting for the response
  showInputDialog: (message) => ipcRenderer.invoke('show-input-dialog', message),
  saveSlots: (slots) => ipcRenderer.send('save-slots', slots),
  loadSlots: () => ipcRenderer.invoke('load-slots')
});
