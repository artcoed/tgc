import React, {useState} from 'react';
import styles from './RouletteRegistrationBlock.module.css';
import { ReactComponent as ToastIcon } from '../assets/regstration/toastIcon.svg';
import buxImage from '../assets/regstration/bux.png';
import BaseInput from "./BaseInput";

const RouletteRegistrationBlock: React.FC = () => {
  const [toast, setToast] = useState<string | null>(null);

  return (
      <div className={styles.wrapper}>
        <div className={styles.container}>
          {toast && (
              <div className={styles.toastContainer}>
                <ToastIcon className={styles.toastIcon} />
                <div className={styles.toastText}>
                  { toast }
                </div>
              </div>
          )}

          <img
              className={styles.buxImage}
              src={buxImage}
              alt="bux image"
          />

          <div className={styles.registrationTitle}>
            Регистрация
          </div>

          <div className={styles.inputsContainer}>
            <div className={styles.inputTitle}>
              ФИО
            </div>
            <BaseInput placeholder={"ФИО"} />
            <div className={styles.inputTitle}>
              Возраст
            </div>
            <BaseInput placeholder={"Возраст"} />
            <div className={styles.inputTitle}>
              Город
            </div>
            <BaseInput placeholder={"Город"} />
            <div className={styles.inputTitle}>
              Телефон
            </div>
            <BaseInput placeholder={"Телефон"} />
            <div className={styles.inputTitle}>
              Номер счета IBAN
            </div>
            <BaseInput placeholder={"Номер счета IBAN"} />
          </div>

          <button className={styles.registrationButton}>
            Зарегистрироваться
          </button>
        </div>
      </div>
  );
}

export default RouletteRegistrationBlock;