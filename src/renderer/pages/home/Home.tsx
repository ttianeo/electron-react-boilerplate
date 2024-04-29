import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Gallery from '../../components/gallery/Gallery';
import style from './styles/Home.module.css';
import Button from '../../components/button/Button';

export default function Home() {
  const [index, setIndex] = useState(0);
  const [images, setImages] = useState([
    { key: '1', src: 'https://iph.href.lu/500x800?fg=666666&bg=cccccc&text=1' },
  ]);

  const router = useNavigate();

  const [printing, setPrinting] = useState(false);

  useEffect(() => {
    window.electron.ipcRenderer.sendMessage('config-hash');
    window.electron.ipcRenderer.on('config-hash-reply', (event: any) => {
      const config = localStorage.getItem('config');
      if (!config) {
        router('/preference');
      }
      // 计算hash
      crypto.subtle
        .digest('SHA-256', new TextEncoder().encode(config?.toString() || ''))
        .then((hash) => {
          const h = Array.from(new Uint8Array(hash))
            .map((b) => b.toString(16).padStart(2, '0'))
            .join('');
          if (h !== event) {
            router('/preference');
          }
          return hash;
        })
        .catch((err) => {
          router('/preference');
          return err;
        });
    });
    const config = localStorage.getItem('config');
    axios.defaults.baseURL = JSON.parse(config || '{}').backend;

    window.electron.ipcRenderer.on('print-image-done', () => {
      setPrinting(false);
    });

    axios
      .get('/history')
      .then((res) => {
        const img = [] as { key: string; src: string }[];
        for (let i = 0; i < res.data.data.length; i += 1) {
          img.push({
            key: res.data.data[i].path,
            src: `${axios.defaults.baseURL}static${res.data.data[i].path}`,
          });
        }
        setImages(img);
        return res.data;
      })
      .catch((err) => {
        return err;
      });
  }, [router]);

  return (
    <div className={style.home}>
      <div
        className={style.noopMask}
        style={{
          display: printing ? 'flex' : 'none',
        }}
      >
        <span
          style={{
            fontFamily: 'ArtSDIcon',
          }}
          className={style.load}
        >
          &#xe891;
        </span>
      </div>
      <img
        src={images[index].src}
        alt={images[index].key}
        className={style.bigImg}
      />
      <div className={style.gallery}>
        <Button
          onclick={() => {
            window.electron.ipcRenderer.sendMessage('print-image-request', [
              images[index].src,
            ]);
            setPrinting(true);
          }}
          icon={
            <span
              style={{
                fontFamily: 'ArtSDIcon',
              }}
            >
              &#xe870;
            </span>
          }
          style={{
            position: 'absolute',
            top: -90,
            right: 10,
            zIndex: 100,
          }}
        />
        <Button
          onclick={() => {
            router('/photo');
          }}
          icon={
            <span
              style={{
                fontFamily: 'ArtSDIcon',
              }}
            >
              &#xe86f;
            </span>
          }
          style={{
            position: 'absolute',
            top: -200,
            right: 10,
            zIndex: 100,
          }}
        />
        <Button
          onclick={() => {}}
          icon={
            <span
              style={{
                fontFamily: 'ArtSDIcon',
              }}
            >
              &#xe61b;
            </span>
          }
          style={{
            position: 'absolute',
            top: -90,
            left: 10,
            zIndex: 100,
          }}
        />
        <Gallery
          images={images}
          select={(i) => {
            setIndex(i);
          }}
          width={100}
          active={index}
        />
      </div>
    </div>
  );
}
