import React from 'react';
import styles from './BaseInput.module.css';

interface BaseInputProps {
    placeholder: string;
}

const BaseInput: React.FC<BaseInputProps> = ({ placeholder = "" }) => {
  return (
      <>
        <input className={styles.baseInput} placeholder={placeholder} type="text" />
      </>
  );
}

export default BaseInput;