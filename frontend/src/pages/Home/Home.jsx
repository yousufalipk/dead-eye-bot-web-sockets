import React, { useEffect, useState } from 'react';
import { IoStar } from "react-icons/io5";
import axios from 'axios';
import TapBot from '../../components/TapBot/TapBot';

import BackgroundImage from '../../assets/bg.png';

// Telegram
const tele = window.Telegram?.WebApp;

const Home = () => {
  const [userInfo, setUserInfo] = useState(null);
  const apiUrl = import.meta.env.VITE_API_URL;
  const staticUser = import.meta.env.VITE_STATIC_USER;

  useEffect(() => {
    const initTelegramWebApp = async () => {
      if (tele) {
        tele.disableVerticalSwipes();
        tele.expand();
        tele.ready();

        try {
          let user;
          // Setting Static User for dev only!!
          if (staticUser === 'true') {
            user = {
              id: '03021223335',
              first_name: 'Jhon',
              last_name: 'Doe',
              username: 'jhondoe_1'
            };
            setUserInfo(user);
          } else {
            user = tele.initDataUnsafe?.user;
            if (user) {
              setUserInfo(user);
            } else {
              console.log("Error getting user data from telegram!")
            }
          }

          try {
            const response = await axios.post(`${apiUrl}/fetch-user-data`, {
              telegramId: user.id,
              firstName: user.first_name || "",
              lastName: user.last_name || "",
              username: user.username || ""
            });

            if (response.data.status === 'success') {
              console.log("Fetching User Success!");
            }
          } catch (error) {
            console.error("Error fetching user data", error);
          }
        } catch (error) {
          console.error("Error initializing Telegram WebApp", error);
        }
      } else {
        console.error("Telegram WebApp is not initialized");
      }
    };

    initTelegramWebApp();
  }, [apiUrl]);

  return (
    <>
      {userInfo ? (
        <div>
          {/* Header */}
          <div className='w-screen flex justify-between text-white px-4 pt-4'>
            {/* Section-I */}
            <div className='flex flex-row justify-start items-center'>
              <div className='w-1/2'>
                <div className="w-10 h-10 flex items-center justify-center text-[13px] rounded-full bg-[#171a46e5] text-white">
                  <span>{userInfo.username?.slice(0, 1)}</span>
                </div>
              </div>
              <span className='flex items-center px-2 text-[15px]'>
                {userInfo.username}
              </span>
            </div>
            {/* Section-II */}
            <div className='flex items-center justify-center font-semibold text-[18px] border-2 border-orange-400 px-5 rounded-3xl '>
              Join DeadEye
            </div>
          </div>

          {/* Leader Border */}
          <div className='p-1 bg-gradient-to-r from-blue-950 to-blue-700 rounded-2xl flex justify-center w-2/5 text-white m-auto items-center mt-8'>
            <IoStar className='mx-1 text-yellow-300' /> Leaderboard
          </div>

          {/* Bot */}
          <div>
            <TapBot telegramId={userInfo.id} />
          </div>
        </div>
      ) : (
        <p> Not found !</p>
      )}
    </>
  );
};

export default Home;
