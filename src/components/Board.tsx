import React, { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { LastOperationAtom } from "../store/atoms";
import { OpTypes } from '../constants/OpTypes';
import { IBoardElement } from '../constants/IBoardElement';
import { createBoard } from '../utils/createBoard';
import { autoSolve, checkStep } from "../utils/autoSolve";
import { arrayToBox, boxToArray } from "../utils/converters";

export const Board: React.FC<{}> = () => {
  const [boardState, setBoardState] = useState([] as IBoardElement[][]);
  const [lastOps, setLastOps] = useRecoilState(LastOperationAtom);

  useEffect(() => {
    switch (lastOps.last_ops) {
      case OpTypes.NEW_GAME:
        generateNewBoard();
        break;
      case OpTypes.AUTO_SOLVE:
        // console.log("last payload:" + lastOps.last_ops)
        const res = autoSolve(boardState);
        console.log(JSON.stringify(res))
        setBoardState(res)
        break;
      case OpTypes.HINT_ONE_STEP:
        fillBoard(lastOps.payload);
        break;
      case OpTypes.CHECK_MOVE:
        // if(!checkStep(boardState)) {
        //   //TODO: if invalid step, alert
        // }
        break;
      default:
        break;
    }
  }, [lastOps]);

  const generateNewBoard = () => {
    const state: IBoardElement[][] = [];
    const newBoard = createBoard();
    console.log("create!");
    console.log(newBoard);

    for (let i = 0; i < 9; i++) {
      const cur: IBoardElement[] = [];

      // for (let j = 0; j < 9; j++) {
      //   const prob = Math.random();
      //   if (prob > 0.7) {
      //     cur.push({ element: Math.floor(Math.random() * 9) + 1, disabled: true });
      //   } else {
      //     cur.push({ element: 0, disabled: false });
      //   }
      // }
      console.log(JSON.stringify(cur));
      for (let j = 0; j < 9; j++) {
        // cur is the ith 3x3 box with j as the index 
        // 0,1,2,
        // 3,4,5,
        // 6,7,8,
        const row = Math.floor(i / 3) * 3 + Math.floor(j / 3)
        const col = i % 3 * 3 + j % 3
        if (newBoard[row][col] > 0) {
          cur.push({ element: newBoard[row][col], disabled: true });
        } else {
          cur.push({ element: newBoard[row][col], disabled: false });
        }
        // cur.push({ element: newBoard[row][col], disabled: true });
      }

      state.push(cur);
    }

    console.log("array to box: " + JSON.stringify(arrayToBox(newBoard)))
    console.log("box to array: " + JSON.stringify(boxToArray(state)[0]))

    setBoardState(state);
  }

  const fillBoard = (board: IBoardElement[][]) => {
    setBoardState(board);
  }

  const handleInput = (e: any) => {
    console.log('input: ' + e.target.value)
    console.log('type ' + typeof e.target.value)
    let value = Number(e.target.value);
    let ifCheckMove = true;
    if (!e.target.value || value <= 0 || value >= 10) {
      value = 0;
      e.target.value = '';
      ifCheckMove = false
    }
    // if (value === 0 || value >= 10) {
    //   return;
    // }
    // if (value > 10) {
    //   value %= 10;
    //   console.log('value: '  + value)
    // }
    const [row, col] = e.target.id.split('-');
    const newState: IBoardElement[][] = [];

    for (let i = 0; i < 9; i++) {
      const cur: IBoardElement[] = [];
      for (let j = 0; j < 9; j++) {
        cur.push(boardState[i][j]);
      }

      newState.push(cur);
    }


    newState[Number(row) - 1][Number(col) - 1] = { element: value, disabled: false };
    setBoardState(newState);
    if (ifCheckMove) {
      setLastOps({
        last_ops: OpTypes.CHECK_MOVE,
        payload: [],
        compute_time: 100
      })
    }
    
  }

  const renderBoard = () => {
    let boxCount: number = 0;
    let colCount = 0;
    return boardState.map((box: IBoardElement[]) => {
      colCount = 0;
      boxCount++;
      return (
        <div key={`${boxCount}`} id={`${boxCount}`} className='grid grid-cols-3 grid-rows-3 bg-white aspect-square justify-items-stretch border-2 border-[#D7E1F4]'>
          {box.map((num: IBoardElement) => {
            colCount++;
            if (num.disabled) {
              return (
                <div key={`${boxCount}-${colCount}`} id={`${boxCount}-${colCount}`} className='text-center grid content-center justify-center border-solid border border-[#F0F3F9] font-bold'>
                  <span className='select-none'>{num.element}</span>
                </div>
              )
            } else {
              const value = boardState[boxCount - 1][colCount - 1].element;
              return (
                <input key={`${boxCount}-${colCount}`} id={`${boxCount}-${colCount}`} className='text-center grid content-center justify-center border-solid border border-[#F0F3F9] font-bold' value={value === 0 ? '' : String(value)} onInput={handleInput} />
              )
            }
          })}
        </div>
      );
    });
  }

  return (
    <div className='grid place-items-center'>
      <div className='grid grid-cols-3 grid-rows-3 aspect-square justify-items-stretch rounded shadow-xl'>
        {renderBoard()}
      </div>
    </div>
  )
}