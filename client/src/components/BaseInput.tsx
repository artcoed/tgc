import React from 'react';
import styles from './BaseInput.module.css';

interface BaseInputProps {
    placeholder: string;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    type?: string;
    disabled?: boolean;
}

const BaseInput: React.FC<BaseInputProps> = ({ 
    placeholder = "", 
    value, 
    onChange, 
    type = "text",
    disabled = false 
}) => {
  return (
      <>
        <input 
            className={styles.baseInput} 
            placeholder={placeholder} 
            type={type}
            value={value}
            onChange={onChange}
            disabled={disabled}
        />
      </>
  );
}

export default BaseInput;