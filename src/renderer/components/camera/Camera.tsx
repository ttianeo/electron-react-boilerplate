import { useEffect, useState } from 'react';
import style from './styles/Camera.module.css';

export interface CameraProps {
  status: string;
  finish: (image: File) => void;
}

export default function Camera({ status, finish }: CameraProps) {
  const [count, setCount] = useState(5);
  const [countShow, setCountShow] = useState(false);

  const start = () => {
    setCountShow(true);
    const timer = setInterval(() => {
      setCount((c) => {
        if (c === 1) {
          setCountShow(false);
          clearInterval(timer);
          const video = document.getElementById('camera') as HTMLVideoElement;
          const canvas = document.createElement('canvas');
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
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
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        video.srcObject = stream;
        video.play();
        return () => {
          stream.getTracks().forEach((track) => {
            track.stop();
          });
        };
      })
      .catch((err) => {
        return err;
      });
  }, []);

  return (
    <div className={style.camera}>
      <video id="camera" width="640" height="480" autoPlay>
        <track kind="captions" />
      </video>
      <div className={style.mask}>
        {!countShow && (
          <div
            className={style.start}
            onClick={() => {
              start();
            }}
            onKeyDown={() => {}}
            role="button"
            tabIndex={0}
          >
            开始拍照
          </div>
        )}
        {countShow && <div className={style.count}>{count}</div>}
        <img
          id="res"
          alt="result"
          style={{
            display: status === 'finish' ? 'block' : 'none',
          }}
          className={style.result}
        />
      </div>
    </div>
  );
}
