import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { LogOut, User } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);

    return (
        <nav className="navbar navbar-expand-lg navbar-custom shadow-sm px-4">
            <div className="container-fluid">
                <span className="navbar-brand mb-0 h1 text-secondary">Retail Management System</span>
                <div className="d-flex align-items-center">
                    <span className="me-3 text-muted">
                        <User size={18} className="me-1" />
                        {user?.username} ({user?.role})
                    </span>
                    <button className="btn btn-outline-danger btn-sm d-flex align-items-center" onClick={logout}>
                        <LogOut size={16} className="me-1" /> Logout
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
