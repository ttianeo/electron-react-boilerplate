import React from 'react';
import styles from './styles/Button.module.css';

export interface ButtonProps {
  onclick: (e: React.MouseEvent) => void;
  style?: React.CSSProperties;
  icon: React.ReactNode;
}

export default function Button({ onclick, style, icon }: ButtonProps) {
  return (
    <button
      onClick={(e) => {
        onclick(e);
      }}
      onKeyDown={() => {}}
      tabIndex={0}
      type="button"
      style={{ ...style, ...{ fontStyle: 'normal' } }}
      className={styles.button}
    >
      {icon}
    </button>
  );
}

Button.defaultProps = {
  style: {},
};
