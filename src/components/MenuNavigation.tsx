import { CalendarOutlined, OrderedListOutlined } from '@ant-design/icons';
import React from 'react';
import { Link } from 'react-router-dom';

const MenuNavigation = () => {
    return (
        <nav className='menu-navigation'>
            <Link to="/TodoList" className="menu-nav-link"><OrderedListOutlined /> To-do list</Link>
            <Link to="/Calendar" className="menu-nav-link"><CalendarOutlined /> Calendar</Link>
        </nav>
    );
}


export { MenuNavigation };
