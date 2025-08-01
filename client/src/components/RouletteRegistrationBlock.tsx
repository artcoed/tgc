import React, { useState } from 'react';
import styles from './RouletteRegistrationBlock.module.css';
import { ReactComponent as ToastIcon } from '../assets/regstration/toastIcon.svg';
import buxImage from '../assets/regstration/bux.png';
import BaseInput from "./BaseInput";
import { useAuth } from '../contexts/AuthContext';
import { useTelegramApp } from '../hooks/useTelegramApp';

const RouletteRegistrationBlock: React.FC = () => {
  const [toast, setToast] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    fullName: '',
    age: '',
    city: '',
    phone: '',
    iban: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { registerUser } = useAuth();
  const { hapticFeedback } = useTelegramApp();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const showToast = (message: string) => {
    setToast(message);
    hapticFeedback.notification('success');
    setTimeout(() => setToast(null), 3000);
  };

  const showErrorToast = (message: string) => {
    setToast(message);
    hapticFeedback.notification('error');
    setTimeout(() => setToast(null), 3000);
  };

  const validateForm = () => {
    if (!formData.fullName.trim()) {
      showErrorToast('Введите ФИО');
      return false;
    }
    if (!formData.age.trim() || isNaN(Number(formData.age)) || Number(formData.age) < 18) {
      showErrorToast('Введите корректный возраст (от 18 лет)');
      return false;
    }
    if (!formData.city.trim()) {
      showErrorToast('Введите город');
      return false;
    }
    if (!formData.phone.trim()) {
      showErrorToast('Введите номер телефона');
      return false;
    }
    if (!formData.iban.trim()) {
      showErrorToast('Введите номер счета IBAN');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    hapticFeedback.impact('medium');

    try {
      await registerUser({
        fullName: formData.fullName.trim(),
        age: Number(formData.age),
        city: formData.city.trim(),
        phone: formData.phone.trim(),
        iban: formData.iban.trim(),
      });

      showToast('Регистрация успешно завершена!');
      hapticFeedback.notification('success');
    } catch (error) {
      console.error('Registration error:', error);
      showErrorToast('Ошибка при регистрации. Попробуйте еще раз.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        {toast && (
          <div className={styles.toastContainer}>
            <ToastIcon className={styles.toastIcon} />
            <div className={styles.toastText}>
              {toast}
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
          <BaseInput 
            placeholder={"ФИО"} 
            value={formData.fullName}
            onChange={(e) => handleInputChange('fullName', e.target.value)}
          />
          <div className={styles.inputTitle}>
            Возраст
          </div>
          <BaseInput 
            placeholder={"Возраст"} 
            type="number"
            value={formData.age}
            onChange={(e) => handleInputChange('age', e.target.value)}
          />
          <div className={styles.inputTitle}>
            Город
          </div>
          <BaseInput 
            placeholder={"Город"} 
            value={formData.city}
            onChange={(e) => handleInputChange('city', e.target.value)}
          />
          <div className={styles.inputTitle}>
            Телефон
          </div>
          <BaseInput 
            placeholder={"Телефон"} 
            value={formData.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
          />
          <div className={styles.inputTitle}>
            Номер счета IBAN
          </div>
          <BaseInput 
            placeholder={"Номер счета IBAN"} 
            value={formData.iban}
            onChange={(e) => handleInputChange('iban', e.target.value)}
          />
        </div>

        <button 
          className={styles.registrationButton}
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Регистрация...' : 'Зарегистрироваться'}
        </button>
      </div>
    </div>
  );
}

export default RouletteRegistrationBlock;