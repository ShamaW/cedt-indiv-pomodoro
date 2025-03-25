import { CalendarOutlined, OrderedListOutlined } from '@ant-design/icons';
import React from 'react';
import { Link, Routes } from 'react-router-dom';
import { AppRouterProps } from '../utils/interface.tsx';

const MenuNavigation = () => {
    return (
        <nav className='menu-navigation'>
            <Link to="/TodoList" className="menu-nav-link"><OrderedListOutlined /> To-do list</Link>
            <Link to="/Calendar" className="menu-nav-link"><CalendarOutlined /> Calendar</Link>
        </nav>
    );
}

const MenuRouter = ({ timerProps }: AppRouterProps) => {
    return (
        <Routes>
            {/* <Route path="/TodoList" element={<TodoList />} /> */}
            {/* <Route path="/Calendar" element={<Calendar />} /> */}
        </Routes>
    );
}

export { MenuNavigation, MenuRouter };
