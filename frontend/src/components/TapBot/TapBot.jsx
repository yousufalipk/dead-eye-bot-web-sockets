import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../context';
import io from 'socket.io-client';
import './TapBot.css';

// Importing Images
import DeadEyeLogo from '../../assets/Logo/deadeye.png';
import CoinImg from '../../assets/Coin/coin.png';

const TapComponent = () => {
    const { balance, setBalance, user } = useContext(UserContext);
    const apiUrl = import.meta.env.VITE_API_URL;
    const socket = io(apiUrl);

    const [energy, setEnergy] = useState(500);

    const [clicks, setClicks] = useState([]);

    // Web Sockets
    useEffect(() => {
        socket.emit('getInitialBalance', user.id);

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

    // Taping/Clicking (coins +1)
    const handleUpdateBalance = (e) => {
        if (energy <= 0) return; // Disable Tap when energy is zero
        setBalance(balance + 1);
        const target = e.currentTarget;
        if (target) {
            const rect = target.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            setClicks(prevClicks => [...prevClicks, { id: Date.now(), x, y }]);
            socket.emit('updateBalance', user.id);
            setEnergy(prevEnergy => prevEnergy - 1);

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

    // Refill energy over time
    useEffect(() => {
        const interval = setInterval(() => {
            setEnergy(prevEnergy => Math.min(prevEnergy + 1, 500));
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    return (
        <>
            {/* Refill energy */}
            <div className='border-2 text-white w-2/3 mx-auto text-center mt-8 rounded-3xl p-1 flex flex-row justify-center'>
                <img src={CoinImg} alt="Coins" width={30} />
                <p className='w-18 flex items-center'>{energy}/500</p>
            </div>
            {/* Button */}
            <div className='flex-grow flex items-center justify-center mt-3'>
                <div className='relative mt-7 tap-image' onClick={handleUpdateBalance}>
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
