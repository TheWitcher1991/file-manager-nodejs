'use strict'

const { remote, ipcRenderer } = require('electron')

const getCurrentWindow = () => remote.getCurrentWindow()

const minimizeWindow = (browserWindow = getCurrentWindow()) => {
    if (browserWindow.minimizable) {
        browserWindow.minimize()
    }
}

const closeWindow = (browserWindow = getCurrentWindow()) => {
    browserWindow.close();
}

module.exports = {
    getCurrentWindow,
    minimizeWindow,
    closeWindow
}