import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'default');

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        applyTheme(theme);
        setLoading(false);
    }, []);

    const applyTheme = (newTheme) => {
        document.body.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        setTheme(newTheme);
    };

    const login = (userData) => {
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        if (userData.theme) applyTheme(userData.theme);
    };

    const logout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('theme');
        setUser(null);
        applyTheme('default');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading, theme, applyTheme }}>
            {children}
        </AuthContext.Provider>
    );
};
