import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Gallery from '../../components/gallery/Gallery';
import style from './styles/Home.module.css';
import Button from '../../components/button/Button';
import sn from '../../inter/sn';

export default function Home() {
  const [index, setIndex] = useState(0);
  const [images, setImages] = useState([
    {
      key: '1',
      src: 'https://iph.href.lu/500x800?fg=666666&bg=cccccc&text=1',
      nickname: null as string | null,
    },
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
    axios.interceptors.request.use(sn);

    window.electron.ipcRenderer.on('print-image-done', () => {
      setPrinting(false);
    });

    axios
      .get('/history')
      .then((res) => {
        const img = [] as {
          key: string;
          src: string;
          nickname: string | null;
        }[];
        if (res.data.data.length === 0) {
          return res.data;
        }
        for (let i = 0; i < res.data.data.length; i += 1) {
          img.push({
            key: res.data.data[i].id,
            src: `${axios.defaults.baseURL}minio${res.data.data[i].processed_url}`,
            nickname: null,
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
          text="点击拍照试试吧"
          style={{
            position: 'absolute',
            top: -200,
            right: 10,
            zIndex: 100,
          }}
        />
        <Button
          onclick={() => {
            const form = new FormData();
            form.append('id', images[index].key);
            axios
              .delete('/picture', {
                data: form,
              })
              .then(() => {
                const img = images;
                img.splice(index, 1);
                setImages(img);
                if (index === img.length) {
                  setIndex(index - 1);
                }

                window.location.reload();

                return img;
              })
              .catch((err) => {
                return err;
              });
          }}
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
