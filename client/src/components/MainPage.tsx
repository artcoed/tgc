import React from 'react';
import styles from './MainPage.module.css';
import Navbar from "./Navbar";
import { ReactComponent as CopyIcon } from '../assets/main/copy.svg';
import { ReactComponent as TonIcon } from '../assets/main/tonIcon.svg';
import { ReactComponent as NextArrowIcon } from '../assets/main/nextArrowIcon.svg';
import { ReactComponent as TradeIcon } from '../assets/main/tradeIcon.svg';
import { ReactComponent as RouletteIcon } from '../assets/main/rouletteIcon.svg';
import { ReactComponent as BonusIcon } from '../assets/main/bonusIcon.svg';
import userAvatar from '../assets/main/userAvatar.png';
import { NavLink } from "react-router-dom";
import { useAuth } from '../contexts/AuthContext';
import { useTelegramApp } from '../hooks/useTelegramApp';
import { trpc } from '../trpc';

const MainPage: React.FC = () => {
  const { user, botId } = useAuth();
  const { user: telegramUser } = useTelegramApp();

  // Получаем данные пользователя из Telegram или базы данных
  const displayName = user?.full_name || telegramUser?.first_name || 'Пользователь';
  const userId = user?.telegram_id || telegramUser?.id || 'N/A';
  const username = user?.username || telegramUser?.username || '';
  
  // Загружаем баланс и статистику
  const { data: balanceData, isLoading: isLoadingBalance } = trpc.getUserBalance.useQuery(
    { telegramId: Number(userId), botId: botId || 1 },
    { enabled: !!userId && userId !== 'N/A' && !!botId }
  );

  const { data: statsData, isLoading: isLoadingStats } = trpc.getUserStats.useQuery(
    { telegramId: Number(userId), botId: botId || 1 },
    { enabled: !!userId && userId !== 'N/A' && !!botId }
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

  const copyUserId = () => {
    navigator.clipboard.writeText(userId.toString());
  };

  return (
    <div className={styles.wrapper}>
      <Navbar />

      <div className={styles.container}>
        <div className={styles.topContainer}>
          <div className={styles.leftContainer}>
            <NavLink to="/profile">
              <img
                  className={styles.userAvatar}
                  src={userAvatar}
                  alt="user avatar"
              />
            </NavLink>
            <div className={styles.leftContainerText}>
              <div className={styles.leftContainerUsername}>
                {displayName}
              </div>
              <div className={styles.leftContainerId}>
                ID: {userId}
              </div>
            </div>
          </div>
          <div className={styles.rightContainer}>
            <button className={styles.copyIconButton} onClick={copyUserId}>
              <CopyIcon className={styles.copyIcon} />
            </button>
          </div>
        </div>

        <div className={styles.balanceContainer}>
          <div className={styles.balanceTitle}>
            БАЛАНС КОШЕЛЬКА
          </div>
          <div className={styles.balanceValue}>
            €{isLoadingBalance ? '...' : balanceData?.balance?.toFixed(2) || '0.00'}
          </div>

          <NavLink to="/profile" className={styles.balanceMovementContainer}>
            <div className={styles.balanceMovementTopContainer}>
              <div className={styles.balanceMovementTopTitle}>
                Динамика за сутки
              </div>
              <div className={styles.balanceMovementTopValue}>
                {isLoadingBalance ? '...' : `+${balanceData?.dailyChange?.toFixed(2) || '0.00'}%`}
              </div>
            </div>
            <div className={styles.balanceMovementBottomContainer}>
              <div className={styles.balanceMovementBottomLeftContainer}>
                <div className={styles.balanceMovementBottomLeftTitle}>
                  BASE / EUR
                </div>
                <div className={styles.balanceMovementBottomLeftValue}>
                  €{isLoadingBalance ? '...' : balanceData?.exchangeRate?.toFixed(3) || '1.135'}
                </div>
              </div>
              <TonIcon className={styles.balanceMovementBottomIcon} />
            </div>
          </NavLink>
        </div>

        <div className={styles.navigationButtonsContainer}>
          <NavLink to="/trading" className={styles.navigationButtonContainer}>
            <div className={styles.navigationButtonLeftContainer}>
              <TradeIcon className={styles.navigationButtonIcon} />
              <div className={styles.navigationButtonText}>
                Трейдинг
              </div>
            </div>
            <NextArrowIcon className={styles.nextArrowIcon} />
          </NavLink>

          <NavLink to="/roulette" className={styles.navigationButtonContainer}>
            <div className={styles.navigationButtonLeftContainer}>
              <RouletteIcon className={styles.navigationButtonIcon} />
              <div className={styles.navigationButtonText}>
                Рулетка
              </div>
            </div>
            <NextArrowIcon className={styles.nextArrowIcon} />
          </NavLink>

          <NavLink to="/bonuses" className={styles.navigationButtonContainer}>
            <div className={styles.navigationButtonLeftContainer}>
              <BonusIcon className={styles.navigationButtonIcon} />
              <div className={styles.navigationButtonText}>
                Бонусы
              </div>
            </div>
            <NextArrowIcon className={styles.nextArrowIcon} />
          </NavLink>
        </div>
      </div>
    </div>
  );
}

export default MainPage;