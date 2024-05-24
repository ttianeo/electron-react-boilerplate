import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from './styles/Camera.module.css';
import face from './face.png';

export interface CameraProps {
  status: string;
  finish: (image: File) => void;
  style?: React.CSSProperties;
}

export default function Camera({ status, finish, style }: CameraProps) {
  const [count, setCount] = useState(5);
  const [countShow, setCountShow] = useState(false);

  const [config, setConfig] = useState({} as any);
  const [mask, setMask] = useState(false);

  const router = useNavigate();

  useEffect(() => {
    if (status !== 'finish') {
      const img = document.getElementById('res') as HTMLImageElement;
      img.src = '';
    }
  }, [status]);

  const start = () => {
    setCountShow(true);
    const timer = setInterval(() => {
      setCount((c) => {
        if (c <= 2) {
          // 立即执行
          setTimeout(() => {
            setMask(true);
          }, 0);
        }
        if (c <= 1) {
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

            if (config.camera.rotate === '180') {
              meta.x = -video.videoWidth;
              meta.y = -video.videoHeight;
              canvas.width = video.videoWidth;
              canvas.height = video.videoHeight;
              ctx.rotate((-180 * Math.PI) / 180);
            }

            ctx.drawImage(video, meta.x, meta.y, meta.width, meta.height);

            // 裁剪掉多余的部分

            // canvas.toBlob((blob) => {
            //   if (blob) {
            //     finish(new File([blob], 'image.png'));
            //   }
            // });
            // const data = canvas.toDataURL('image/png');
            const img = document.getElementById('res') as HTMLImageElement;
            const clip = {
              width: canvas.clientWidth,
              height: canvas.clientHeight,
            };
            const scale = clip.height / canvas.height;
            // 裁剪中间部分
            const x = (canvas.width - clip.width / scale) / 2;
            const y = 0;
            const clipCanvas = document.createElement('canvas');
            clipCanvas.width = clip.width;
            clipCanvas.height = clip.height;

            // 缩放+裁剪, 保持比例，高度撑满

            const clipCtx = clipCanvas.getContext('2d');
            if (clipCtx) {
              clipCtx.drawImage(
                canvas,
                x,
                y,
                canvas.width - x * 2,
                canvas.height,
                0,
                0,
                clip.width,
                clip.height,
              );
            }
            const clipData = clipCanvas.toDataURL('image/png');

            clipCanvas.toBlob((blob) => {
              if (blob) {
                finish(new File([blob], 'image.png'));
              }
            });

            img.src = clipData;
            img.onload = () => {
              setCountShow(false);
              setMask(false);
              clearInterval(timer);
            };
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

            if (cfg.camera.rotate === '180') {
              meta.x = -video.videoWidth;
              meta.y = -video.videoHeight;
              canvas.width = video.videoWidth;
              canvas.height = video.videoHeight;
              ctx.rotate((-180 * Math.PI) / 180);
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
            onTouchStart={() => {
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
                fontSize: '6rem',
                marginBottom: '1rem',
                color: '#2A82E4',
              }}
            >
              &#xe870;
            </div>
            <div>
              <span
                style={{
                  fontSize: '3rem',
                  color: '#2A82E4',
                }}
              >
                开始拍照
              </span>
            </div>
          </div>
        )}
        <div
          className={styles.noopMask}
          style={{
            display: mask ? 'flex' : 'none',
          }}
        >
          <span
            style={{
              fontFamily: 'ArtSDIcon',
            }}
            className={styles.load}
          >
            &#xe891;
          </span>
        </div>
        {countShow && count - 1 !== 0 && (
          <div className={styles.count}>
            <div
              style={{
                textAlign: 'center',
              }}
            >
              {count - 1}
            </div>
            <div
              style={{
                fontSize: '4rem',
                textAlign: 'center',
              }}
            >
              请保持面部在框内
            </div>
          </div>
        )}

        <div className={styles.vface}>
          <img
            src={face}
            alt="face"
            id="vface"
            style={{
              width: '100%',
            }}
          />
        </div>

        <img
          id="res"
          alt="result"
          style={{
            // display: status === 'finish' ? 'block' : 'none',
            display: 'block',
            pointerEvents: 'none',
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
