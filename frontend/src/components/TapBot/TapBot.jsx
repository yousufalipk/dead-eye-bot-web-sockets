import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import './TapBot.css';

// Importing Images
import DeadEyeLogo from '../../assets/Logo/deadeye.png';
import CoinImg from '../../assets/Coin/coin.png';

const TapComponent = ({ telegramId }) => {
    const apiUrl = import.meta.env.VITE_API_URL;
    const socket = io(apiUrl);

    const [clicks, setClicks] = useState([]);
    const [energy, setEnergy] = useState(500);
    const [balance, setBalance] = useState(0);
    const energyToReduce = 1;

    // Web Sockets
    useEffect(() => {
        socket.emit('getInitialBalance', telegramId);

        socket.on('initialBalance', (data) => {
            setBalance(data.balance);
        });

        // Listen for balance updates
        socket.on('balanceUpdated', (data) => {
            setBalance(data.newBalance);
        });

        return () => {
            socket.off('initialBalance');
            socket.off('balanceUpdated');
        };
    }, [clicks]);

    // Refill Energy every 1 second!
    useEffect(() => {
        const interval = setInterval(() => {
            setEnergy(prevEnergy => Math.min(prevEnergy + 1, 500)); // Set Max energy to 500
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    // Taping/Clicking (coins +1)
    const handleClick = (e) => {
        if (energy < energyToReduce) return; // Disable Tap when energy is zero
        setBalance(balance + 1 );
        const target = e.currentTarget;
        if (target) {
            const rect = target.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            setClicks(prevClicks => [...prevClicks, { id: Date.now(), x, y }]);
            socket.emit('updateBalance', telegramId);
            setEnergy(prevEnergy => prevEnergy - energyToReduce);

            // Trigger vibration on eligible devices
            if (navigator.vibrate) {
                navigator.vibrate(50); // set time in milliseconds
            }
        }
    };

    // Handle animation end
    const handleAnimationEnd = (id) => {
        setClicks(prevClicks => prevClicks.filter(click => click.id !== id));
    };

    return (
        <>
            {/* Refill energy */}
            <div className='border-2 text-white w-2/3 mx-auto text-center mt-8 rounded-3xl p-1 flex flex-row justify-center'>
                <img src={CoinImg} alt="Coins" width={30} />
                <p className='w-18 flex items-center'>{energy}/500</p>
            </div>
            {/* Button */}
            <div className='flex-grow flex items-center justify-center mt-3'>
                <div className='relative mt-7 tap-image' onClick={handleClick}>
                    <img src={DeadEyeLogo} width={280} alt="DEB Coin" />
                    {clicks.map((click) => (
                        <div className='absolute text-5xl font-bold opacity-0 text-white'
                            style={{
                                top: `${click.y - 42}px`,
                                left: `${click.x - 28}px`,
                                animation: `float 1s ease-out`
                            }}
                            onAnimationEnd={() => handleAnimationEnd(click.id)}
                            key={click.id}
                        >
                            +1
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
