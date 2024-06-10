import React, { useEffect } from 'react';
import BScroll from '@better-scroll/core';
import style from './styles/Gallery.module.css';

export interface GalleryProps {
  images: { key: string; src: string; nickname: string | null }[];
  active?: number;
  width?: number | string;
  gap?: string;
  select?: (index: number) => void;
  more?: () => void;
}

export default function Gallery({
  images,
  active,
  width,
  gap,
  select,
  more,
}: GalleryProps) {
  const ref = React.useRef<HTMLDivElement | null>(null);
  const [bs, setBs] = React.useState<BScroll | null>(null);

  const [last, setLast] = React.useState<number>(0);

  useEffect(() => {
    if (ref.current) {
      const s = new BScroll(ref.current, {
        probeType: 3,
        scrollX: true,
        scrollY: false,
        click: true,
        disableTouch: false,
      });
      s.on('scrollEnd', (e: { x: number }) => {
        const maxX = s.maxScrollX;
        if (Math.abs(e.x - maxX) < 30) {
          setLast(images.length - 1);
          more?.();
        }
      });
      s.on('refresh', () => {
        s.scrollToElement(`#gallery-${last}`, 0, true, true);
      });

      setBs(s);
      return () => {
        s.destroy();
      };
    }
    return () => {};
  }, [more, ref]);

  return (
    <div className={style.horizontal}>
      <div
        className={style.wrapper}
        ref={(c) => {
          ref.current = c;
        }}
      >
        <div className={style.content}>
          {images.map((image, index) => (
            <div
              key={image.key}
              className={
                style.item + (active === index ? ` ${style.active}` : ``)
              }
              onClick={() => {
                if (select) {
                  select(images.indexOf(image));
                }
              }}
              role="button"
              tabIndex={0}
              onKeyDown={() => {}}
              style={{
                marginRight: gap,
                width,
              }}
              id={`gallery-${index}`}
            >
              <img
                src={image.src}
                alt={image.key}
                onLoad={() => {
                  bs?.refresh();
                  console.log('refresh');
                }}
                style={{
                  marginRight: gap,
                  width: '100%',
                }}
              />
              {image.nickname && (
                <div
                  style={{
                    position: 'relative',
                    top: -96,
                    textAlign: 'left',
                    fontSize: 56,
                  }}
                  className={
                    style.labelCT + (active === index ? ` ${style.active}` : ``)
                  }
                >
                  <span
                    className={
                      style.label + (active === index ? ` ${style.active}` : ``)
                    }
                  >
                    {image.nickname}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

Gallery.defaultProps = {
  gap: 10,
  width: 280,
  active: 0,
  select: () => {},
  more: () => {},
};
