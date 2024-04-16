import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Gallery from '../../components/gallery/Gallery';
import style from './styles/Home.module.css';

export default function Home() {
  const [index, setIndex] = useState(0);
  const [images] = useState([
    { key: '1', src: 'https://iph.href.lu/500x800?fg=666666&bg=cccccc&text=1' },
    { key: '2', src: 'https://iph.href.lu/500x800?fg=666666&bg=cccccc&text=2' },
    { key: '3', src: 'https://iph.href.lu/500x800?fg=666666&bg=cccccc&text=3' },
    { key: '4', src: 'https://iph.href.lu/500x800?fg=666666&bg=cccccc&text=4' },
    { key: '5', src: 'https://iph.href.lu/500x800?fg=666666&bg=cccccc&text=5' },
    { key: '6', src: 'https://iph.href.lu/500x800?fg=666666&bg=cccccc&text=6' },
    { key: '7', src: 'https://iph.href.lu/500x800?fg=666666&bg=cccccc&text=7' },
    { key: '8', src: 'https://iph.href.lu/500x800?fg=666666&bg=cccccc&text=8' },
    { key: '9', src: 'https://iph.href.lu/500x800?fg=666666&bg=cccccc&text=9' },
    {
      key: '10',
      src: 'https://iph.href.lu/500x800?fg=666666&bg=cccccc&text=10',
    },
    {
      key: '11',
      src: 'https://iph.href.lu/500x800?fg=666666&bg=cccccc&text=11',
    },
    {
      key: '12',
      src: 'https://iph.href.lu/500x800?fg=666666&bg=cccccc&text=12',
    },
    {
      key: '13',
      src: 'https://iph.href.lu/500x800?fg=666666&bg=cccccc&text=13',
    },
  ]);

  const router = useNavigate();
  return (
    <div className={style.home}>
      <img
        src={images[index].src}
        alt={images[index].key}
        className={style.bigImg}
      />
      <div className={style.gallery}>
        <div
          onClick={() => {
            router('/photo');
          }}
          onKeyDown={() => {}}
          role="button"
          tabIndex={0}
        >
          去拍照
        </div>
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
