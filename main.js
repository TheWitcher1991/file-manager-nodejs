'use strict'

if (require.main !== module) {
    require('update-electron-app')({
        logger: require('electron-log')
    })
}
const path = require('path')
const { app, BrowserWindow, ipcMain, globalShortcut, dialog, autoUpdater } = require('electron')
// const ejs = require('ejs-electron')
const { spawn } = require('child_process')

// const log = require('electron-log');

const pjson = require('./package.json')

// log.transports.console.level = 'info'
// log.transports.file.level = 'info'
// log.info('App starting...')

const appversion = pjson.version

const expressAppUrl = `http://localhost:8080`;

const debug = /--debug/.test(process.argv[2])

if (process.mas) app.setName(pjson.name)

//ejs
//    .data('title', pjson.name)
//    .data('api', './api.js')
//    .data('styles', './public/static/style.bundle.css')
//    .options('debug', true)

let mainWindow = null

/* const sendStatusToWindow = (text, ver) => {
    log.info(text)
    mainWindow?.webContents.send('message', text, ver)
} */

const registerGlobalShortcuts = () => {
    globalShortcut.register('CommandOrControl+Shift+L', () => {
        mainWindow?.webContents.send('show-server-log');
    })
}

function createWindow () {
    // const expressAppProcess = spawn(pjson.name, [expressPath])

    const windowOptions = {
        minWidth: 960,
        minHeight: 660,
        center: true,
        title: pjson.name,
        resizable: true,
        // transparent: true,
        frame: false,
        hasShadow: false,
        titleBarStyle: 'hidden',
        icon: path.join(__dirname, '/dist/public/img/icon.ico'),
        webPreferences: {
            nodeIntegration: true,
            nodeIntegrationInWorker: true,
            contextIsolation: false,
            enableRemoteModule: true,
            // webSecurity: false,
            worldSafeExecuteJavaScript: true,
            preload: path.join(__dirname, '/dist/electron/preload.js')
        }
    }

    if (process.platform === 'linux') {
        windowOptions.icon = path.join(__dirname, '/dist/public/img/icon.ico')
    }

    mainWindow = new BrowserWindow(windowOptions)
    mainWindow.setMenuBarVisibility(false)
    mainWindow.setProgressBar(0)
    // mainWindow.webContents.openDevTools()
    mainWindow.loadURL(path.join(__dirname, '/dist/index.html'))
    //mainWindow.loadURL('http://localhost:8080/')

    // log.info(mainWindow);

    if (debug) {
        mainWindow.webContents.openDevTools()
        mainWindow.maximize()
        require('devtron').install()
    }

    mainWindow.on('closed', () => {
        mainWindow = null
        // expressAppProcess.kill()
    })

    ipcMain.on('minimize-window', () => {
        mainWindow.minimize();
    });

    ipcMain.on('maximize-window', () => {
        mainWindow.maximize();
    });

    ipcMain.on('restore-window', () => {
        mainWindow.restore()
    });

    ipcMain.on('close-window', () => {
        mainWindow.close();
    });

    /* ipcMain.on('showFolderDialog', e => {
        let fileSelectionPromise = dialog.showOpenDialog({ properties: ['openFile', 'openDirectory', 'multiSelections'] });
        fileSelectionPromise.then(obj => {
            e.sender.send('selectedfolders', obj.filePaths)
            let cumfileslist =
                obj.filePaths
                .map((filePath, index)=>{
                    return fs.readdirSync(filePath, { withFileTypes: true })
                        .filter(dirent => !dirent.isDirectory())
                        .map(dirent => filePath + '/' + dirent.name)
                })
                .reduce((filesacc, files) => {
                    filesacc = filesacc.concat(files)
                    return filesacc
                })
                .every((absolutefilepath, index, array) => {
                    let stats = fs.statSync(absolutefilepath)
                    e.sender.send('fileslist', path.basename(absolutefilepath), stats)
                    return true
                })
        })
    }) */

    ipcMain.handle('get-express-app-url', () => {
        return expressAppUrl
    })
}

/* autoUpdater.on('checking-for-update', () => {
    sendStatusToWindow('Checking for update...', appversion);
})

autoUpdater.on('update-available', info => {
    sendStatusToWindow('Update available.', appversion);
})

autoUpdater.on('update-not-available', info => {
    sendStatusToWindow('Update not available.', appversion);
})

autoUpdater.on('error', err => {
    sendStatusToWindow('Error in auto-updater. ' + err, appversion);
})

autoUpdater.on('download-progress', progressObj => {
    let log_message = "Download speed: " + progressObj.bytesPerSecond;
    log_message = log_message + ' - Downloaded ' + progressObj.percent + '%';
    log_message = log_message + ' (' + progressObj.transferred + "/" + progressObj.total + ')';
    sendStatusToWindow(log_message, appversion);
})

autoUpdater.on('update-downloaded', info => {
    setTimeout(function () {
        sendStatusToWindow('Update downloaded..Restarting App in 5 seconds', appversion);
        homePageWindow.webContents.send('updateReady');
        autoUpdater.quitAndInstall();
    }, 5000)
}); */

app.whenReady().then(() => {
    // autoUpdater.checkForUpdatesAndNotify()
    registerGlobalShortcuts()
    createWindow()

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow()
        }
    })

    let checkServerRunning = setInterval(() => {
        fetch(expressAppUrl)
            .then((response) => {
                if (response.status === 200) {
                    clearInterval(checkServerRunning);
                    mainWindow?.webContents.send('server-running');
                }
            })
            .catch((err) => {
            });
    }, 1000);
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})