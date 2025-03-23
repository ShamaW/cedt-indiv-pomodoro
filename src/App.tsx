import React, { useState, useEffect } from 'react';
import { AppRouter } from './AppNavigation.tsx';
import Layout from './Layout.tsx';
import useCountdownTimer from './useCountdownTimer.tsx';
import { NotificationProvider } from './SystemNotificationContext.tsx';

function AppContent() {
    const [currentTime, setCurrentTime] = useState(new Date());
    const timerProps = useCountdownTimer();

    useEffect(() => {
        const timer = setInterval(() => {setCurrentTime(new Date());}, 1000);
        return () => clearInterval(timer);
    }, [])

    return (
        <Layout>
            <div className="time-display">
                {/* <p>Current Time: {currentTime.toLocaleTimeString(undefined, {hour12: false})} | {currentTime.toLocaleDateString(undefined, {dateStyle:'medium'})}</p> */}
            </div>
            <AppRouter timerProps={timerProps} />
        </Layout>
    );
}

function App() {
    return (
        <NotificationProvider>
            <AppContent />
        </NotificationProvider>
    );
}

export default App;