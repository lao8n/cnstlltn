import { useState, useEffect } from 'react';

export const LoadingDots: React.FC<{style: React.HTMLAttributes<HTMLDivElement>['style']}> = ({style}) => {    

    const [dots, setDots] = useState('');

    useEffect(() => {
        console.log("loading dots")
        const interval = setInterval(() => {
            setDots(prev => (prev.length >= 3 ? '.' : prev + '.'));
        }, 500);

        return () => clearInterval(interval);
    }, []);

    return <div style={style}>{dots}</div>;
};