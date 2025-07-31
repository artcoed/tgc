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

const MainPage: React.FC = () => {
  return (
      <div className={styles.wrapper}>
        <Navbar />

        <div className={styles.container}>
            <div className={styles.topContainer}>
                <div className={styles.leftContainer}>
                    <img
                        className={styles.userAvatar}
                        src={userAvatar}
                        alt="user avatar"
                    />
                    <div className={styles.leftContainerText}>
                        <div className={styles.leftContainerUsername}>
                            Username
                        </div>
                        <div className={styles.leftContainerId}>
                            ID: 12345213
                        </div>
                    </div>
                </div>
                <div className={styles.rightContainer}>
                    <button className={styles.copyIconButton}>
                        <CopyIcon className={styles.copyIcon} />
                    </button>
                </div>
            </div>

            <div className={styles.balanceContainer}>
                <div className={styles.balanceTitle}>
                    БАЛАНС КОШЕЛЬКА
                </div>
                <div className={styles.balanceValue}>
                    €0.00
                </div>

                <div className={styles.balanceMovementContainer}>
                    <div className={styles.balanceMovementTopContainer}>
                        <div className={styles.balanceMovementTopTitle}>
                            Динамика за сутки
                        </div>
                        <div className={styles.balanceMovementTopValue}>
                            +5.21%
                        </div>
                    </div>
                    <div className={styles.balanceMovementBottomContainer}>
                        <div className={styles.balanceMovementBottomLeftContainer}>
                            <div className={styles.balanceMovementBottomLeftTitle}>
                                BASE / EUR
                            </div>
                            <div className={styles.balanceMovementBottomLeftValue}>
                                €1.135
                            </div>
                        </div>
                        <TonIcon className={styles.balanceMovementBottomIcon} />
                    </div>
                </div>
            </div>

            <div className={styles.navigationButtonsContainer}>
                <button className={styles.navigationButtonContainer}>
                    <div className={styles.navigationButtonLeftContainer}>
                        <TradeIcon className={styles.navigationButtonIcon} />
                        <div className={styles.navigationButtonText}>
                            Трейдинг
                        </div>
                    </div>
                    <NextArrowIcon className={styles.nextArrowIcon} />
                </button>

                <button className={styles.navigationButtonContainer}>
                    <div className={styles.navigationButtonLeftContainer}>
                        <RouletteIcon className={styles.navigationButtonIcon} />
                        <div className={styles.navigationButtonText}>
                            Рулетка
                        </div>
                    </div>
                    <NextArrowIcon className={styles.nextArrowIcon} />
                </button>

                <button className={styles.navigationButtonContainer}>
                    <div className={styles.navigationButtonLeftContainer}>
                        <BonusIcon className={styles.navigationButtonIcon} />
                        <div className={styles.navigationButtonText}>
                            Бонусы
                        </div>
                    </div>
                    <NextArrowIcon className={styles.nextArrowIcon} />
                </button>
            </div>
        </div>
      </div>
  );
}

export default MainPage;