import React, {useCallback, useEffect, useRef, useState} from 'react';
import styles from './RouletteWindow.module.css';
import { ReactComponent as ClearIcon } from '../assets/roulette/clear.svg';
import { ReactComponent as BackArrowIcon } from '../assets/roulette/backArrow.svg';
import { ReactComponent as ArrowIcon } from '../assets/roulette/arrow.svg';
import { ReactComponent as LoseIcon } from '../assets/roulette/loseIcon.svg';
import { ReactComponent as WinIcon } from '../assets/roulette/winIcon.svg';
import wheelImage from '../assets/roulette/wheel.png';
import Navbar from "./Navbar";
import {NavLink} from "react-router-dom";
import { useAuth } from '../contexts/AuthContext';
import { trpc } from '../trpc';

const RouletteWindow: React.FC = () => {
    const { user, telegramUser, botId } = useAuth();
    const [isSpinning, setIsSpinning] = useState(false);
    const [result, setResult] = useState<number | null>(null);
    const [betAmount, setBetAmount] = useState(100);
    const [showResultModal, setShowResultModal] = useState(false);
    const [modalResult, setModalResult] = useState<{
        isWin: boolean;
        winAmount: number;
        newBalance: number;
        attemptsLeft: number;
    } | null>(null);
    const wheelRef = useRef<HTMLImageElement>(null);
    const numbers = [0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5, 24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26];
    const colorMap: { [key: number]: 'black' | 'red' | 'green' } = {
        0: 'green',
        32: 'red', 15: 'black', 19: 'red', 4: 'black', 21: 'red', 2: 'black', 25: 'red',
        17: 'black', 34: 'red', 6: 'black', 27: 'red', 13: 'black', 36: 'red', 11: 'black',
        30: 'red', 8: 'black', 23: 'red', 10: 'black', 5: 'red', 24: 'black', 16: 'red',
        33: 'black', 1: 'red', 20: 'black', 14: 'red', 31: 'black', 9: 'red', 22: 'black',
        18: 'red', 29: 'black', 7: 'red', 28: 'black', 12: 'red', 35: 'black', 3: 'red',
        26: 'black'
    };

    // tRPC queries and mutations
    const { data: rouletteInfo, refetch: refetchRouletteInfo } = trpc.getRouletteInfo.useQuery(
        { telegramId: telegramUser?.id || 0, botId: botId || 1 },
        { enabled: !!telegramUser?.id && !!botId }
    );
    const placeBetMutation = trpc.placeBet.useMutation();

    const startSpin = useCallback(async (color: 'black' | 'red' | 'green') => {
        if (isSpinning || !telegramUser?.id) return;
        
        setIsSpinning(true);
        setResult(null);
        setShowResultModal(false);
        setModalResult(null);

        // Анимация колеса
        const randomRotations = Math.floor(Math.random() * 5) + 3;
        const randomOffset = Math.floor(Math.random() * 360);
        const totalDegrees = randomRotations * 360 + randomOffset;

        if (wheelRef.current) {
            wheelRef.current.style.transform = `rotate(${totalDegrees}deg)`;
            wheelRef.current.style.transition = 'transform 3s ease-out';

            // Делаем ставку через tRPC
            try {
                const betResult = await placeBetMutation.mutateAsync({
                    telegramId: telegramUser.id,
                    botId: botId || 1,
                    betAmount,
                    betColor: color,
                });

                // Ждем окончания анимации
                setTimeout(() => {
                    setResult(betResult.number);
                    setModalResult({
                        isWin: betResult.isWin,
                        winAmount: betResult.winAmount,
                        newBalance: betResult.newBalance,
                        attemptsLeft: betResult.attemptsLeft,
                    });
                    setShowResultModal(true);
                    setIsSpinning(false);
                    
                    // Обновляем информацию о рулетке
                    refetchRouletteInfo();
                }, 3000);
            } catch (error) {
                console.error('Bet error:', error);
                setIsSpinning(false);
                // Показываем ошибку пользователю
                alert(error instanceof Error ? error.message : 'Ошибка при размещении ставки');
            }
        }
    }, [isSpinning, betAmount, telegramUser?.id, placeBetMutation, refetchRouletteInfo]);

    const handleBetAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseFloat(e.target.value) || 0;
        setBetAmount(Math.max(10, Math.min(value, rouletteInfo?.balance || 1000)));
    };

    const clearBetAmount = () => {
        setBetAmount(100);
    };

    const closeResultModal = () => {
        setShowResultModal(false);
        setModalResult(null);
    };

    const getStatus = () => {
        if (result === null) return '';
        const resultColor = colorMap[result];
        return modalResult?.isWin ? 'Выиграл!' : 'Проиграл!';
    };

    const maxBet = rouletteInfo ? Math.min(rouletteInfo.balance * 0.95, rouletteInfo.balance) : 1000;

    return (
        <div className={styles.wrapper}>
            {showResultModal && modalResult && (
                <div className={styles.modalResultWindowContainer}>
                    <div className={`${styles.modalResultWindow} ${modalResult.isWin ? styles.modalWinWindow : styles.modalLoseWindow}`}>
                        <button className={styles.closeIconContainer} onClick={closeResultModal}>
                            ×
                        </button>
                        <div className={styles.iconContainer}>
                            {modalResult.isWin ? (
                                <WinIcon className={styles.resultIconWindow} />
                            ) : (
                                <LoseIcon className={styles.resultIconWindow} />
                            )}
                        </div>
                        <div className={styles.modalResultTitle}>
                            {modalResult.isWin ? 'ВЫИГРЫШ!' : 'ПРОИГРЫШ!'}
                        </div>
                        <div className={styles.modalResultDescription}>
                            {modalResult.isWin ? 'Поздравляем с победой!' : 'Попробуйте еще раз!'}
                        </div>
                        <div className={styles.modalResultValue}>
                            {modalResult.isWin ? `+${modalResult.winAmount.toFixed(2)}` : `-${betAmount.toFixed(2)}`}
                        </div>
                        <div className={styles.modalResultCurrency}>
                            {rouletteInfo?.currency || 'EUR'}
                        </div>
                        <div className={styles.modalResultBalance}>
                            Баланс: {modalResult.newBalance.toFixed(2)} {rouletteInfo?.currency || 'EUR'}
                        </div>
                        <div className={styles.modalResultAttempts}>
                            Осталось попыток: {modalResult.attemptsLeft}/5
                        </div>
                    </div>
                </div>
            )}

            <Navbar />

            <div className={styles.container}>
                <NavLink to='/' className={styles.backArrow}>
                    <BackArrowIcon className={styles.backArrowIcon} />
                </NavLink>
                <div className={styles.rouletteTitle}>Рулетка</div>
                <div className={styles.rouletteDesc}>Проверь свое везение</div>

                <div className={styles.wheelContainer}>
                    <img
                        ref={wheelRef}
                        className={`${styles.wheel} ${isSpinning ? styles.spinning : ''}`}
                        src={wheelImage}
                        alt="wheel"
                    />
                    <ArrowIcon className={styles.arrowIcon} />
                </div>

                {!isSpinning && (
                    <>
                        <div className={styles.betHeaderContainer}>
                            <div className={styles.betHeaderTitle}>Размер ставки</div>
                            <div className={styles.tryingCount}>
                                {rouletteInfo?.attemptsLeft || 5}/5 попыток
                            </div>
                        </div>
                        <div className={styles.betAmountContainer}>
                            <input 
                                className={styles.betAmount} 
                                value={betAmount} 
                                onChange={handleBetAmountChange}
                                type="number"
                                min="10"
                                max={maxBet}
                                step="10"
                            />
                            <button className={styles.clearIconContainer} onClick={clearBetAmount}>
                                <ClearIcon className={styles.clearIcon} />
                            </button>
                        </div>
                        <div className={styles.limitBetsContainer}>
                            <button className={styles.minBet}>Мин: 10</button>
                            <button className={styles.maxBet}>Макс: {maxBet.toFixed(2)}</button>
                        </div>
                        <div className={styles.balanceInfo}>
                            Баланс: {rouletteInfo?.balance?.toFixed(2) || '0.00'} {rouletteInfo?.currency || 'EUR'}
                        </div>
                        <div className={styles.colorsContainer}>
                            <button
                                className={`${styles.color} ${styles.colorBlack}`}
                                onClick={() => startSpin('black')}
                                disabled={isSpinning || (rouletteInfo?.attemptsLeft || 0) <= 0 || !botId}
                            >
                                x2
                            </button>
                            <button
                                className={`${styles.color} ${styles.colorRed}`}
                                onClick={() => startSpin('red')}
                                disabled={isSpinning || (rouletteInfo?.attemptsLeft || 0) <= 0 || !botId}
                            >
                                x2
                            </button>
                            <button
                                className={`${styles.color} ${styles.colorGreen}`}
                                onClick={() => startSpin('green')}
                                disabled={isSpinning || (rouletteInfo?.attemptsLeft || 0) <= 0 || !botId}
                            >
                                x10
                            </button>
                        </div>
                    </>
                )}

                {isSpinning && <div className={styles.timer}>Прокрутка началась</div>}

                {result !== null && !showResultModal && (
                    <div className={`${styles.result} ${styles[`result${colorMap[result]}`]}`}>
                        Результат: {result} - {getStatus()}
                    </div>
                )}
            </div>
        </div>
    );
}

export default RouletteWindow;