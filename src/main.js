var app = require('app');  // Module to control application life.
var Menu = require("menu");
var BrowserWindow = require('browser-window');  // Module to create native browser window.
var path = require("path");
var fs = require("fs");
var configPath = path.join(app.getDataPath(), "debugger-config.json");


// The target script to debug is passed on the command line
var targetScript = path.resolve(process.cwd(), process.argv[2]);
process.chdir(path.dirname(targetScript));

var template = [
    {
        label: 'Debugger',
        submenu: [
            {
                label: 'Quit',
                accelerator: 'Command+Q',
                click: function () {
                    app.quit();
                }
            }
        ]
    },
    {
        label: 'View',
        submenu: [
            {
                label: 'Reload Script',
                accelerator: 'CommandOrControl+R',
                click: function () {
                    if (mainWindow) {
                        mainWindow.reloadIgnoringCache();
                    }
                }
            },
            {type: 'separator'},
            {
                label: 'Developer Tools',
                accelerator: 'Alt+CommandOrControl+I',
                click: function () {
                    mainWindow.toggleDevTools();
                }
            }
        ]
    },
    {
        label: 'Edit',
        submenu: [
            {label: 'Undo', accelerator: 'Command+Z', selector: 'undo:'},
            {label: 'Redo', accelerator: 'Command+Shift+Z', selector: 'redo:'},
            {type: 'separator'},
            {label: 'Cut', accelerator: 'Command+X', selector: 'cut:'},
            {label: 'Copy', accelerator: 'Command+C', selector: 'copy:'},
            {label: 'Paste', accelerator: 'Command+V', selector: 'paste:'},
            {label: 'Select All', accelerator: 'Command+A', selector: 'selectAll:'},
        ]
    }
];

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
var mainWindow = null;

// Quit when all windows are closed.
app.on('window-all-closed', function() {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform != 'darwin') {
        app.quit();
    }
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', function() {
    //set the context menu
    Menu.setApplicationMenu(Menu.buildFromTemplate(template));

    mainWindow = new BrowserWindow({});

    mainWindow.hide();

    // and load the index.html of the app.
    var debuggerWebpage = 'file://' + path.resolve(__dirname, '../debugger.html');
    mainWindow.loadUrl( debuggerWebpage );

    mainWindow.webContents.toggleDevTools();

    var ipc = require('ipc');
    ipc.on('get-target-script', function(event, arg) {
      event.returnValue = targetScript;
    });

    // Emitted when the window is closed.
    mainWindow.on('closed', function() {

        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null;
    });
});
