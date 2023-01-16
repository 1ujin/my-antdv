import { app, protocol, BrowserWindow } from 'electron'
// import {
//   createProtocol
// } from 'vue-cli-plugin-electron-builder'

process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'TRUE'

protocol.registerSchemesAsPrivileged([{ scheme: 'app', privileges: { secure: true, standard: true } }])

let win

const createWindow = () => {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    frame: true, // 是否显示顶部导航栏
    darkTheme: true,
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: true
    }
  })

  // 打开开发者工具
  // win.webContents.openDevTools()

  // createProtocol('app')
  win.loadURL('http://192.168.31.168:8000/')

  // 当 window 被关闭，这个事件会被触发。
  win.on('closed', () => {
    // 取消引用 window 对象，如果你的应用支持多窗口的话，
    // 通常会把多个 window 对象存放在一个数组里面，
    // 与此同时，你应该删除相应的元素。
    win = null
  })
}

app.whenReady().then(() => {
  createWindow()
})

// 关闭所有窗口时退出应用
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
