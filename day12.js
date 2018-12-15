// Advent of Code - Day12 Part1 - Not the cleanest of solutions but works
// For Part2 too slow
// First time in AOC 2018 I'm not sure if I understand the rules 100%
// so no interest to finalize part2 at the moment

const fs = require('fs')

// DATA
// initialState = '#.#.#...#..##..###.##.#...#.##.#....#..#.#....##.#.##...###.#...#######.....##.###.####.#....#.#..##';
// initialState = '...' + initialState;
const testdata = '#..#.#..##......###...###';
const emptyPotsBeforeI = '.....';
const correctionOfIndex = emptyPotsBeforeI.length;
const initialState = emptyPotsBeforeI + testdata + '.................' // 

fs.readFile('./day12testdata.txt', "utf8", (err, data) => {
  if (err) throw err;
  
  let rulesArray = data.split('\r\n');
  rulesArray = rulesArray.map((rule) => rule.split(' => ') )
  // console.log('rulesArray: ', rulesArray);
  const initialArray = getInitialArray(initialState);
  const lastGeneration = getGenerations(rulesArray, initialArray, 20);
  console.log(lastGeneration.join(''));
  const value = countValueOfGeneration(lastGeneration, correctionOfIndex);
  // console.log(lastGeneration);
  console.log(value);
});

const countValueOfGeneration = (array, emptyPotsBeforeI) => {
  let count = 0;
  for (let i = 0; i < array.length; i++) {
    if (array[i] === '#') {
      count += i - emptyPotsBeforeI;
    }
  }
  // console.log(count);
  return count;
  
}

const  getGenerations = (rulesArray, array, generations) => {
  for (let i = 0; i < generations; i++) {
    array = getGeneration(rulesArray, array);
  }
  return array;
}

const getGeneration = (rulesArray, array) => {
  let editedArray = array.slice(0,2); // start with first two chars
  const lastValuesOfArray = array.slice(array.length-3);
  // read the string and form output by the rules, i times
  // first 2 indexes not regarded as a plant // have to be expanded/edited!!! 
  for (let i = 2; i < array.length - 3; i++) { // rule has 5 pots // one more for the road?
    // get pots around a plant in index i
    debugger;
    let stringFromArray = array[i-2]+array[i-1]+array[i]+array[i+1]+array[i+2];
    let foundAlready = false;
    // check one rule at a time against the pots string
    for (let r = 0; r < rulesArray.length; r++) {
      if (stringFromArray === rulesArray[r][0]) {
        editedArray[i] = rulesArray[r][1];
        foundAlready = true;
        break;
      }
    } 
    if (!foundAlready) {
      editedArray[i] = '.';
    }
  } 
  console.log(editedArray.join(''));
  editedArray = editedArray.concat(lastValuesOfArray);
  return editedArray;
}

const getInitialArray = (initialState) => {
  return initialState.split('');
}

