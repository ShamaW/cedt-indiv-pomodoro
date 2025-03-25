import React, { useEffect, useState } from 'react';
import Layout from './components/Layout.tsx';
import { NotificationProvider } from './context/SystemNotificationContext.tsx';
import useCountdownTimer from './hooks/useCountdownTimer.tsx';
import { AppRouter } from './navigation/AppNavigation.tsx';

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