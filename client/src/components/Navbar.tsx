import React, {useState} from 'react';
import styles from './Navbar.module.css';
import { ReactComponent as Withdraw } from '../assets/nav/withdraw.svg';
import { ReactComponent as Manager } from '../assets/nav/manager.svg';
import { ReactComponent as History } from '../assets/nav/history.svg';
import { ReactComponent as Success } from '../assets/withdraw/success.svg';

const Navbar: React.FC = () => {
    const [isShowModal, setIsShowModal] = useState(false);
    const [isShowToast, setIsToast] = useState(false);

    const openWithdrawWindow = () => {
        setIsShowModal(true)
    }

    const cancelWithdraw = () => {
        setIsShowModal(false)
    }

    const withdraw = () => {
        setIsShowModal(false)
        setIsToast(true)
        setTimeout(() => {
            setIsToast(false)
        }, 2000)
    }

    return (
        <>
            <nav className={styles.navWrapper}>
                <div className={styles.navContainer}>
                    <button className={styles.navElement} onClick={openWithdrawWindow}>
                        <Withdraw className={styles.navWithdrawIcon} />
                        Вывод
                    </button>
                    <button className={styles.navElement}>
                        <Manager className={styles.navManagerIcon} />
                        Менеджер
                    </button>
                    <button className={styles.navElement}>
                        <History className={styles.navHistoryIcon} />
                        История
                    </button>
                </div>
            </nav>

            {isShowToast && (
                <div className={styles.toastWithdrawContainer}>
                    <div className={styles.toastWithdraw}>
                        <div className={styles.successContainer}>
                            <Success className={styles.successIcon} />
                        </div>
                        <div>
                            Вывод в обработке, подробности уточните у менеджера
                        </div>
                    </div>
                </div>
            )}

            {isShowModal && (
                <div className={styles.modalWithdrawContainer}>
                    <div className={styles.modalWithdraw}>
                        <div className={styles.modalWithdrawTop}>
                            Вывод
                        </div>
                        <div className={styles.modalWithdrawCenter}>
                            Вы хотите вывести всю сумму?
                        </div>
                        <div className={styles.modalWithdrawBottom}>
                            <button className={styles.modalWithdrawNot} onClick={cancelWithdraw}>
                                Нет
                            </button>
                            <button className={styles.modalWithdrawYes} onClick={withdraw}>
                                Да
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default Navbar;