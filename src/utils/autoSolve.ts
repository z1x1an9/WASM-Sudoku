import { IBoardElement } from '../constants/IBoardElement';
import { createBoard } from './createBoard';
import { arrayToBox, boxToArray, deepCopyBoard } from "../utils/converters";
import init, { solve_rust } from '../../rust-wasm/pkg/rust_wasm.js';
// import { useRecoilState } from 'recoil';
// import { MeasuredOperationAtom } from '../store/atoms.js';

// const [measuredOps, setMeasuredOps] = useRecoilState(MeasuredOperationAtom);
type AutoSolveResult = {
    board: IBoardElement[][];
    solve_time: number;
}

type SolveResult = {
    solved: boolean;
    solve_time: number;
}

const autoSolve = (board: IBoardElement[][]): IBoardElement[][] => {
    let curBoard = deepCopyBoard(board)
    curBoard = boxToArray(curBoard);
    console.log("Started checking...")
    let check = checkBoard(curBoard)
    console.log("CheckBoard in autoSolve", check);
    if (check) {
        console.log("Started solving...")
        solve(curBoard);
        console.log("Finished solving.")
    }
    curBoard = arrayToBox(curBoard);
    return curBoard;
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

const autoSolveGC = (board: IBoardElement[][]): IBoardElement[][] => {
    let curBoard = deepCopyBoard(board)
    curBoard = boxToArray(curBoard);
    console.log("Started checking...")
    let check = checkBoard(curBoard)
    console.log("CheckBoard in autoSolve", check);
    if (check) {
        console.log("Started solving...")
        solveGC(curBoard);
        console.log("Finished solving.")
    }
    curBoard = arrayToBox(curBoard);
    return curBoard;
}

// BFS
const solveGC = (board: IBoardElement[][]): boolean => {
    // prepare the first list
    let curList: number[][][] = [];
    let dim: number = 9;

    // copy to a an integer array 
    let array2D: number[][] = [];
    for (let i = 0; i < dim; i++) {
        const row: number[] = [];
        for (let j = 0; j < dim; j++) {
            row.push(board[i][j].element);
        }
        array2D.push(row);
    }
    curList.push(array2D);
    // use BFS to find all solutions
    for (let i = 0; i < dim; i++) {
        for (let j = 0; j < dim; j++) {
            if (curList.length > 0) {
                let firstBoard: number[][] = curList[0];
                if (firstBoard[i][j] > 0) continue; // skip the filled cell
                let newList: number[][][] = [];
                for (let k = 0; k < curList.length; k++) {
                    for (let v = 1; v < dim + 1; v++) {
                        if (isValidNumber(curList[k], i, j, v)) {
                            let newBoard: number[][] = deepCopy2DNumberArray(curList[k]);
                            newBoard[i][j] = v;
                            newList.push(newBoard);
                        }
                    }
                }
                curList = newList;
                console.log("number of solution", i, j, newList.length);
            } else {
                return false;
            }
        }
    }
    // no solution found 
    if (curList.length == 0) {
        return false;
    }
    // load the first answer back to board, then return true
    for (let i = 0; i < dim; i++) {
        for (let j = 0; j < dim; j++) {
            if (board[i][j].element == 0) board[i][j].element = curList[0][i][j];
        }
    }
    console.log(JSON.stringify(curList[0]));
    console.log("number of solution", curList.length);
    return true;
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

const isValidNumber = (board: number[][], row: number, col: number, val: number): boolean => {
    for (let i = 0; i < board.length; i++) {
        if (board[i][col] !== 0 && board[i][col] === val) return false; // check row
        if (board[row][i] !== 0 && board[row][i] === val) return false; // check column
        if (
            board[3 * Math.floor(row / 3) + Math.floor(i / 3)][3 * Math.floor(col / 3) + (i % 3)] !== 0 &&
            board[3 * Math.floor(row / 3) + Math.floor(i / 3)][3 * Math.floor(col / 3) + (i % 3)] === val
        ) return false; // check 3*3 block
    }
    return true
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

const autoSolveRust = async (board: IBoardElement[][]): Promise<AutoSolveResult> => {
    let curBoard = deepCopyBoard(board)
    curBoard = boxToArray(curBoard);
    console.log("Started checking...")
    let check = checkBoard(curBoard)
    console.log("CheckBoard in autoSolve", check);
    var solveResult: SolveResult = { solved: false, solve_time: -1 };
    if (check) {
        console.log("Started solving...")
        var solveResult = await solveRust(curBoard);
        console.log("Finished solving.")
    }
    curBoard = arrayToBox(curBoard);
    // const boardPromise = new Promise<IBoardElement[][]>((resolve, reject) => {
    //     // Asynchronous code here
    //     resolve(b)
    //   });
    return { board: curBoard, solve_time: solveResult.solve_time };
}

const solveRust = async (board: IBoardElement[][]): Promise<SolveResult> => {
    let curList: number[][][] = [];
    let array2D: number[][] = [];
    let dim: number = 9;
    for (let i = 0; i < dim; i++) {
        const row: number[] = [];
        for (let j = 0; j < dim; j++) {
            row.push(board[i][j].element);
        }
        array2D.push(row);
    }
    curList.push(array2D);

    // call rust function to solve
    const serializedList = JSON.stringify(curList);
    console.log("JSON.parse(serializedList): " + JSON.parse(serializedList))
    console.log("wasm inited")
    await init();
    // init().then(() => {
    console.log('in then')
    var start = window.performance.now();
    console.log("solving start", start);
    curList = solve_rust(JSON.parse(serializedList), dim) as unknown as number[][][];
    var end = window.performance.now();
    var solve_time = Math.round(end - start);
    console.log("solving end", end);


    console.log("returned list: " + curList[0]);
    //    });
    // curList = solve_rust(JSON.parse(serializedList), dim) as unknown as number[][][];
    // if no solution found 
    console.log('after then')

    if (curList.length == 0) {
        return { solved: false, solve_time };
    }

    // load the first answer back to board, then return true
    for (let i = 0; i < dim; i++) {
        for (let j = 0; j < dim; j++) {
            if (board[i][j].element == 0) board[i][j].element = curList[0][i][j];
        }
    }
    console.log(JSON.stringify(curList[0]));
    console.log("number of solution", curList.length);
    return { solved: true, solve_time };
}


export { autoSolve, checkMove, autoSolveGC, autoSolveRust }
