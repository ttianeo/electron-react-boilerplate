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
    { key: '2', src: 'https://iph.href.lu/500x800?fg=666666&bg=cccccc&text=2' },
    { key: '3', src: 'https://iph.href.lu/500x800?fg=666666&bg=cccccc&text=3' },
  ]);

  const router = useNavigate();

  useEffect(() => {
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
  }, []);

  return (
    <div className={style.home}>
      <img
        src={images[index].src}
        alt={images[index].key}
        className={style.bigImg}
      />
      <div className={style.gallery}>
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
          onclick={() => {
            router('/photo');
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
