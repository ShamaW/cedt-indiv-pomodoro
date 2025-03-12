import React from "react";
import { Navigation } from "./AppNavigation";

interface LayoutProps {
    children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) =>{
    return (
        <main className="container">
            <h1>Pomo by ShamaW</h1>
            <Navigation />
            {children}
        </main>
    );
}

export default Layout