import { MenuOutlined, OrderedListOutlined, SettingFilled } from '@ant-design/icons';
import React from 'react';
import { Link, Route, Routes } from 'react-router-dom';
import Break from './Break.tsx';
import CountdownTimer from './CountdownTimer.tsx';
import { MenuNavigation } from './MenuNavigation.tsx';
import Rest from './Rest.tsx';
import Setting from './Setting.tsx';
import { AppRouterProps } from './interface.tsx';
import TodoList from './TodoList.tsx';

const Navigation = () => {
    return (
        <nav className='navigation'>
            <Link to="/" className="nav-link">Focus</Link>
            <Link to="/break" className="nav-link">Break</Link>
            <Link to="/rest" className="nav-link">Rest</Link>
            <Link to="/setting" className='nav-link-setting'><SettingFilled style={{ fontSize: '18px', color: '#FF6347' }}/></Link>
            <Link to="/TodoList" className='nav-link-setting'><OrderedListOutlined style={{ fontSize: '18px', color: '#FF6347' }}/></Link>
            <Link to="/MenuNavigation" className='nav-link-setting'><MenuOutlined style={{ fontSize: '18px', color: '#FF6347' }}/></Link>
        </nav>
    );
}

const AppRouter = ({ timerProps, todoProps }: AppRouterProps) => {
    return (
        <Routes>
            <Route path="/" element={<CountdownTimer {...timerProps} />} />
            <Route path="/break" element={<Break {...timerProps} />} />
            <Route path="/rest" element={<Rest {...timerProps} />} />
            <Route path="/setting" element={<Setting setInputMinutes={timerProps.setInputMinutes}/>} />
            <Route path='/TodoList' element={<TodoList {... todoProps} />} />
            <Route path='/MenuNavigation' element={<MenuNavigation/>} />
        </Routes>
    );
}

export { Navigation, AppRouter };