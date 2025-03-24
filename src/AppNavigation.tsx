import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import CountdownTimer from './CountdownTimer.tsx';
import Setting from './Setting.tsx';
import Break from './Break.tsx';
import Rest from './Rest.tsx';
import { MenuNavigation, MenuRouter } from './MenuNavigation.tsx';
import { AppRouterProps } from './interface.tsx';
import { SettingFilled, SettingTwoTone, MenuOutlined } from '@ant-design/icons';
import TodoList from './TodoList.tsx';

const Navigation = () => {
    return (
        <nav className='navigation'>
            <Link to="/" className="nav-link">Focus</Link>
            <Link to="/break" className="nav-link">Break</Link>
            <Link to="/rest" className="nav-link">Rest</Link>
            <Link to="/setting" className='nav-link-setting'><SettingFilled style={{ fontSize: '18px', color: '#FF6347' }}/></Link>
            <Link to="/MenuNavigation" className='nav-link-setting'><MenuOutlined style={{ fontSize: '18px', color: '#FF6347' }}/></Link>
        </nav>
    );
}

const AppRouter = ({ timerProps }: AppRouterProps) => {
    return (
        <Routes>
            <Route path="/" element={<CountdownTimer {...timerProps} />} />
            <Route path="/break" element={<Break {...timerProps} />} />
            <Route path="/rest" element={<Rest {...timerProps} />} />
            <Route path="/setting" element={<Setting setInputMinutes={timerProps.setInputMinutes}/>} />
            <Route path='/MenuNavigation' element={<MenuNavigation/>} />
        </Routes>
    );
}

export { Navigation, AppRouter };