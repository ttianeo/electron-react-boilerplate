import { PrinterInfo } from 'electron';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface Printer {
  name: string;
}

export default function Preference() {
  const [cameras, setCameras] = useState<MediaDeviceInfo[]>([]);
  const [printers, setPrinters] = useState<Printer[]>([]);

  const router = useNavigate();

  const [config, setConfig] = useState({
    backend: '',
    camera: {
      device: '',
      rotate: '',
    },
    print: {
      printer: '',
      size: {
        width: 0,
        height: 0,
      },
    },
  });

  // 获取摄像头列表
  const getCameras = async () => {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const cam = devices.filter((device) => device.kind === 'videoinput');
    setCameras(cam);
  };

  // 获取打印机列表
  const getPrinters = async () => {
    window.electron.ipcRenderer.sendMessage('print-printers');
    window.electron.ipcRenderer.on('print-printers-reply', (event: any) => {
      event.forEach((pi: PrinterInfo) => {
        setPrinters((prev) => [...prev, { name: pi.name }]);
      });
    });
  };

  useEffect(() => {
    getCameras();
    getPrinters();
  }, []);

  useEffect(() => {
    const getConfig = () => {
      window.electron.ipcRenderer.sendMessage('config-read');
      window.electron.ipcRenderer.on('config-read-reply', (event: any) => {
        const c = JSON.parse(event);
        if (!c.camera.device) {
          c.camera.device = cameras[0]?.label;
        }
        if (!c.print.printer) {
          c.print.printer = printers[0]?.name;
        }
        setConfig(c);
      });
    };
    getConfig();
  }, [cameras, printers]);

  const save = () => {
    window.electron.ipcRenderer.sendMessage(
      'config-write',
      JSON.stringify(config),
    );
    localStorage.setItem('config', JSON.stringify(config));
    router('/');
  };

  return (
    <div>
      <h1>Preference</h1>
      <form>
        <div>
          Backend:
          <input
            type="text"
            value={config.backend}
            onChange={(e) => {
              setConfig({
                ...config,
                backend: e.target.value,
              });
            }}
          />
        </div>
        <div>
          Camera:
          <select
            value={config.camera.device}
            onChange={(e) => {
              setConfig({
                ...config,
                camera: {
                  ...config.camera,
                  device: e.target.value,
                },
              });
            }}
          >
            {cameras.map((camera) => (
              <option key={camera.deviceId} value={camera.deviceId}>
                {camera.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          Rotate:
          <select
            value={config.camera.rotate}
            onChange={(e) => {
              setConfig({
                ...config,
                camera: {
                  ...config.camera,
                  rotate: e.target.value,
                },
              });
            }}
          >
            <option key={-90} value={-90}>
              {-90}
            </option>
            <option key={0} value={0}>
              {0}
            </option>
            <option key={90} value={90}>
              {90}
            </option>
          </select>
        </div>
        <div>
          Printer:
          <select
            value={config.print.printer}
            onChange={(e) => {
              setConfig({
                ...config,
                print: {
                  ...config.print,
                  printer: e.target.value,
                },
              });
            }}
          >
            {printers.map((printer) => (
              <option key={printer.name} value={printer.name}>
                {printer.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          Width(um):
          <input
            type="number"
            value={config.print.size.width}
            onChange={(e) => {
              setConfig({
                ...config,
                print: {
                  ...config.print,
                  size: {
                    ...config.print.size,
                    width: Number(e.target.value),
                  },
                },
              });
            }}
          />
        </div>
        <div>
          Height(um):
          <input
            type="number"
            value={config.print.size.height}
            onChange={(e) => {
              setConfig({
                ...config,
                print: {
                  ...config.print,
                  size: {
                    ...config.print.size,
                    height: Number(e.target.value),
                  },
                },
              });
            }}
          />
        </div>
        <div>
          <button type="button" onClick={save}>
            Save
          </button>
        </div>
      </form>
      <span>
        在第一次启动后会进入此页面，如果后续需要修改，请按Alt，在上方菜单中点击
        File-Preference{' '}
      </span>
    </div>
  );
}
