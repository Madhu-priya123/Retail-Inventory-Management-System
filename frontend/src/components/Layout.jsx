import React from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const Layout = ({ children }) => {
    return (
        <div className="d-flex" id="wrapper">
            <Sidebar />
            <div id="page-content-wrapper" className="w-100">
                <Navbar />
                <div className="container-fluid p-4">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Layout;
