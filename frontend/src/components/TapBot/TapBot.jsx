import React, { useContext, useEffect, useState, useRef } from 'react';
import { UserContext } from '../../context';
import './TapBot.css';

// Importing Images
import DeadEyeLogo from '../../assets/Logo/deadeye.png';
import CoinImg from '../../assets/Coin/coin.png';

const TapComponent = () => {
    const { balance, setBalance, addCoins, energy, setEnergy, EnergyLimit, user, socket } = useContext(UserContext);
    const [clicks, setClicks] = useState([]);
    const [accumulatedBalance, setAccumulatedBalance] = useState(0); // Accumulated balance
    const debounceTimerRef = useRef(null);
    const isUpdatingRef = useRef(false);

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
            if (accumulatedBalance > 0 && user && user.telegramId && !isUpdatingRef.current) {
                updateBalance();
            }
        }, 5000);  // Set delay for update 

        return () => clearInterval(interval);
    }, [accumulatedBalance, socket, user]);

    // Handle Tap
    const handleUpdateBalance = (e) => {
        if (energy <= 0) return; // Skip if no energy left

        // Get touch or click positions
        const touchPoints = Array.from(e.changedTouches || [e]); // For touch events or mouse event
        const newClicks = touchPoints.map((point) => ({
            id: Date.now() + Math.random(), // Unique identifier for each tap
            x: point.clientX,
            y: point.clientY
        }));

        setClicks(prevClicks => [...prevClicks, ...newClicks]);

        // Update balance and energy
        if (addCoins > 0) {
            setBalance(prevBalance => prevBalance + addCoins * newClicks.length);
            setAccumulatedBalance(prevAccumulated => prevAccumulated + addCoins * newClicks.length);
        }
        
        if (energy > 0) {
            setEnergy(prevEnergy => Math.max(prevEnergy - newClicks.length, 0)); // Decrease energy by the number of taps
        }
        
        if (navigator.vibrate) {
            navigator.vibrate(50);
        }

        // Debounce update to avoid excessive writes
        clearTimeout(debounceTimerRef.current);
        debounceTimerRef.current = setTimeout(() => {
            if (!isUpdatingRef.current) {
                updateBalance();
            }
        }, 200); // Adjust the delay as needed
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

    // Update backend with the latest balance and energy
    const updateBalance = async () => {
        isUpdatingRef.current = true;
        try {
            await socket.emit('updateBalance', user.telegramId, accumulatedBalance);
            setAccumulatedBalance(0); // Reset accumulated balance after sending to server
        } catch (error) {
            console.error("Error updating balance:", error);
        } finally {
            isUpdatingRef.current = false;
        }
    };

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
                    onTouchStart={handleUpdateBalance} // Handle touch events
                    onMouseDown={handleUpdateBalance} // Handle mouse events
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
                <span>{balance}</span>
            </div>
        </>
    );
};

export default TapComponent;
