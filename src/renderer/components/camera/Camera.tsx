import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from './styles/Camera.module.css';

export interface CameraProps {
  status: string;
  finish: (image: File) => void;
  style?: React.CSSProperties;
}

export default function Camera({ status, finish, style }: CameraProps) {
  const [count, setCount] = useState(5);
  const [countShow, setCountShow] = useState(false);

  const [config, setConfig] = useState({} as any);

  const router = useNavigate();

  const start = () => {
    setCountShow(true);
    const timer = setInterval(() => {
      setCount((c) => {
        if (c === 1) {
          setCountShow(false);
          clearInterval(timer);
          const video = document.getElementById('camera') as HTMLVideoElement;
          const canvas = document.getElementById('canvas') as HTMLCanvasElement;
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            const meta = {
              x: 0,
              y: 0,
              width: video.videoWidth,
              height: video.videoHeight,
            };

            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;

            if (config.camera.rotate === '-90') {
              meta.y = -video.videoHeight;
              canvas.width = video.videoHeight;
              canvas.height = video.videoWidth;
              ctx.rotate((90 * Math.PI) / 180);
            }

            if (config.camera.rotate === '90') {
              meta.x = -video.videoWidth;
              canvas.width = video.videoHeight;
              canvas.height = video.videoWidth;
              ctx.rotate((-90 * Math.PI) / 180);
            }
            ctx.drawImage(video, meta.x, meta.y, meta.width, meta.height);

            canvas.toBlob((blob) => {
              if (blob) {
                finish(new File([blob], 'image.png'));
              }
            });
            const data = canvas.toDataURL('image/png');
            const img = document.getElementById('res') as HTMLImageElement;
            img.src = data;
          }
          return 5;
        }
        return c - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    const video = document.getElementById('camera') as HTMLVideoElement;
    const c = localStorage.getItem('config');
    if (!c) {
      router('/preference');
    }

    const cfg = JSON.parse(c || '{}');
    setConfig(cfg);
    axios.defaults.baseURL = cfg.backend;
    const canvas = document.getElementById('canvas') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');
    navigator.mediaDevices
      .getUserMedia({
        video: {
          deviceId: cfg.camera.device,
        },
      })
      .then((stream) => {
        stream.getVideoTracks()[0].applyConstraints({
          // rotate
          // @ts-ignore
          advanced: [{ videoStabilizationMode: 'off' }],
        });
        video.srcObject = stream;
        video.play();
        video.onloadedmetadata = () => {
          if (ctx) {
            const meta = {
              x: 0,
              y: 0,
              width: video.videoWidth,
              height: video.videoHeight,
            };

            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;

            if (cfg.camera.rotate === '-90') {
              meta.y = -video.videoHeight;
              canvas.width = video.videoHeight;
              canvas.height = video.videoWidth;
              ctx.rotate((90 * Math.PI) / 180);
            }

            if (cfg.camera.rotate === '90') {
              meta.x = -video.videoWidth;
              canvas.width = video.videoHeight;
              canvas.height = video.videoWidth;
              ctx.rotate((-90 * Math.PI) / 180);
            }

            const tick = () => {
              // 旋转

              ctx.drawImage(video, meta.x, meta.y, meta.width, meta.height);
              requestAnimationFrame(tick);
            };
            requestAnimationFrame(tick);
          }
        };
        return () => {
          stream.getTracks().forEach((track) => {
            track.stop();
          });
        };
      })
      .catch((err) => {
        return err;
      });
  }, [router]);

  return (
    <div className={styles.camera} style={style}>
      <video
        id="camera"
        autoPlay
        style={{
          display: 'none',
        }}
      >
        <track kind="captions" />
      </video>
      <canvas id="canvas" />
      <div className={styles.mask}>
        {!countShow && (
          <div
            className={styles.start}
            onClick={() => {
              start();
            }}
            onKeyDown={() => {}}
            role="button"
            tabIndex={0}
          >
            <div
              style={{
                fontFamily: 'ArtSDIcon',
                display: 'block',
                fontSize: '4rem',
                marginBottom: '1rem',
                color: '#2A82E4',
              }}
            >
              &#xe870;
            </div>
            <div>
              <span
                style={{
                  fontSize: '1rem',
                  color: '#2A82E4',
                }}
              >
                开始拍照
              </span>
            </div>
          </div>
        )}
        {countShow && <div className={styles.count}>{count}</div>}
        <img
          id="res"
          alt="result"
          style={{
            display: status === 'finish' ? 'block' : 'none',
          }}
          className={styles.result}
        />
      </div>
    </div>
  );
}

Camera.defaultProps = {
  style: {},
};
