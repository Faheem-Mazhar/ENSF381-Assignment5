import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    // Check for existing authentication on app load
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const storedAuth = localStorage.getItem('isAuthenticated');
        
        if (storedUser && storedAuth === 'true') {
            setUser(JSON.parse(storedUser));
            setIsAuthenticated(true);
        }
        
        setLoading(false);
    }, []);

    // Update localStorage when auth state changes
    useEffect(() => {
        if (user && isAuthenticated) {
            localStorage.setItem('user', JSON.stringify(user));
            localStorage.setItem('isAuthenticated', 'true');
        } else {
            localStorage.removeItem('user');
            localStorage.removeItem('isAuthenticated');
        }
    }, [user, isAuthenticated]);

    const logout = () => {
        setUser(null);
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ 
            user, 
            setUser, 
            isAuthenticated, 
            setIsAuthenticated,
            logout,
            loading
        }}>
            {children}
        </AuthContext.Provider>
    );
};