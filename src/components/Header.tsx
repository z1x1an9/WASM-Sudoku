import React from "react";
import { useRecoilState } from "recoil";
import { MeasuredOperationAtom } from "../store/atoms";

export const Header: React.FC<{}> = () => {
  const [measuredOps, setMeasuredOps] = useRecoilState(MeasuredOperationAtom);

  return (
    <div>
      <p className='text-4xl text-white'>Sudoku</p>
      <p className='text-base text-slate-600'>Powered by JS and WASM</p>
      <span className='text-2xl'>Measured Operation: {measuredOps.measured_ops}, total time: {measuredOps.compute_time} ms, time to solve:  {measuredOps.solving_time}</span>
    </div>
  )
}