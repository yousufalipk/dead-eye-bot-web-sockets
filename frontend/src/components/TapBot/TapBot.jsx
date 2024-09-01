import React, { useContext, useEffect, useState, useRef } from 'react';
import { UserContext } from '../../context';
import './TapBot.css';

// Importing Images
import DeadEyeLogo from '../../assets/Logo/deadeye.png';
import CoinImg from '../../assets/Coin/coin.png';

let tapBalance = 0;

const TapComponent = () => {
    const { balance,
        setBalance,
        addCoins,
        energy,
        setEnergy,
        EnergyLimit,
        user,
        socket,
        clicks,
        setClicks
    } = useContext(UserContext);


    // WebSockets setup
    useEffect(() => {
        socket.on('balanceUpdated', (data) => {
            setBalance(data.user.balance);
        });

        return () => {
            socket.off('balanceUpdated');
        };
    }, [socket, setBalance]);


    // Update balance every 5 seconds
    useEffect(() => {
        const intervalId = setInterval(async () => {
            try {
                await socket.emit('updateBalance', user.telegramId, tapBalance);
                tapBalance = 0; // Reset tapBalance
                console.log("Balance Updated Successfully!");
            } catch (error) {
                console.error("Error updating balance:", error);
            }
        }, 5000); // Every 5 seconds

        return () => clearInterval(intervalId);
    }, [socket, user.telegramId]);


    // Handle Tap
    const handleUpdateBalance = (e) => {
        // Skip if no energy left
        if (energy <= 0) return;

        // Increment the count 
        const rect = e.target.getBoundingClientRect();
        const newClick = {
            id: Date.now(), // Fixed here
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        };
        setClicks(prevClicks => [...prevClicks, newClick]);

        // Reduce Energy - 1
        setEnergy(prevEnergy => Math.max(prevEnergy - 1, 0));

        tapBalance++;

        setTimeout(() => {
            setClicks(prevClicks => prevClicks.filter(click => click.id !== newClick.id));
        }, 800);
    };

    // Handle animation end
    const handleAnimationEnd = (id) => {
        setClicks(prevClicks => prevClicks.filter(click => click.id !== id));
    };

    // Refill energy over time
    useEffect(() => {
        const interval = setInterval(() => {
            setEnergy(prevEnergy => Math.min(prevEnergy + 1, EnergyLimit));
        }, 1000);

        return () => clearInterval(interval);
    }, [EnergyLimit, setEnergy]);

    return (
        <>
            {/* Refill energy */}
            <div className='border-2 text-white w-2/3 mx-auto text-center mt-8 rounded-3xl p-1 flex flex-row justify-center'>
                <img src={CoinImg} alt="Coins" width={30} />
                <p className='w-18 flex items-center'>{energy}/{EnergyLimit}</p>
            </div>
            {/* Button */}
            <div className='flex-grow flex items-center justify-center mt-3'>
                <div
                    className='relative mt-7 tap-image'
                    onPointerDown={handleUpdateBalance}
                >
                    <img src={DeadEyeLogo} width={280} alt="DEB Coin" />
                    {clicks.map((click) => (
                        <div
                            className='absolute text-5xl font-bold opacity-0 text-white'
                            style={{
                                top: `${click.y - 42}px`,
                                left: `${click.x - 28}px`,
                                animation: `float 1s ease-out`,
                            }}
                            onAnimationEnd={() => handleAnimationEnd(click.id)}
                            key={click.id}
                        >
                            +{addCoins} 
                        </div>
                    ))}
                </div>
            </div>
            <div className='flex items-center justify-center w-4/5 m-auto text-center text-white font-semibold text-3xl'>
                <img src={CoinImg} alt="Coins" className='w-16' />
                <span>{(balance + tapBalance)}</span>
            </div>
        </>
    );
};

export default TapComponent;
