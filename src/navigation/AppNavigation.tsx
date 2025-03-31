import { MenuOutlined, SettingFilled } from '@ant-design/icons';
import React from 'react';
import { Link, Route, Routes } from 'react-router-dom';
import CountdownTimer from '../components/CountdownTimer.tsx';
import { MenuNavigation } from '../components/MenuNavigation.tsx';
import Setting from '../components/Setting.tsx';
import TodoPage from '../pages/TodoPage.tsx';
import { AppRouterProps } from '../utils/interface.tsx';

const Navigation = () => {
    return (
        <nav className='navigation'>
            <Link to="/" className="nav-link">Timer</Link>
            <Link to="/setting" className='nav-link-setting'><SettingFilled style={{ fontSize: '18px', color: '#FF6347' }}/></Link>
            <Link to="/MenuNavigation" className='nav-link-setting'><MenuOutlined style={{ fontSize: '18px', color: '#FF6347' }}/></Link>
        </nav>
    );
}

const AppRouter = ({ timerProps }: AppRouterProps) => {
    return (
        <Routes>
            <Route path="/" element={<CountdownTimer {...timerProps} />} />
            <Route path="/setting" element={<Setting setInputMinutes={timerProps.setInputMinutes}/>} />
            <Route path='/TodoList' element={<TodoPage/>} />
            <Route path='/MenuNavigation' element={<MenuNavigation/>} />
        </Routes>
    );
}

export { AppRouter, Navigation };

