import { ipcMain } from 'electron';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

export default function ipcConfig() {
  const cpath = path.join('./', 'config.json');

  // 读取配置文件
  ipcMain.on('config-read', async (event) => {
    fs.readFile(cpath, 'utf-8', (err: any, data: any) => {
      if (err) {
        return;
      }
      event.reply('config-read-reply', data);
    });
  });

  // 写入配置文件
  ipcMain.on('config-write', async (event, arg) => {
    fs.writeFile(cpath, arg, () => {});
  });

  // 获取配置文件的SHA256
  ipcMain.on('config-hash', async (event) => {
    fs.readFile(cpath, 'utf-8', (err: any, data: any) => {
      if (err) {
        return;
      }
      // 计算对象Hash SHA256
      const hash = crypto.createHash('sha256');
      hash.update(data);
      const hashStr = hash.digest('hex');
      event.reply('config-hash-reply', hashStr);
    });
  });
}
