import React from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Board } from './components/Board';
import {
  RecoilRoot
} from 'recoil';

export const App = () => {
  return (
    <RecoilRoot>
    <div className='h-screen w-screen relative'>
      <div className='grid z-50 absolute h-screen w-screen place-items-center'>
        <div className='h-4/5 w-2/5 flex flex-col justify-between'>
          <Header />
          <Board />
          <Footer />
        </div>
      </div>
      <div className='h-2/5 w-screen bg-sky-500 z-10 absolute' />
    </div>
    </RecoilRoot>
  )
}