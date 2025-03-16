import React, { useState, useEffect, use } from 'react';
import { AppRouter } from './AppNavigation.tsx';
import Layout from './Layout.tsx';
import useCountdownTimer from './useCountdownTimer.tsx';

function App() {
    const [currentTime, setCurrentTime] = useState(new Date());
    const timerProps = useCountdownTimer();

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, [])

    return (
        <Layout>
            <div className="time-display">
                <p>Current System time: {currentTime.toLocaleTimeString(undefined, {hour12: false})}</p>
                <p>Date: {currentTime.toLocaleDateString(undefined, {dateStyle:'medium'})}</p>
            </div>
            <AppRouter timerProps={timerProps} />
        </Layout>
    );
}

export default App;