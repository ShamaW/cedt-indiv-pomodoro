import React from "react";
import { Navigation } from "../navigation/AppNavigation";
import { LayoutProps } from "../utils/interface";

const Layout = ({ children }: LayoutProps) =>{
    return (
        <main className="container">
            <Navigation />
            {children}
        </main>
    );
}

export default Layout