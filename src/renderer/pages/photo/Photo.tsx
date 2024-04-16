import { useState } from 'react';
import Gallery from '../../components/gallery/Gallery';
import style from './styles/Photo.module.css';
import Camera from '../../components/camera/Camera';

export default function Photo() {
  const [index, setIndex] = useState(0);
  const [styles] = useState([
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
  const [status, setStatus] = useState('start');
  return (
    <div className={style.home}>
      <div className={style.camera}>
        <Camera
          status={status}
          finish={() => {
            setStatus('finish');
          }}
        />
      </div>
      <div className={style.gallery}>
        <Gallery
          images={styles}
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
