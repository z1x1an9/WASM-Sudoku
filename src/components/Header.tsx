import React from "react";
import { useRecoilState } from "recoil";
import { MeasuredOperationAtom } from "../store/atoms";

export const Header: React.FC<{}> = () => {
  const [measuredOps, setMeasuredOps] = useRecoilState(MeasuredOperationAtom);

  return (
    <div>
      <p className='text-4xl text-white'>Sudoku</p>
      <p className='text-base text-slate-600'>Powered by JS and WASM</p>
      <span className='text-2xl'>Measured Operation: {measuredOps.measured_ops}, Time to compute: {measuredOps.compute_time} ms</span>
    </div>
  )
}