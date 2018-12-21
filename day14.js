// Advent of Code 2018 - Day14 - works but not beautiful

// globals
const scores = [3,7];
let firstElfIndex = 0;
let secondElfIndex = 1;

const addNewScores = () => {  // PART1
  // sums current two scores // sum always between 0..19 
  // if >= 10 --> return two scores
  // if < 10 --> return one score
  const sum = scores[firstElfIndex] + scores[secondElfIndex];
  if (sum < 10) {
    scores.push(sum) 
  } else if (sum === 10) {
    scores.push(1);
    scores.push(0);
  } else if (sum > 10) {
    scores.push(1);
    scores.push(sum % 10);
  }
}

const addNewScoresWithCheck = (sequense) => {  // PART2
  // sums current two scores // sum always between 0..19 
  // if >= 10 --> return two scores
  // if < 10 --> return one score
  const seqLength = sequense.length;
  const sum = scores[firstElfIndex] + scores[secondElfIndex];
  let check = false;
  if (sum < 10) {
    scores.push(sum) 
    check = checkIfMatch(sequense);
    if (check) {
      return scores.length;
    }
  } else if (sum === 10) {
    scores.push(1);
    check = checkIfMatch(sequense);
    if (check) {
      return scores.length;
    }
    scores.push(0);
    check = checkIfMatch(sequense);
    if (check) {
      return scores.length;
    }
  } else if (sum > 10) {
    scores.push(1);
    check = checkIfMatch(sequense);
    if (check) {
      return scores.length; 
    }
    scores.push(sum % 10);
    check = checkIfMatch(sequense);
    if (check) {
      return scores.length;
    }
  }
  return 0;
}

// check length of input only, plus 2 (or 1) newly added chars - not properly optimized
const checkIfMatch = (sekvenssi) => {
  // const sekvenssiString = sekvenssi.toString();
  let array1 =  scores.slice(scores.length - sekvenssi.length); 
  debugger;
  for (let i = 0; i < sekvenssi.length; i++) {
    if (Number(sekvenssi.charAt(i)) !== array1[i]) {
      return false;
    }
  }
  return true;
}

const getNewIndex = (currentIndex, currentScore) => { // new/next index for Elf/Receipe
  return (currentIndex + currentScore + 1) % scores.length;
}

// make reciepes/scores until enough
// new indexes have to be counted in every round
const makeRecipesUntilEnough = (countNeeded) => {
  while (true) {
    addNewScores();
    if (scores.length >= countNeeded) {
      return;
    }
    firstElfIndex = getNewIndex(firstElfIndex, scores[firstElfIndex]);
    secondElfIndex = getNewIndex(secondElfIndex, scores[secondElfIndex]);
  }
}

const getTenRecipesAfter = (afterThis) => { // lists recipes afterThis + 1...afterThis + 10 
  makeRecipesUntilEnough(afterThis + 10);
  const sliceOfTen = scores.slice(afterThis, afterThis + 10).join('');
  console.log(sliceOfTen);
}

// getTenRecipesAfter(824501);

// const result = checkIfMatch('123', [1,2,3]);
// console.log(result);

const backwardCheck = (rounds, seq) => {
  debugger;
  let result = 0;
  for (let i = 0; i < rounds; i++) {
    result = addNewScoresWithCheck(seq);
    if (result > 0) {
      console.log(result - seq.length);
    }
    firstElfIndex = getNewIndex(firstElfIndex, scores[firstElfIndex]);
    secondElfIndex = getNewIndex(secondElfIndex, scores[secondElfIndex]);
  }
}

backwardCheck(22222222, '824501');
