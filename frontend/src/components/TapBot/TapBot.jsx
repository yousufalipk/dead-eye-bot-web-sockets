import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../context';
import io from 'socket.io-client';
import './TapBot.css';

// Importing Images
import DeadEyeLogo from '../../assets/Logo/deadeye.png';
import CoinImg from '../../assets/Coin/coin.png';

const TapComponent = () => {
    const { balance, setBalance, addCoins, energy, setEnergy, EnergyLimit, user, updateInterval } = useContext(UserContext);
    const apiUrl = import.meta.env.VITE_API_URL;
    const socket = io(apiUrl, { transports: ['websocket'], reconnection: true });

    const [clicks, setClicks] = useState([]);
    const [accumulatedBalance, setAccumulatedBalance] = useState(0); // Accumulated balance

    // WebSockets setup
    useEffect(() => {
        socket.on('balanceUpdated', (data) => {
            setBalance(data.user.balance);
        });

        return () => {
            socket.off('balanceUpdated');
        };
    }, [socket, setBalance]);

    // Accumulate balance updates and send to server after interval
    useEffect(() => {
        const interval = setInterval(() => {
            if (accumulatedBalance > 0 && user && user.telegramId) {
                socket.emit('updateBalance', user.telegramId, accumulatedBalance);
                setAccumulatedBalance(0); // Reset accumulated balance after sending to server
            }
        }, updateInterval);

        return () => clearInterval(interval);
    }, [accumulatedBalance, updateInterval, socket, user]);

    // Handle Tap
    const handleUpdateBalance = () => {
        if (energy <= 0) return; // Disable Tap when energy is zero

        setClicks(prevClicks => [...prevClicks, { id: Date.now(), x: 0, y: 0 }]);

        // Update the displayed balance immediately
        setBalance(prevBalance => prevBalance + addCoins);

        // Accumulate the balance to be sent to the server later
        setAccumulatedBalance(prevAccumulated => prevAccumulated + addCoins);

        setEnergy(prevEnergy => Math.max(prevEnergy - 1, 0)); 

        // Trigger vibration on eligible devices
        if (navigator.vibrate) {
            navigator.vibrate(50); // set time in milliseconds
        }
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
                <div className='relative mt-7 tap-image' onClick={handleUpdateBalance}>
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
                <span>{balance}</span>
            </div>
        </>
    );
};

export default TapComponent;
