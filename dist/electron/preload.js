'use strict'

const { contextBridge, ipcRenderer, remote }  = require('electron')

window.addEventListener('DOMContentLoaded', () => {
    document.querySelector('#minimize-button').addEventListener('click', () => {
        ipcRenderer.send('minimize-window');
    })

    /*document.querySelector('#maximize-button').addEventListener('click', () => {
        ipcRenderer.send('maximize-window');
    })

    document.querySelector('#restore-button').addEventListener('click', () => {
        ipcRenderer.send('restore-window');
    })*/

    document.querySelector('#close-button').addEventListener('click', () => {
        ipcRenderer.send('close-window');
    })

    document.querySelector('.bth__path-cancel').addEventListener('click', () => {
        ipcRenderer.send('close-window');
    })

    document.querySelector('.bth__letter-cancel').addEventListener('click', () => {
        ipcRenderer.send('close-window');
    })

    const replaceText = (selector, text) => {
        const element = document.getElementById(selector);
        if (element) element.innerText = text;
    };

    for (const type of ['chrome', 'node', 'electron']) {
        replaceText(`${type}-version`, (process.versions)[type]);
    }
})

contextBridge.exposeInMainWorld('api', {
    getExpressAppUrl: () => ipcRenderer.invoke('get-express-app-url')
})

contextBridge.exposeInMainWorld('ipcRenderer', {
    on: (channel, listener) => {
        ipcRenderer.on(channel, listener);
    }
})

/* const {
    getCurrentWindow,
    minimizeWindow,
    closeWindow
} = require("./menu-functions")

window.addEventListener('DOMContentLoaded', () => {
    window.getCurrentWindow = getCurrentWindow
    window.minimizeWindow = minimizeWindow
    window.closeWindow = closeWindow
}) */