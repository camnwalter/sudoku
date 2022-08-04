export const SIZE = 9;
const SQRT = Math.round(Math.sqrt(SIZE));

export const locationToIndex = (row: number, col: number) => row * SIZE + col;

const shuffle = (array: number[]) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

const randomNum = (num: number) => Math.floor(Math.random() * num + 1);

const fillDiagonal = (
  setNumber: (index: number, value: number | null) => void
) => {
  const nums = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);

  for (let a = 0; a < SIZE; a++) {
    const randomNumber = nums[a];
    setNumber(locationToIndex(a, a), randomNumber);
  }
};

const fillBox = (
  i: number,
  board: (number | null)[],
  setNumber: (index: number, value: number | null) => void
) => {
  let boxNum = 0;
  for (let a = 0; a < 9; a++) {
    boxNum =
      Math.floor(a / 3) * 9 + Math.floor(i / 3) * 27 + (a % 3) + 3 * (i % 3);
    if (board[boxNum] !== null) continue;

    let num = null;
    while (!checkValidBox(i, num, board)) {
      num = randomNum(SIZE);
    }

    setNumber(boxNum, num);
  }
};

const fillTheDiagonals = (
  board: (number | null)[],
  setNumber: (index: number, value: number | null) => void
) => {
  fillDiagonal(setNumber);

  for (let i = 0; i < SIZE; i += 4) {
    fillBox(i, board, setNumber);
  }
};

const checkValidRow = (row: number, val: number, board: (number | null)[]) => {
  const nums = new Set<number | null>();
  for (let i = 0; i < SIZE; i++) {
    nums.add(board[locationToIndex(row, i)]);
  }
  return !nums.has(val);
};

const checkValidCol = (col: number, val: number, board: (number | null)[]) => {
  const nums = new Set<number | null>();
  for (let i = 0; i < SIZE; i++) {
    nums.add(board[locationToIndex(i, col)]);
  }
  return !nums.has(val);
};

/*
  Boxes:
  0 1 2
  3 4 5
  6 7 8
*/
const checkValidBox = (
  box: number,
  val: number | null,
  board: (number | null)[]
) => {
  if (val == null) return false;

  const nums = new Set<number | null>();
  const start = 27 * Math.floor(box / 3) + 3 * (box % 3);
  for (let i = 0; i < 9; i++) {
    const curr = start + (i % 3) + 9 * Math.floor(i / 3);
    nums.add(board[curr]);
  }

  return !nums.has(val);
};

//use dfs to check for possible solutions
const fillRest = (
  row: number,
  col: number,
  board: (number | null)[],
  setNumber: (index: number, value: number | null) => void
) => {
  //the board is now filled
  if (row >= SIZE && col >= SIZE) {
    return true;
  }

  //you have reached the end of the row, go down
  if (col >= SIZE && row < SIZE - 1) {
    row++;
    col = 0;
  }

  //box 0
  if (row < SQRT && col < SQRT) col = SQRT;
  //box 4
  if (row >= SQRT && row < 2 * SQRT && col >= SQRT && col < 2 * SQRT) {
    col = 2 * SQRT;
  }
  //box 8
  if (row >= 2 * SQRT && col >= 2 * SQRT) {
    row++;
    col = 0;
    if (row >= SIZE) return true;
  }

  const index = row * SIZE + col;

  const box = SQRT * Math.floor(row / SQRT) + Math.floor(col / SQRT);

  for (let i = 1; i <= SIZE; i++) {
    if (
      checkValidRow(row, i, board) &&
      checkValidCol(col, i, board) &&
      checkValidBox(box, i, board)
    ) {
      setNumber(index, i);
      if (fillRest(row, col + 1, board, setNumber)) return true; //this last state was fine! use this state again
      setNumber(index, null); //if it did not work, return to previous state
    }
  }

  return false;
};

const removeSomeNumbers = (
  numToRemove: number,
  board: (number | null)[],
  setNumber: (index: number, value: number | null) => void
) => {
  while (numToRemove-- > 0) {
    const row = randomNum(SIZE);
    const col = randomNum(SIZE);
    if (board[locationToIndex(row, col)] !== null) {
      setNumber(row * SIZE + col, null);
    } else numToRemove++;
  }
};

export const generateNewBoard = (
  numsToRemove: number,
  board: (number | null)[],
  setNumber: (index: number, value: number | null) => void
) => {
  fillTheDiagonals(board, setNumber);
  fillRest(0, 3, board, setNumber);
  removeSomeNumbers(numsToRemove, board, setNumber);
};
