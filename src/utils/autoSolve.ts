import { IBoardElement } from '../constants/IBoardElement';
import { createBoard } from './createBoard';
import { arrayToBox, boxToArray } from "../utils/converters";


const autoSolve = (board : IBoardElement[][]) : IBoardElement[][] => {
    board = boxToArray(board);
    console.log("Started solving...")
    solve(board);
    console.log("Finished solving.")

    board = arrayToBox(board);
    return board;
}

const checkStep = (board : IBoardElement[][]) : boolean => {
    board = boxToArray(board);
    return solve(board);
}

const solve = (board : IBoardElement[][]) : boolean => {   
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[0].length; j++) {
            // if (!board[i][j].disabled) {
            //     // handle partially solved situation by checking user input first
            //     const currElem = board[i][j].element;
            //     if (currElem !== 0 && isValid(board, i, j, currElem)) {
            //         board[i][j].disabled = true;
            //         if (solve(board)) return true;
            //         board[i][j].disabled = false;
            //     } else {
            //         for (let num = 1; num <= 9; num++) {
            //             if (isValid(board, i, j, num)) {
            //                 board[i][j].element = num;
            //                 if (solve(board)) return true;
            //                 board[i][j].element = 0;
            //             }
            //         }
            //         return false;
            //     }
            // }
            if(board[i][j].element === 0) {
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

const isValid = (board : IBoardElement[][], row : number, col : number, num : number) : boolean => {
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

export { autoSolve , checkStep}