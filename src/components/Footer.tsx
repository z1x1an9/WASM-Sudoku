import React from "react";
import { useRecoilState } from "recoil";
import { LastOperationAtom } from "../store/atoms";
import { OpTypes } from "../constants/OpTypes";

export const Footer: React.FC<{}> = () => {
  const [lastOps, setLastOps] = useRecoilState(LastOperationAtom);

  return (
    <div>
    <div className='flex justify-between py-10'>
      <div className='flex py-2 justify-center'>
        <button className='px-3 py-2 w-fit border-2 rounded-3xl border-sky-500 text-sky-500 hover:bg-sky-500 hover:text-white' onClick={() => setLastOps({last_ops: OpTypes.NEW_GAME, payload: [], compute_time: 0})}>
          <span>New Game</span>
        </button>
      </div>
      <div className='flex py-2 justify-center'>
        <button className='px-3 py-2 w-fit border-2 rounded-3xl border-sky-500 text-sky-500 hover:bg-sky-500 hover:text-white' onClick={() => setLastOps({last_ops: OpTypes.HINT_ONE_STEP, payload: [], compute_time: 0})}>
          <span>One Step Hint</span>
        </button>
      </div>
      <div className='flex  py-2 justify-center'>
        <button className='px-3 py-2 w-fit border-2 rounded-3xl border-sky-500 text-sky-500 hover:bg-sky-500 hover:text-white' onClick={() => setLastOps({last_ops: OpTypes.AUTO_SOLVE, payload: [], compute_time: 0})}>
          <span>Auto Solve</span>
        </button>
      </div>
    </div>
    <span>Last Operation: {lastOps.last_ops}, Time to compute: {lastOps.compute_time}</span>
  </div>
  )
}