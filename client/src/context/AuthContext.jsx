import { createContext, useContext, useEffect, useState } from 'react';
import { loginUser as loginApi } from '../services/liquorService';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = sessionStorage.getItem('liquor_user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = async (mobileNumber, name) => {
        try {
            const userData = await loginApi(mobileNumber, name);
            setUser(userData);
            sessionStorage.setItem('liquor_user', JSON.stringify(userData));
            return userData;
        } catch (error) {
            throw error;
        }
    };

    const adminLogin = async (password) => {
        try {
            const userData = await import('../services/liquorService').then(m => m.loginAdmin(password));
            setUser(userData);
            sessionStorage.setItem('liquor_user', JSON.stringify(userData));
            return userData;
        } catch (error) {
            throw error;
        }
    };

    const logout = () => {
        sessionStorage.removeItem('liquor_user');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, adminLogin, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
