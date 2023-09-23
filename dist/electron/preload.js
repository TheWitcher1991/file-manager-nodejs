'use strict'

const { ipcRenderer } = require('electron')

console.time('Launch')

window.addEventListener('DOMContentLoaded', () => {
    document.querySelector('#minimize-button').addEventListener('click', () => {
        ipcRenderer.send('minimize-window')
    })

    /* document.querySelector('#maximize-button').addEventListener('click', () => {
        ipcRenderer.send('maximize-window');
    })

    document.querySelector('#restore-button').addEventListener('click', () => {
        ipcRenderer.send('restore-window');
    }) */

    document.querySelector('#close-button').addEventListener('click', () => {
        ipcRenderer.send('close-window')
    })

    document.querySelector('.bth__path-cancel').addEventListener('click', () => {
        ipcRenderer.send('close-window')
    })

    document.querySelector('.bth__letter-cancel').addEventListener('click', () => {
        ipcRenderer.send('close-window')
    })

    const replaceText = (selector, text) => {
        const element = document.getElementById(selector)
        if (element) element.innerText = text
    };

    for (const type of ['chrome', 'node', 'electron']) {
        replaceText(`${type}-version`, (process.versions)[type])
    }
})
