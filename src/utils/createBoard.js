const dim = 9;
const board = [];
const boxes = [];
const visited = [];
const reveal_cells = 80;

createEmptyBoard();

export function createBoard() {
  console.log("Creating Board");
  clearBoard();
  console.log("Init");
  console.log(JSON.stringify(board));
  // console.log(boxes);
  backtrack(0, 0);
  console.log("Complete");
  console.log(board);
  // console.log(boxes);
  const final_board = JSON.parse(JSON.stringify(board)); // deep copy
  prepareFinalBoard(reveal_cells, final_board);
  console.log("Prepare");
  console.log(final_board);
  return final_board;
}

function prepareFinalBoard(reavel_cells, final_board) {
  const indice = new Set();
  // get random position indices to reveal
  while (indice.size < reavel_cells) {
    indice.add(getRandomInt(81) - 1);
  }
  for (let i = 0; i < dim; i++) {
    for (let j = 0; j < dim; j++) {
      const idx = i * dim + j;
      if (indice.has(idx)) continue;
      final_board[i][j] = 0;
    }
  }
}

function createEmptyBoard() {
  for (let i = 0; i < dim; i += 1) {
    board.push(new Array(dim));
    boxes.push(new Set());
    visited.push(new Array(dim));
  }

  for (let i = 0; i < dim; i++) {
    for (let j = 0; j < dim; j++) {
      visited[i][j] = new Set();
    }
  }
}

function clearBoard() {
  for (let i = 0; i < dim; i++) {
    boxes[i].clear();
    for (let j = 0; j < dim; j++) {
      visited[i][j].clear();
      board[i][j] = 0;
    }
  }
}

function backtrack(row, col) {
  if (row === dim) {
    return true;
  }
  if (col === dim) {
    return backtrack(row + 1, 0);
  }
  const vst = visited[row][col]
  const candidates = [];
  // get a valid unvisited value
  for (let a = 1; a <= dim; a++) {
    if (vst.has(a)) continue;
    if (isValidInt(a, row, col)) {
      candidates.push(a);
    } else { // add invalid to visited, then when visited is full, clear and backtrack
      vst.add(a);
    }
  }
  if (candidates.length === 0) { // no valid available backtrack
    vst.clear();
    return false;
  }
  // fill a valid value
  let candidates_idx = getRandomInt(candidates.length) - 1;
  let val = candidates[candidates_idx]
  fillCell(val, row, col);
  vst.add(val);

  if (backtrack(row, col + 1)) { // all good
    return true
  } else if (vst.size === dim) { // all candidates have failed, return to last step
    vst.clear();
    clearCell(val, row, col);
    return false;
  } else { // retry another candidate
    clearCell(val, row, col);
    return backtrack(row, col);
  }
}

function fillCell(val, row, col) {
  let boxes_idx = Math.floor(row / 3) * 3 + Math.floor(col / 3);
  board[row][col] = val;
  boxes[boxes_idx].add(val);
}

function clearCell(val, row, col) {
  board[row][col] = 0;
  let boxes_idx = Math.floor(row / 3) * 3 + Math.floor(col / 3);
  boxes[boxes_idx].delete(val);
}

// get a random integer from 1 to max
function getRandomInt(max) {
  return Math.floor(Math.random() * (max)) + 1;
}

// find if a val is valid to fill in board[row][col]
function isValidInt(val, row, col) {
  for (let i = 0; i < row; i++) {
    if (val === board[i][col]) return false;
  }
  for (let i = 0; i < col; i++) {
    if (val === board[row][i]) return false;
  }
  let idx = Math.floor(row / 3) * 3 + Math.floor(col / 3);
  if (boxes[idx].has(val)) return false;
  return true;
}
