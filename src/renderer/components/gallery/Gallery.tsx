import React, { useEffect } from 'react';
import BScroll from '@better-scroll/core';
import style from './styles/Gallery.module.css';

export interface GalleryProps {
  images: { key: string; src: string }[];
  active?: number;
  width?: number;
  gap?: string;
  select?: (index: number) => void;
}

export default function Gallery({
  images,
  active,
  width,
  gap,
  select,
}: GalleryProps) {
  const ref = React.useRef<HTMLDivElement | null>(null);
  const [bs, setBs] = React.useState<BScroll | null>(null);

  // BSroll
  useEffect(() => {
    if (ref.current) {
      const s = new BScroll(ref.current, {
        scrollX: true,
        scrollY: false,
        click: true,
        HWCompositing: true,
        momentum: false,
      });
      setBs(s);
      return () => {
        s.destroy();
      };
    }
    return () => {};
  }, [ref]);

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
            >
              <img
                src={image.src}
                alt={image.key}
                onLoad={() => {
                  bs?.refresh();
                }}
                style={{
                  marginRight: gap,
                  width,
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

Gallery.defaultProps = {
  gap: 10,
  width: 120,
  active: 0,
  select: () => {},
};
