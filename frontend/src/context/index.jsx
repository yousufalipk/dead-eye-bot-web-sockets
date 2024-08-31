import React, { createContext, useEffect, useState } from 'react';
export const UserContext = createContext();
import io from 'socket.io-client';

// Telegram
const tele = window.Telegram?.WebApp;

export const UserProvider = ({ children }) => {
    const staticUser = import.meta.env.VITE_STATIC_USER;
    const apiUrl = import.meta.env.VITE_API_URL;
    const socket = io(apiUrl);
    
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
                        telegramUser = {
                            id: '03021223335',
                            first_name: 'John',
                            last_name: 'Doe',
                            username: 'johndoe_1'
                        };
                    } 
                    else {
                        telegramUser = tele.initDataUnsafe?.user;
                    }

                    socket.emit('getInitialBalance', telegramUser.id, telegramUser.first_name, telegramUser.last_name, telegramUser.username);
                    
                    socket.on('userInitialized', (data) => {
                        setUser(data);
                        console.log("Data", data);
                    });
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
