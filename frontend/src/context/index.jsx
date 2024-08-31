import React, { createContext, useEffect, useState } from 'react';
import io from 'socket.io-client';

export const UserContext = createContext();

// Telegram
const tele = window.Telegram?.WebApp;

export const UserProvider = ({ children }) => {

    const staticUser = import.meta.env.VITE_STATIC_USER;

    const apiUrl = import.meta.env.VITE_API_URL;

    const socket = io(apiUrl);

    const [user, setUser] = useState(null);

    const [balance, setBalance] = useState(0);

    const EnergyLimit = 500; // Set Max Energy 

    const [addCoins, setAddCoins] = useState(1); // Set Coins to add

    const [energy, setEnergy] = useState(EnergyLimit);

    const updateInterval = 5000; // 5 seconds interval


    useEffect(() => {
        const socket = io(apiUrl);
    
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
                } else {
                    telegramUser = tele.initDataUnsafe?.user;
                }
    
                if (telegramUser) {
                    socket.emit('initializeUser', telegramUser.id, telegramUser.first_name, telegramUser.last_name, telegramUser.username);
                } else {
                    console.error("Telegram user data is undefined");
                }
    
                socket.on('userInitialized', (data) => {
                    setUser(data.user)
                    setBalance(data.user.balance)
                    console.log("Data fetched successfully!");
                });
    
                socket.on('error', (error) => {
                    console.error("Socket connection error:", error);
                });
    
                socket.on('disconnect', () => {
                    console.warn("Socket disconnected");
                });
    
            } else {
                console.error("Telegram WebApp is not defined");
            }
        } catch (error) {
            console.error("Telegram WebApp initialization error:", error);
        }
    
        return () => {
            socket.disconnect();
        };
    }, []);
    

    return (
        <UserContext.Provider value={{
            user,
            balance,
            setBalance,
            addCoins,
            setAddCoins,
            energy,
            setEnergy,
            EnergyLimit,
            updateInterval
        }}>
            {children}
        </UserContext.Provider>
    );
};
