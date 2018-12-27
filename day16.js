const fs = require('fs');

let dataFile = fs.readFileSync('data16.txt', 'utf8');
const data = dataFile.split('\r\n\r\n');
const dataArray = data.map((row) => row.split('\r\n'));

// data transformed to an array of objects
const samplesData = dataArray.reduce((sampleArray, line) => {
  let before = line[0].slice(9,19).split(', ').map(Number);
  let after = line[2].slice(9,19).split(', ').map(Number);
  let instructions = line[1].split(' ').map(Number);
  const sampleObject = {
    Before: before,
    After: after,
    Instructions: instructions,
    Follows: 0
  }
  sampleArray.push(sampleObject);
  return sampleArray;
}, []);

// helpers
const getA = (instruction, immediate, reg) => {
  if (immediate) {
    return instruction[1];
  } else {
    return reg[instruction[1]];
  }
}
const getB = (instruction, immediate, reg) => {
  if (immediate) {
    return instruction[2];
  } else {
    return reg[instruction[2]];
  }
}
const setC = (reg, instruction, value) => {
  reg[instruction[3]] = value;
}
const compareArrays = (arr1, arr2) => { 
  // arrays should be of same size
  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i]) {
      return false;
    }
  }
  return true;
}

// OPCODES:

// addr (add register) stores into register C 
// the result of adding register A and register B.
const addr = (instruction, before, after) => {
  const newValue = getA(instruction, false, before) + getB(instruction, false, before);
  // console.log(newValue);
  setC(before, instruction, newValue);
  if (compareArrays(before, after)) {
    return true;
  } 
  return false;
}
// addi (add immediate) stores into register C 
// the result of adding register A and value B.
const addi = (instruction, before, after) => {
  const newValue = getA(instruction, false, before) + getB(instruction, true, before);
  // console.log(newValue);
  setC(before, instruction, newValue);
  if (compareArrays(before, after)) {
    return true;
  } 
  return false;
}
// mulr (multiply register) stores into register C 
// the result of multiplying register A and register B.
const mulr = (instruction, before, after) => {
  const newValue = getA(instruction, false, before) * getB(instruction, false, before);
  // console.log(newValue);
  setC(before, instruction, newValue);
  if (compareArrays(before, after)) {
    return true;
  } 
  return false;
}
// muli (multiply immediate) stores into register C 
// the result of multiplying register A and value B.
const muli = (instruction, before, after) => {
  const newValue = getA(instruction, false, before) * getB(instruction, true, before);
  // console.log(newValue);
  setC(before, instruction, newValue);
  if (compareArrays(before, after)) {
    return true;
  } 
  return false;
}
// banr (bitwise AND register) stores into register C 
// the result of the bitwise AND of register A and register B.
const banr = (instruction, before, after) => {
  const newValue = getA(instruction, false, before) & getB(instruction, false, before);
  // console.log(newValue);
  setC(before, instruction, newValue);
  if (compareArrays(before, after)) {
    return true;
  } 
  return false;
}
// bani (bitwise AND immediate) stores into register C 
// the result of the bitwise AND of register A and value B.
const bani = (instruction, before, after) => {
  const newValue = getA(instruction, false, before) & getB(instruction, true, before);
  // console.log(newValue);
  setC(before, instruction, newValue);
  if (compareArrays(before, after)) {
    return true;
  } 
  return false;
}
// borr (bitwise OR register) stores into register C 
// the result of the bitwise OR of register A and register B.
const borr = (instruction, before, after) => {
  const newValue = getA(instruction, false, before) | getB(instruction, false, before);
  // console.log(newValue);
  setC(before, instruction, newValue);
  if (compareArrays(before, after)) {
    return true;
  } 
  return false;
}
// bori (bitwise OR immediate) stores into register C 
// the result of the bitwise OR of register A and value B.
const bori = (instruction, before, after) => {
  const newValue = getA(instruction, false, before) | getB(instruction, true, before);
  // console.log(newValue);
  setC(before, instruction, newValue);
  if (compareArrays(before, after)) {
    return true;
  } 
  return false;
}
// setr (set register) copies the contents of register A 
// into register C. (Input B is ignored.)
const setr = (instruction, before, after) => {
  const newValue = getA(instruction, false, before);
  // console.log(newValue);
  setC(before, instruction, newValue);
  if (compareArrays(before, after)) {
    return true;
  } 
  return false;
}
// seti (set immediate) stores value A 
// into register C. (Input B is ignored.)
const seti = (instruction, before, after) => {
  const newValue = getA(instruction, true, before);
  // console.log(newValue);
  setC(before, instruction, newValue);
  if (compareArrays(before, after)) {
    return true;
  } 
  return false;
}
// gtir (greater-than immediate/register) sets register C 
// to 1 if value A is greater than register B. Otherwise, register C is set to 0.
const gtir = (instruction, before, after) => {
  const a = getA(instruction, true, before); 
  const b = getB(instruction, false, before);
  if (a > b) {
    setC(before, instruction, 1);
  } else {
    setC(before, instruction, 0);
  }
  if (compareArrays(before, after)) {
    return true;
  } 
  return false;
}
// gtri (greater-than register/immediate) sets register C 
// to 1 if register A is greater than value B. Otherwise, register C is set to 0.
const gtri = (instruction, before, after) => {
  const a = getA(instruction, false, before); 
  const b = getB(instruction, true, before);
  if (a > b) {
    setC(before, instruction, 1);
  } else {
    setC(before, instruction, 0);
  }
  if (compareArrays(before, after)) {
    return true;
  } 
  return false;
}
// gtrr (greater-than register/register) sets register C 
// to 1 if register A is greater than register B. Otherwise, register C is set to 0.
const gtrr = (instruction, before, after) => {
  const a = getA(instruction, false, before); 
  const b = getB(instruction, false, before);
  if (a > b) {
    setC(before, instruction, 1);
  } else {
    setC(before, instruction, 0);
  }
  if (compareArrays(before, after)) {
    return true;
  } 
  return false;
}
// eqir (equal immediate/register) sets register C 
// to 1 if value A is equal to register B. Otherwise, register C is set to 0.
const eqir = (instruction, before, after) => {
  const a = getA(instruction, true, before); 
  const b = getB(instruction, false, before);
  if (a === b) {
    setC(before, instruction, 1);
  } else {
    setC(before, instruction, 0);
  }
  if (compareArrays(before, after)) {
    return true;
  } 
  return false;
}
// eqri (equal register/immediate) sets register C 
// to 1 if register A is equal to value B. Otherwise, register C is set to 0.
const eqri = (instruction, before, after) => {
  const a = getA(instruction, false, before); 
  const b = getB(instruction, true, before);
  if (a === b) {
    setC(before, instruction, 1);
  } else {
    setC(before, instruction, 0);
  }
  if (compareArrays(before, after)) {
    return true;
  } 
  return false;
}
// eqrr (equal register/register) sets register C 
// to 1 if register A is equal to register B. Otherwise, register C is set to 0.
const eqrr = (instruction, before, after) => {
  const a = getA(instruction, false, before); 
  const b = getB(instruction, false, before);
  if (a === b) {
    setC(before, instruction, 1);
  } else {
    setC(before, instruction, 0);
  }
  if (compareArrays(before, after)) {
    return true;
  } 
  return false;
}

