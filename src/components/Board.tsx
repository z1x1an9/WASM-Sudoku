import React, { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { LastOperationAtom, MeasuredOperationAtom } from "../store/atoms";
import { OpTypes } from '../constants/OpTypes';
import { IBoardElement } from '../constants/IBoardElement';
import { createBoard } from '../utils/createBoard';
import { autoSolve, checkMove, autoSolveGC, autoSolveRust } from "../utils/autoSolve";

import { arrayToBox, boxToArray, copyBoard, deepCopyBoard } from "../utils/converters";

export const Board: React.FC<{}> = () => {
  const [boardState, setBoardState] = useState([] as IBoardElement[][]);
  const [lastOps, setLastOps] = useRecoilState(LastOperationAtom);
  const [measuredOps, setMeasuredOps] = useRecoilState(MeasuredOperationAtom);
  const [initialBoardState, setInitialBoardState] = useState([] as IBoardElement[][]);

  useEffect(() => {
    switch (lastOps.last_ops) {
      case OpTypes.NEW_GAME:
        generateNewBoard();
        break;
      case OpTypes.AUTO_SOLVE:
        // console.log("last payload:" + lastOps.last_ops)
        var start = window.performance.now();
        console.log("start", start);
        // const res = autoSolve(boardState);
        const res = autoSolveRust(boardState).then((res) => {
          var end = window.performance.now();
          console.log("end", end);
          setBoardState(res);
          console.log('board state: '+ JSON.stringify(boardState));

          setMeasuredOps({
            measured_ops: lastOps.last_ops,
            compute_time: Math.round(end - start),
          });
        break;
      case OpTypes.HINT_ONE_STEP:
        fillBoard(lastOps.payload);
        break;
      case OpTypes.CHECK_MOVE:
        console.log(JSON.stringify(boardState));
        const i = lastOps.last_pos[0];
        const j = lastOps.last_pos[1];
        console.log("last_ops", i, j);
        const check = checkMove(boardState);
        if (!check) {
          const newState = copyBoard(boardState);
          newState[i][j].valid = false;
          setBoardState(newState);
        }
        break;
      case OpTypes.RESTART_GAME:
        console.log(JSON.stringify(initialBoardState));
        setBoardState(initialBoardState);
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
      //console.log(JSON.stringify(cur));
      for (let j = 0; j < 9; j++) {
        // cur is the ith 3x3 box with j as the index 
        // 0,1,2,
        // 3,4,5,
        // 6,7,8,
        const row = Math.floor(i / 3) * 3 + Math.floor(j / 3)
        const col = i % 3 * 3 + j % 3
        if (newBoard[row][col] > 0) {
          cur.push({ element: newBoard[row][col], disabled: true, valid: true });
        } else {
          cur.push({ element: newBoard[row][col], disabled: false, valid: true });
        }
        // cur.push({ element: newBoard[row][col], disabled: true });
      }
      state.push(cur);
    }

    // console.log("array to box: " + JSON.stringify(arrayToBox(newBoard)))
    // console.log("box to array: " + JSON.stringify(boxToArray(state)[0]))

    setBoardState(state);
    setInitialBoardState(state);
  }

  const fillBoard = (board: IBoardElement[][]) => {
    setBoardState(board);
  }

  const handleInput = (e: any) => {
    let value = Number(e.target.value);
    let ifCheckMove = true;
    if (isNaN(value) || value >= 10 || value < 0) {
      value = 0;
      ifCheckMove = false
    }
    const [row, col] = e.target.id.split('-');
    const i = Number(row) - 1;
    const j = Number(col) - 1;
    const newState: IBoardElement[][] = copyBoard(boardState);
    newState[i][j] = { element: value, disabled: false, valid: true };
    setBoardState(newState);
    if (ifCheckMove) setLastOps({
      last_ops: OpTypes.CHECK_MOVE,
      payload: [],
      compute_time: 100,
      last_pos: [i, j]
    });
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
                <div key={`${boxCount}-${colCount}`} id={`${boxCount}-${colCount}`} className='text-2xl text-center grid content-center justify-center border-solid border border-[#F0F3F9] font-bold'>
                  <span className='select-none'>{num.element}</span>
                </div>
              )
            } else {
              const value = boardState[boxCount - 1][colCount - 1].element;
              // console.log(boxCount - 1, colCount - 1, value);

              if (num.valid) {
                return (
                  <input key={`${boxCount}-${colCount}`} id={`${boxCount}-${colCount}`} className='text-2xl text-center grid content-center justify-center border-solid border border-[#F0F3F9] font-bold' value={value === 0 ? '' : String(value)} onInput={handleInput} />
                )
              } else {
                return (
                  <input key={`${boxCount}-${colCount}`} id={`${boxCount}-${colCount}`} className='text-2xl text-center grid content-center justify-center border-solid border border-[#F0F3F9] bg-red-300 font-bold' value={value === 0 ? '' : String(value)} onInput={handleInput} />
                )
              }
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