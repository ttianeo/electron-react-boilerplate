import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Gallery from '../../components/gallery/Gallery';
import style from './styles/Photo.module.css';
import Camera from '../../components/camera/Camera';
import Button from '../../components/button/Button';

interface ResetOrGenerateBtnProps {
  onclick: () => void;
  url: string;
}

function ResetOrGenerateBtn({ onclick, url }: ResetOrGenerateBtnProps) {
  return (
    <Button
      onclick={() => {
        onclick();
      }}
      icon={
        url === '' ? (
          <span
            style={{
              fontFamily: 'ArtSDIcon',
            }}
          >
            &#xe640;
          </span>
        ) : (
          <span
            style={{
              fontFamily: 'ArtSDIcon',
            }}
          >
            &#xe692;
          </span>
        )
      }
      style={{
        position: 'absolute',
        top: -180,
        right: 10,
        zIndex: 100,
      }}
    />
  );
}

export default function Photo() {
  const [index, setIndex] = useState(0);
  const router = useNavigate();
  const [styles, setStyles] = useState([
    { key: '1', src: 'https://iph.href.lu/500x800?fg=666666&bg=cccccc&text=1' },
    { key: '2', src: 'https://iph.href.lu/500x800?fg=666666&bg=cccccc&text=2' },
    { key: '3', src: 'https://iph.href.lu/500x800?fg=666666&bg=cccccc&text=3' },
  ]);
  const [gen, setGen] = useState([
    { key: '1', src: '', imgID: '' },
    { key: '2', src: '', imgID: '' },
    { key: '3', src: '', imgID: '' },
  ]);

  const [curImgUrl, setCurImgUrl] = useState('' as string);

  const [photo, setPhoto] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const generate = () => {
    if (photo) {
      const form = new FormData();
      form.append('img', photo);
      form.append('style', styles[index].key);
      setLoading(true);
      axios
        .post('/generate', form, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        .then((res) => {
          const g = gen;
          g[
            index
          ].src = `${axios.defaults.baseURL}static${res.data.data.static_url}`;
          g[index].imgID = res.data.data.id;
          setGen(g);
          setCurImgUrl(
            `${axios.defaults.baseURL}static${res.data.data.static_url}`,
          );
          setLoading(false);
          return res.data;
        })
        .catch((err) => {
          setLoading(false);
          return err;
        });
    }
  };

  useEffect(() => {
    setCurImgUrl(gen[index].src);
  }, [index, gen]);

  useEffect(() => {
    axios
      .get('/stylelist')
      .then((res) => {
        const s = [] as { key: string; src: string }[];
        const g = [] as { key: string; src: string; imgID: string }[];
        for (let i = 0; i < res.data.data.length; i += 1) {
          s.push({
            key: res.data.data[i].styleid,
            src: `${axios.defaults.baseURL}static${res.data.data[i].path}`,
          });
          g.push({
            key: res.data.data[i].styleid,
            src: ``,
            imgID: '',
          });
        }
        setStyles(s);
        setGen(g);
        return res.data;
      })
      .catch((err) => {
        return err;
      });
  }, []);
  const [status, setStatus] = useState('start');
  return (
    <div className={style.home}>
      <div
        className={style.noopMask}
        style={{
          display: loading ? 'flex' : 'none',
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
      <div className={style.camera}>
        <Camera
          status={status}
          finish={(img) => {
            setStatus('finish');
            setPhoto(img);
          }}
          style={{ display: curImgUrl === '' ? 'block' : 'none' }}
        />

        <img
          id="res"
          src={curImgUrl}
          alt={curImgUrl}
          className={style.bigImg}
          style={{ display: curImgUrl !== '' ? 'block' : 'none' }}
        />
      </div>

      <div className={style.gallery}>
        <Button
          onclick={() => {
            router('/');
          }}
          icon={
            <span
              style={{
                fontFamily: 'ArtSDIcon',
              }}
            >
              &#xe609;
            </span>
          }
          style={{
            position: 'absolute',
            top: -90,
            left: 10,
            zIndex: 100,
          }}
        />
        {status === 'finish' && (
          <>
            <Button
              onclick={() => {
                setCurImgUrl('');
                setStatus('start');
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
                top: -270,
                right: 10,
                zIndex: 100,
              }}
            />
            <ResetOrGenerateBtn
              onclick={() => {
                generate();
              }}
              url={curImgUrl}
            />
          </>
        )}
        {curImgUrl !== '' && (
          <Button
            onclick={() => {
              // 保存当前图像
              const form = new FormData();
              form.append(
                'id',
                gen.find((g) => g.src === curImgUrl)?.imgID || '',
              );
              axios
                .post('/save', form)
                .then((res) => {
                  router('/');
                  return res.data;
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
                &#xe866;
              </span>
            }
            style={{
              position: 'absolute',
              top: -90,
              right: 10,
              zIndex: 100,
            }}
          />
        )}
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
