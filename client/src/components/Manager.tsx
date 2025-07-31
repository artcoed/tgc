import React from 'react';
import styles from './Manager.module.css';
import Navbar from "./Navbar";
import { ReactComponent as BackArrowIcon } from '../assets/roulette/backArrow.svg';
import { ReactComponent as Warning } from '../assets/manager/warning.svg';

const Manager: React.FC = () => {
  return (
      <div className={styles.wrapper}>
        <Navbar />
        <div className={styles.container}>
            <button className={styles.backArrow}>
                <BackArrowIcon className={styles.backArrowIcon} />
            </button>

            <div className={styles.title}>
                Менеджер
            </div>

            <div className={styles.messageContainer}>
                <div className={styles.iconContainer}>
                    <Warning className={styles.warnIcon} />
                </div>
                <div className={styles.message}>
                    В настоящее время менеджер недоступен. Попробуйте позже
                </div>
            </div>
        </div>
      </div>
  );
}

export default Manager;