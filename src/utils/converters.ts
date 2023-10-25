import { IBoardElement } from '../constants/IBoardElement';

export const arrayToBox = (board: IBoardElement[][]) : IBoardElement[][] => {
    const res : IBoardElement[][] = [];
    for (let i = 0; i < 9; i++) {
        const cur: IBoardElement[] = [];
        for (let j = 0; j < 9; j++) {
          // cur is the ith 3x3 box with j as the index 
          // 0,1,2,
          // 3,4,5,
          // 6,7,8,
          const row = Math.floor(i / 3) * 3 + Math.floor(j / 3)
          const col = i % 3 * 3 + j % 3         
          cur.push(board[row][col]);
        }
  
        res.push(cur);
      }
    return res;
}

export const boxToArray = (box: IBoardElement[][]): IBoardElement[][] => {
    const res: IBoardElement[][] = [];
    for (let i = 0; i < 9; i++) {
      const cur: IBoardElement[] = [];
      for (let j = 0; j < 9; j++) {
        // Convert the 3x3 box to the original 9x9 array format
        // by using a similar indexing scheme
        const row = Math.floor(i / 3) * 3 + Math.floor(j / 3);
        const col = (i % 3) * 3 + (j % 3);
        cur.push(box[row][col]);
      }
      res.push(cur);
    }
    return res;
  };