import { useEffect, useState } from 'react';

export default function Print() {
  const [src, setSrc] = useState<string>('');
  const [log, setLog] = useState<any>('');
  window.onerror = (msg, u, lineNo, columnNo, error) => {
    setLog(
      `${log}\nError: ${msg}\nURL: ${u}\nLine: ${lineNo}\nColumn: ${columnNo}\n${error}`,
    );
    return false;
  };
  useEffect(() => {
    const img = document.getElementById('print-image') as HTMLImageElement;
    // 当前URL
    const url = new URL(window.location.href);
    // 获取URL参数
    // 自己利用正则，Hash路由下存在问题，重造轮子
    // 正则表达式,匹配src=后面的内容
    const reg = /src=(.*)/;
    // 设置图片
    setSrc(reg.exec(url.toString())?.[1] || '');

    img.onload = () => {
      // 启动图片打印
      window.electron.ipcRenderer.sendMessage('print-image-start');
    };
  }, []);

  return (
    <>
      <img
        id="print-image"
        src={src}
        alt="printer"
        style={{
          objectFit: 'cover',
          width: '100%',
          height: '100%',
        }}
      />
      <span>{log}</span>
    </>
  );
}
