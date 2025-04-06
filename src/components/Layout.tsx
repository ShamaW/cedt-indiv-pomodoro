import React from 'react';
import '../styles/Layout.css';
import { LayoutProps } from '../utils/interface';

const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <div className="layout">
            <div className="main-content">
                {children}
            </div>
        </div>
    );
};

export default Layout;