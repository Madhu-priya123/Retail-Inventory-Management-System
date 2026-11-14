import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, Users, ReceiptText, FileText, Settings, User as UserIcon, LogOut } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const Sidebar = () => {
    const location = useLocation();
    const { user } = React.useContext(AuthContext);

    const isActive = (path) => location.pathname === path ? 'active' : '';

    return (
        <div className="sidebar-custom vh-100" style={{ width: '250px' }}>
            <div className="p-3 text-center border-bottom border-secondary">
                <h4 className="m-0 text-primary fw-bold">Retail Bill</h4>
            </div>
            <div className="list-group list-group-flush mt-3 px-2">
                <Link to="/" className={`list-group-item list-group-item-action bg-transparent text-white border-0 rounded p-3 mb-1 ${isActive('/')}`}>
                    <LayoutDashboard size={20} className="me-2" /> Dashboard
                </Link>
                <Link to="/inventory" className={`list-group-item list-group-item-action bg-transparent text-white border-0 rounded p-3 mb-1 ${isActive('/inventory')}`}>
                    <Package size={20} className="me-2" /> Inventory
                </Link>
                <Link to="/customers" className={`list-group-item list-group-item-action bg-transparent text-white border-0 rounded p-3 mb-1 ${isActive('/customers')}`}>
                    <Users size={20} className="me-2" /> Customers
                </Link>
                <Link to="/billing" className={`list-group-item list-group-item-action bg-transparent text-white border-0 rounded p-3 mb-1 ${isActive('/billing')}`}>
                    <ReceiptText size={20} className="me-2" /> Billing
                </Link>
                <Link to="/invoices" className={`list-group-item list-group-item-action bg-transparent text-white border-0 rounded p-3 mb-1 ${isActive('/invoices')}`}>
                    <FileText size={20} className="me-2" /> Invoice History
                </Link>
                <Link to="/users" className={`list-group-item list-group-item-action bg-transparent text-white border-0 rounded p-3 mb-1 ${isActive('/users')}`}>
                    <Users size={20} className="me-2" /> User Management
                </Link>
                <Link to="/profile" className={`list-group-item list-group-item-action bg-transparent text-white border-0 rounded p-3 mb-1 ${isActive('/profile')}`}>
                    <Settings size={20} className="me-2" /> Profile Settings
                </Link>
            </div>
        </div>
    );
};

export default Sidebar;
