import React from 'react'
import SUCCESSIMAGE from '../assest/success.gif'
import {Link} from 'react-router-dom'

const Success = () => {
  return (
    <div className='bg-slate-200 w-full max-w-md m-10 rounded mx-auto flex justify-center items-center flex-col p-4'>
        <img 
        src={SUCCESSIMAGE}
        width={150} 
        height={150}
        />
        <p className='text-green-600 font-bold text-3xl'>Payment Successfully!!!</p>
        <Link to={"/order"} class="px-5 z-20 py-2 m-2 bg-rose-400 rounded-md text-white relative font-semibold after:-z-20 after:absolute after:h-1 after:w-1 after:bg-rose-800 after:left-5 overflow-hidden after:bottom-0 after:translate-y-full after:rounded-md after:hover:scale-[300] after:hover:transition-all after:hover:duration-700 after:transition-all after:duration-700 transition-all duration-700 [text-shadow:3px_5px_2px_#be123c;] hover:[text-shadow:2px_2px_2px_#fda4af] text-2xl">See Orders</Link>
    </div>
  )
}

export default Success