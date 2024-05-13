import React from 'react';
import styles from './styles/Button.module.css';

export interface ButtonProps {
  onclick: (e: React.MouseEvent) => void;
  style?: React.CSSProperties;
  icon: React.ReactNode;
  text?: string;
  active?: boolean;
}

export default function Button({
  onclick,
  style,
  icon,
  text,
  active,
}: ButtonProps) {
  return (
    <div style={style}>
      {text !== '' && <div className={styles.text}>{text}</div>}
      <button
        onClick={(e) => {
          onclick(e);
        }}
        onKeyDown={() => {}}
        tabIndex={0}
        type="button"
        style={{ fontStyle: 'normal' }}
        className={
          styles.button + (active ? ` ${styles.active}` : ` ${styles.disabled}`)
        }
      >
        {icon}
      </button>
    </div>
  );
}

Button.defaultProps = {
  style: {},
  text: '',
  active: true,
};
