import { app, ipcMain, BrowserWindow } from 'electron';
import fs from 'fs';
import path from 'path';
import { resolveHtmlPath } from '../util';

let pWindow: BrowserWindow | null = null;

export default function ipcPrinter(mainWindow: BrowserWindow) {
  // 发出打印请求
  ipcMain.on('print-image-request', async (event, arg) => {
    // 在开发环境和生产环境中，preload.js的路径不同，需要区分
    let preload = app.isPackaged
      ? path.join(__dirname, 'preload.js')
      : path.join(__dirname, '../../.erb/dll/preload.js');

    if (process.env.NODE_ENV === 'development') {
      preload = app.isPackaged
        ? path.join(__dirname, '../', 'preload.js')
        : path.join(__dirname, '../', '../../.erb/dll/preload.js');
    }

    const cpath = path.join('./', 'config.json');
    fs.readFile(cpath, 'utf-8', (err: any, data: any) => {
      const config = JSON.parse(data);
      pWindow = new BrowserWindow({
        show: false,
        width: config.print.page === '3inch' ? 120 : 120,
        height: config.print.page === '3inch' ? 120 : 180,
        webPreferences: {
          preload,
          webSecurity: false,
          devTools: true,
        },
      });
      pWindow.loadURL(`${resolveHtmlPath(`index.html`)}#/print/?src=${arg}`); // 加载打印页面
    });

    // 调出隐藏的打印窗口
  });

  // 开始正式打印，渲染进程的图像加载完毕后发送start打印开始请求
  ipcMain.on('print-image-start', async () => {
    if (!pWindow) {
      return;
    }
    const cpath = path.join('./', 'config.json');
    fs.readFile(cpath, 'utf-8', (err: any, data: any) => {
      const config = JSON.parse(data);
      console.log(config.print.page);
      pWindow?.webContents.print(
        {
          silent: true,
          printBackground: false,
          margins: {
            marginType: 'none',
          },
          deviceName: config.print.printer,
          dpi: {
            horizontal: 300,
            vertical: 300,
          },
          pageSize: {
            height: config.print.page === '3inch' ? 76200 : 152400,
            width: config.print.page === '3inch' ? 76200 : 101600,
          },
        },
        () => {
          mainWindow?.webContents.send('print-image-done');
          pWindow?.close();
          pWindow = null;
        },
      );
    });

    // 静默打印
  });

  // 获取打印机列表
  ipcMain.on('print-printers', async (event) => {
    mainWindow?.webContents
      .getPrintersAsync()
      .then((printers) => {
        // 返回打印机列表
        event.reply('print-printers-reply', printers);
        return printers;
      })
      .catch((err) => {
        return err;
      });
  });

  ipcMain.on('printer-status', async (event) => {
    mainWindow?.webContents
      .getPrintersAsync()
      .then((printers) => {
        // 返回打印机列表
        const cpath = path.join('./', 'config.json');
        fs.readFile(cpath, 'utf-8', (err: any, data: any) => {
          const config = JSON.parse(data);
          const printer = printers.find((p) => p.name === config.print.printer);
          if (printer) {
            event.reply('printer-status-reply', printer.status);
          }
        });
        return printers;
      })
      .catch((err) => {
        return err;
      });
  });
}
