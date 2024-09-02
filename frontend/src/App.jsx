import { useState } from 'react'
import './App.css'
import { Routes, Route } from 'react-router-dom';
import { NavLink } from 'react-router-dom';

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
        <div className='my-20 text-white bg-blue-950 mx-2 p-3 rounded-3xl overflow-hidden'>
          <ul className='flex flex-row justify-between'>
            <li>  {/* Home */}
              <NavLink
                to="/"
                className={({ isActive }) =>
                  isActive ? 'py-3 bg-gray-900 rounded-3xl px-5' : 'text-white'
                }
              >
                Home
              </NavLink>
            </li>
            <li> {/* Boost */}
              <NavLink
                to="/boost"
                className={({ isActive }) =>
                  isActive ? 'py-3 bg-gray-900 rounded-3xl px-5' : 'text-white'
                }
              >
                Boost
              </NavLink>
            </li>
            <li> {/* Quest */}
              <NavLink
                to="/quest"
                className={({ isActive }) =>
                  isActive ? 'py-3 bg-gray-900 rounded-3xl px-5' : 'text-white'
                }
              >
                Quest
              </NavLink>
            </li>
            <li> {/* Friends */}
              <NavLink 
                to="/friends"
                className={({ isActive }) =>
                  isActive ? 'py-3 bg-gray-900 rounded-3xl px-5' : 'text-white'
                }
              >
                Friends
              </NavLink>
            </li>
            <li> {/* Wallet */}
              <NavLink
                to="/wallet"
                className={({ isActive }) =>
                  isActive ? 'py-3 bg-gray-900 rounded-3xl px-5' : 'text-white'
                }
              >
                Wallet
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </>
  )
}

export default App;
