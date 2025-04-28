import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { ReactNode } from 'react';

export default function Loading(): ReactNode {
    return (
        <>
            <DotLottieReact
                src="https://lottie.host/f3c2285a-b15a-4fbf-aca7-7adc17c83b78/Q3nJIISROl.lottie"
                loop
                autoplay
            />
            Loading...
        </>
    );
}
