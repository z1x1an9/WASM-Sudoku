import { IBoardElement } from '../constants/IBoardElement';
import { createBoard } from './createBoard';
import { arrayToBox, boxToArray, deepCopyBoard } from "../utils/converters";
import Benchmark from '../../teavm-wasm/teavm-wasm.js'

const autoSolveTeaVM = async (board: IBoardElement[][]): Promise<IBoardElement[][]> => {
  let curBoard = deepCopyBoard(board)
  curBoard = boxToArray(curBoard);
  console.log("Started checking...")
  let check = checkBoard(curBoard)
  console.log("CheckBoard in autoSolve", check);
  if (check) {
    console.log("Started solving...")
    var res = await solveTeaVM(curBoard);
    console.log("Waiting", res);
    console.log("Finished solving.")
  }
  curBoard = arrayToBox(curBoard);
  return curBoard;
}


const solveTeaVM = async (board: IBoardElement[][]): Promise<boolean> => {
  let array2D: number[][] = [];
  let dim: number = 9;
  for (let i = 0; i < dim; i++) {
    const row: number[] = [];
    for (let j = 0; j < dim; j++) {
      row.push(board[i][j].element);
    }
    array2D.push(row);
  }

  //
  var teaVM_solver = new Benchmark(array2D);
  await teaVM_solver.load();

  // load the first answer back to board, then return true
  for (let i = 0; i < dim; i++) {
    for (let j = 0; j < dim; j++) {
      if (array2D[i][j] === 0) return false;
      if (board[i][j].element == 0) board[i][j].element = array2D[i][j];
    }
  }
  return true;
}


// check if the current board has a solution
const checkMove = (board: IBoardElement[][]): boolean => {
  let curBoard = deepCopyBoard(board)
  curBoard = boxToArray(curBoard);
  console.log("Started checking...")
  let check = checkBoard(curBoard)
  console.log("CheckBoard in checkMove", check);
  if (check) check = solve(curBoard);
  console.log("Finished checking. ", check);
  return check;
}

// check if the input board is valid (no conflict for filled cell), regardless of solution
const checkBoard = (board: IBoardElement[][]): boolean => {
  // console.log(JSON.stringify(board));
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[0].length; j++) {
      // console.log(i, j, board[i][j].element);
      if ((board[i][j].element !== 0) && !isFilledValid(board, i, j)) {
        console.log("checkBoard fail");
        return false;
      }
    }
  }
  console.log("checkBoard succeed");
  return true;
}


const solve = (board: IBoardElement[][]): boolean => {
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[0].length; j++) {
      if (board[i][j].element === 0) {
        for (let num = 1; num <= 9; num++) {
          if (isValid(board, i, j, num)) {
            board[i][j].element = num;
            if (solve(board)) return true;
            board[i][j].element = 0;
          }
        }
        return false;
      }
    }
  }
  return true
}

const deepCopy2DNumberArray = (board: number[][]): number[][] => {
  const res: number[][] = [];
  for (let i = 0; i < 9; i++) {
    const row: number[] = [];
    for (let j = 0; j < 9; j++) {
      row.push(board[i][j]);
    }
    res.push(row);
  }
  return res;
}


const isValid = (board: IBoardElement[][], row: number, col: number, num: number): boolean => {
  for (let i = 0; i < board.length; i++) {
    if (board[i][col].element !== 0 && board[i][col].element === num) return false; // check row
    if (board[row][i].element !== 0 && board[row][i].element === num) return false; // check column
    if (
      board[3 * Math.floor(row / 3) + Math.floor(i / 3)][3 * Math.floor(col / 3) + (i % 3)].element !== 0 &&
      board[3 * Math.floor(row / 3) + Math.floor(i / 3)][3 * Math.floor(col / 3) + (i % 3)].element === num
    ) return false; // check 3*3 block
  }
  return true
}

const isFilledValid = (board: IBoardElement[][], row: number, col: number): boolean => {
  const num = board[row][col].element;
  for (let i = 0; i < board.length; i++) {
    if (i !== row && board[i][col].element === num) return false; // check row
    if (i !== col && board[row][i].element === num) return false; // check column
    const boxRow = 3 * Math.floor(row / 3) + Math.floor(i / 3)
    const boxCol = 3 * Math.floor(col / 3) + (i % 3)
    if (
      (boxRow !== row && boxCol !== col) && board[boxRow][boxCol].element === num
    ) return false; // check 3*3 block
    // console.log(row, col, "inside isFilledValid");
  }
  // console.log(row, col, "no conflict");
  return true
}

export { autoSolveTeaVM }