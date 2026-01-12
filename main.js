const { app, BrowserWindow, Menu } = require('electron');
const path = require('path');
const url = require('url');

function createWindow() {
  const win = new BrowserWindow({
    width: 400,
    height: 600,
    // frame: false, // 无边框
    // transparent: true, // 背景透明
    webPreferences: {
      // preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  // 隐藏菜单栏
  Menu.setApplicationMenu(null);

  // 根据环境加载不同的内容
  if (process.env.NODE_ENV === 'development') {
    // 开发环境加载开发服务器
    win.loadURL('http://localhost:5173');
    // 打开调试工具
    win.webContents.openDevTools();
  } else {
    // 生产环境加载本地构建文件
    win.loadURL(
      url.format({
        pathname: path.join(__dirname, 'dist', 'index.html'),
        protocol: 'file:',
        slashes: true
      })
    );
  }
}

// 应用准备就绪时创建窗口
app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// 关闭所有窗口时退出应用
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});