// Advent Of Code - Day11 - Part1, Part2
// Part2 is very slow (9 min in and old laptop) - NEEDS OPTIMIZATIONS - 
// first idea would be to count only 2x2 sums and use this with input (1x1 sums) to count other sums
// other sums could be saved and used and so on..
// more sophisticated loop cound be build
// 2 days behind in calendar...not instrest for optimization right now

// global 
let cells = [];

const countAndFillPowerLevels = (serialNumber) => {
  cells = Array(301).fill(0).map(x => Array(301).fill(0))
  // // loop and count one at the time
  for (x = 1; x <= 300; x++) {
    for (y = 1; y <= 300; y++) {
      let result = ((x + 10) * y + serialNumber) * (x + 10);
      result = getHundreds(result) - 5;
      cells[x][y] = result;
    }
  }
  return cells;
}

const getHundreds = (number) => {
  if (Math.abs(number < 100)) {
    return 0;
  }
  let editedNumber = number.toString();
  editedNumber = editedNumber.substring(editedNumber.length-2, editedNumber.length-3);
  return Number(editedNumber);
}

const getTheSquare = (cells) => {
  const squareSums = Array(301).fill(0).map(x => Array(301).fill(0))
  debugger;
  for (let x = 1; x < cells[0].length - 3; x++) {
    for (let y = 1; y < cells[x].length - 3; y++) { // indexes with 0 not in use
      let sum = cells[x][y] + cells[x+1][y] + cells[x+2][y] +cells[x][y+1] + cells[x+1][y+1] + cells[x+2][y+1] + cells[x][y+2] + cells[x+1][y+2] + cells[x+2][y+2];
      squareSums[x][y] = sum;
    }
  }
  return squareSums;
}

const getSquareOfSizeGiven = (cells, squareSize) => {
  let squareSums = Array(301).fill(0).map(x => Array(301).fill(0))
  debugger;
  // starting coordinate area
  for (let x = 1; x < cells[0].length - squareSize; x++) { // have to be inside the borders
    for (let y = 1; y < cells[x].length - squareSize; y++) { // indexes with 0 not in use
      // starting coordinates given, loop given square size
      let sum = 0;
      for (z = 0; z < squareSize; z++) {
        for(k = 0; k < squareSize; k++) {
          sum += cells[x+z][y+k];
          squareSums[x][y] = sum;
        }
      }
    }
  }
  // return the sums in grid
  return squareSums;
}

// find biggest from 1..300, 1..300 grid (size hardcoded)
// NOTE: there are zeros hardcoded in the outer fields if nothing added..
const findBiggest = (twoDimArray) => {
  let max = twoDimArray[1][1];
  let maxindex = [1,1];
  for (x = 1; x <= 300; x++) {
    for (y = 1; y <= 300; y++) {
      if (twoDimArray[x][y] > max) {
        max = twoDimArray[x][y];
        maxindex = [x,y];
      }
    }
  }
  return [max, maxindex];
}

const findBiggestOfBiggest = () => {
  let biggest = 0; // already known > 0, if not, have to be fixed
  let biggestValues = [];
  let sizeOfBiggest = 0;
  // loop squares of one size at the time and check the biggest one
  for (let i = 1; i <= 300; i++) { // hardcoded the size of grid
    const sumGrid = getSquareOfSizeGiven(cells, i);
    const biggestOfGrid = findBiggest(sumGrid) // first index: biggest, second: coordinates
    if (biggestOfGrid[0] > biggest) {
      biggest = biggestOfGrid[0];
      biggestValues = biggestOfGrid;
      sizeOfBiggest = i;
    }
    // console.log(sumGrid);
  }
  return [biggest, biggestValues, sizeOfBiggest];
}

cells = countAndFillPowerLevels(5235);

const square = getTheSquare(cells);
const biggest = findBiggest(square);
console.log(biggest);

const bigX = findBiggestOfBiggest();
// const big = findBiggest(sumOfAnySizeSquare);
console.log(bigX);
// console.log(sumOfAnySizeSquare);