// Check all samples&opcodes
const check = (samples) => {
  samplesData.map((sample) => {
    if (addr(sample.Instructions, [...sample.Before], sample.After) ) {
      sample.Follows++;
    }
    if (addi(sample.Instructions, [...sample.Before], sample.After) ) {
      sample.Follows++;
    }
    if (mulr(sample.Instructions, [...sample.Before], sample.After) ) {
      sample.Follows++;
    }
    if (muli(sample.Instructions, [...sample.Before], sample.After) ) {
      sample.Follows++;
    }
    if (banr(sample.Instructions, [...sample.Before], sample.After) ) {
      sample.Follows++;
    }
    if (bani(sample.Instructions, [...sample.Before], sample.After) ) {
      sample.Follows++;
    }
    if (borr(sample.Instructions, [...sample.Before], sample.After) ) {
      sample.Follows++;
    }
    if (bori(sample.Instructions, [...sample.Before], sample.After) ) {
      sample.Follows++;
    }
    if (setr(sample.Instructions, [...sample.Before], sample.After) ) {
      sample.Follows++;
    }
    if (seti(sample.Instructions, [...sample.Before], sample.After) ) {
      sample.Follows++;
    }
    if (gtir(sample.Instructions, [...sample.Before], sample.After) ) {
      sample.Follows++;
    }
    if (gtri(sample.Instructions, [...sample.Before], sample.After) ) {
      sample.Follows++;
    }
    if (gtrr(sample.Instructions, [...sample.Before], sample.After) ) {
      sample.Follows++;
    }
    if (eqir(sample.Instructions, [...sample.Before], sample.After) ) {
      sample.Follows++;
    }
    if (eqri(sample.Instructions, [...sample.Before], sample.After) ) {
      sample.Follows++;
    }
    if (eqrr(sample.Instructions, [...sample.Before], sample.After) ) {
      sample.Follows++;
    }
  });
}

// RUN
// check the opcodes
check(samplesData);
// filter objects which follow three or more opcodes
const filteredArray = samplesData.filter((sample) => sample.Follows >= 3);
// final result
console.log(filteredArray.length);

// console.log(samplesData)
// addr([9, 2, 1, 2], [3, 2, 1, 1], [3, 2, 2, 1]);
// addi([9, 2, 1, 2], [3, 2, 1, 1], [3, 2, 2, 1]);
// mulr([9, 2, 1, 2], [3, 2, 1, 1], [3, 2, 2, 1]);
// muli([9, 2, 1, 2], [3, 2, 1, 1], [3, 2, 2, 1]);
// banr([9, 2, 1, 2], [3, 2, 1, 1], [3, 2, 2, 1]);
// bani([9, 2, 1, 2], [3, 2, 1, 1], [3, 2, 2, 1]);
// borr([9, 2, 1, 2], [3, 2, 1, 1], [3, 2, 2, 1]);
// bori([9, 2, 1, 2], [3, 2, 1, 1], [3, 2, 2, 1]);
// setr([9, 2, 1, 2], [3, 2, 1, 1], [3, 2, 2, 1]);
// seti([9, 2, 1, 2], [3, 2, 1, 1], [3, 2, 2, 1]);
// gtir([9, 2, 1, 2], [3, 2, 1, 1], [3, 2, 2, 1]);
// gtri([9, 2, 1, 2], [3, 2, 1, 1], [3, 2, 2, 1]);
// gtrr([9, 2, 1, 2], [3, 2, 1, 1], [3, 2, 2, 1]);
// eqir([9, 2, 1, 2], [3, 2, 1, 1], [3, 2, 2, 1]);
// eqri([9, 2, 1, 2], [3, 2, 1, 1], [3, 2, 2, 1]);
// eqrr([9, 2, 1, 2], [3, 2, 1, 1], [3, 2, 2, 1]);