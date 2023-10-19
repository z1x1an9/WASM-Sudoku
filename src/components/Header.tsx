import React from "react";

export const Header: React.FC<{}> = () => {
  return (
    <div>
      <p className='text-3xl text-white'>Sudoku</p>
      <p className='text-sm text-slate-600'>Powered by JS and WASM</p>
    </div>
  )
}