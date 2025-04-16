import { useTheme } from '@hooks/useTheme.hooks';
import { isNumber } from '@utils/functions/is-number';

type LogoSize = {
    w?: number | 'auto';
    h?: number | 'auto';
};

type LogoProps = {
    size?: LogoSize;
    classes?: string[];
};

export default function Logo({ size = { w: 200, h: 'auto' }, classes }: LogoProps) {
    const { theme } = useTheme();

    const style = {
        width: isNumber(size.w) ? `${size.w}px` : size.w,
        height: isNumber(size.h) ? `${size.h}px` : size.h,
    };

    const className = classes?.join(' ');

    const iconType =
        theme === 'dark' ? (
            <img
                src="/taskmate-logo-dark.png"
                alt="Taskmate logo dark"
                style={style}
                className={className}
            />
        ) : (
            <img
                src="/taskmate-logo-light.png"
                alt="Taskmate logo light"
                style={style}
                className={className}
            />
        );

    return iconType;
}
