import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { ReactNode } from 'react';
import styles from './Loading.module.css';

export default function Loading(): ReactNode {
    return (
        <section className={styles['loading-container']}>
            <DotLottieReact
                src="https://lottie.host/f3c2285a-b15a-4fbf-aca7-7adc17c83b78/Q3nJIISROl.lottie"
                loop
                autoplay
            />
            <span className={styles['loading-text']}>Loading...</span>
        </section>
    );
}
