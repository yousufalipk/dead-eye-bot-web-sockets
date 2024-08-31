import { useState } from 'react'
import './App.css'
import { Routes, Route } from 'react-router-dom';
import { Link } from 'react-router-dom';

import HomePage from './pages/Home/Home';
import BoostPage from './pages/Boost/Boost';
import QuestPage from './pages/Quest/Quest';
import FriendsPage from './pages/Friends/Friends';
import WalletPage from './pages/Wallet/Wallet';

function App() {


  return (
    <>
      <div className='w-screen h-screen bg-custom-image bg-cover bg-centerflex flex-col'>
        {/* Pages */}
        <div className='h-4/5'>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/boost" element={<BoostPage />} />
            <Route path="/quest" element={<QuestPage />} />
            <Route path="/friends" element={<FriendsPage />} />
            <Route path="/wallet" element={<WalletPage />} />
            <Route path="*" element={<HomePage />} />
          </Routes>
        </div>
              
        {/* NavBar */}
        <div className='my-20 text-white bg-blue-950 mx-2 rounded-3xl'> 
          <ul className='flex flex-row justify-between mx-5 p-3'>
            <li>
              <Link to="/" >Home</Link>
            </li>
            <li>
              <Link to="/boost" >Boost</Link>
            </li>
            <li>
              <Link to="/quest" >Quest</Link>
            </li>
            <li>
              <Link to="/friends" >Friends</Link>
            </li>
            <li>
              <Link to="/wallet" >Wallet</Link>
            </li>
          </ul>
        </div>
      </div>
    </>
  )
}

export default App;
