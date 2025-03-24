import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { AppRouterProps } from './interface.tsx';
import { OrderedListOutlined, CalendarOutlined } from '@ant-design/icons';
import TodoList from './TodoList.tsx';

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