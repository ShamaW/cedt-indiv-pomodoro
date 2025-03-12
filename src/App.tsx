import React, { useState, useEffect } from 'react';
import { AppRouter } from './AppNavigation.tsx';
import Layout from './Layout.tsx';

function App() {
    const [currentTime, setCurrentTime] = useState(new Date());

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
            <AppRouter />
        </Layout>
    );
}

export default App;