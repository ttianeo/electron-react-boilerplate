import { ipcMain } from 'electron';
import fs from 'fs';
import path from 'path';
// 子进程
import { exec } from 'child_process';

export default function ipcSex() {
  // 读取配置文件
  ipcMain.on('sex', async (event, arg) => {
    const b64 = arg[0];
    // b64 to file
    const buffer = Buffer.from(b64, 'base64');
    // 写入./temp.png
    fs.writeFile(
      path.join('resources\\assets\\scripts\\sex', 'temp.png'),
      buffer,
      () => {
        exec(
          '"sex.exe" temp.png',
          {
            cwd: 'resources\\assets\\scripts\\sex',
          },
          (error, stdout) => {
            event.reply('sex-reply', [stdout]);
          },
        );
      },
    );
  });
}
