import React, { useEffect, useState, useContext } from 'react';
import { IoStar } from "react-icons/io5";
import TapBot from '../../components/TapBot/TapBot';
import { UserContext } from '../../context/index';

const Home = () => {
  const { user } = useContext(UserContext);

  return (
    <>
    {user && (
      <div>
        {/* Header */}
        <div className='w-screen flex justify-between text-white px-4 pt-4'>
          {/* Section-I */}
          <div className='flex flex-row justify-start items-center'>
            <div className='w-1/2'>
              <div className="w-10 h-10 flex items-center justify-center text-[13px] rounded-full bg-[#171a46e5] text-white">
                <span>{user.username?.slice(0, 1)}</span>
              </div>
            </div>
            <span className='flex items-center px-2 text-[15px]'>
              {user.username}
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
          <TapBot />
        </div>
      </div>
      )}
    </>
  );
};

export default Home;
