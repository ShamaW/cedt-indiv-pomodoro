import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import CountdownTimer from './CountdownTimer.tsx';
import Setting from './Setting.tsx';

const Navigation = () => {
    return (
        <nav className='navigation'>
            <Link to="/" className="nav-link">Timer</Link>
            <Link to="/setting" className='nav-link'>Setting</Link>
        </nav>
    );
}

const AppRouter = () => {
    return (
        <Routes>
            <Route path="/" element={<CountdownTimer />} />
            <Route path="/setting" element={<Setting />} />
        </Routes>
    );
}

export { Navigation, AppRouter };