import React from 'react';
import styles from './UserProfile.module.css';
import Navbar from "./Navbar";
import { ReactComponent as BackArrowIcon } from '../assets/roulette/backArrow.svg';
import { ReactComponent as PartnerIcon } from '../assets/profile/partnerStatusIcon.svg';
import userAvatar from '../assets/main/userAvatar.png';
import { NavLink } from "react-router-dom";
import { useAuth } from '../contexts/AuthContext';
import { useTelegramApp } from '../hooks/useTelegramApp';
import { trpc } from '../trpc';

const UserProfile: React.FC = () => {
  const { user, logout } = useAuth();
  const { user: telegramUser } = useTelegramApp();

  // Получаем данные пользователя из Telegram или базы данных
  const displayName = user?.full_name || telegramUser?.first_name || 'Пользователь';
  const userId = user?.telegram_id || telegramUser?.id || 'N/A';
  const username = user?.username || telegramUser?.username || '';
  
  // Загружаем статистику пользователя
  const { data: statsData, isLoading: isLoadingStats } = trpc.getUserStats.useQuery(
    { telegramId: Number(userId) },
    { enabled: !!userId && userId !== 'N/A' }
  );
  
  // Вычисляем время в проекте
  const getDaysInProject = () => {
    if (statsData?.daysInProject !== undefined) {
      const days = statsData.daysInProject;
      return `${days} ${days === 1 ? 'день' : days < 5 ? 'дня' : 'дней'} в проекте`;
    }
    if (!user?.created_at) return '0 дней в проекте';
    const created = new Date(user.created_at);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - created.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return `${diffDays} ${diffDays === 1 ? 'день' : diffDays < 5 ? 'дня' : 'дней'} в проекте`;
  };

  const handleLogout = () => {
    logout();
    // Перенаправляем на главную страницу (которая покажет форму регистрации)
    window.location.href = '/';
  };

  return (
    <div className={styles.wrapper}>
      <Navbar />
      <div className={styles.container}>
        <NavLink to='/' className={styles.backArrow}>
          <BackArrowIcon className={styles.backArrowIcon} />
        </NavLink>

        <img
          className={styles.userAvatar}
          src={userAvatar}
          alt="user avatar"
        />

        <div className={styles.username}>
          {displayName}
        </div>
        <div className={styles.userId}>
          ID: {userId}
        </div>
        <div className={styles.howLong}>
          {isLoadingStats ? 'Загрузка...' : getDaysInProject()}
        </div>

        <div className={styles.statusesContainer}>
          <div className={styles.statusesContainerTitle}>
            Статус пользователя
          </div>
          <div className={styles.statusContainer}>
            <div className={styles.statusIconContainer}>
              <PartnerIcon className={styles.statusIcon}/>
            </div>
            <div className={styles.statusText}>
              {statsData?.status || 'Партнер'}
            </div>
          </div>
        </div>

        <button 
          className={styles.logoutButton}
          onClick={handleLogout}
        >
          Выйти из аккаунта
        </button>
      </div>
    </div>
  );
}

export default UserProfile;