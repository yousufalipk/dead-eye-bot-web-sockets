import React, { createContext, useEffect, useState } from 'react';
import axios from 'axios';

export const UserContext = createContext();
// Telegram
const tele = window.Telegram?.WebApp;

export const UserProvider = ({ children }) => {
    const staticUser = import.meta.env.VITE_STATIC_USER;
    const apiUrl = import.meta.env.VITE_API_URL;
    
    const [user, setUser] = useState(null);
    const [balance, setBalance] = useState(0);
    
    useEffect(() => {
        const initTelegramWebApp = async () => {
            try {
                if (tele) {
                    tele.expand();
                    tele.ready();

                    let telegramUser;
                    if (staticUser === 'true') {
                        const staticTelegramUser = {
                            id: '03021223335',
                            first_name: 'John',
                            last_name: 'Doe',
                            username: 'johndoe_1'
                        };
                        setUser(staticTelegramUser);
                    } 
                    else {
                        telegramUser = tele.initDataUnsafe?.user;
                        setUser(telegramUser);
                    }
                } else {
                    console.error("Telegram WebApp is not defined");
                }
            } catch (error) {
                console.error("Telegram WebApp initialization error", error);
            }
        };
        initTelegramWebApp();
    }, []);

    return (
        <UserContext.Provider value={{
            user,
            balance,
            setBalance
        }}>
            {children}
        </UserContext.Provider>
    );
};
