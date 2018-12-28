const fs = require('fs');

let dataFile = fs.readFileSync('data16_part2.txt', 'utf8');
const data = dataFile.split('\r\n');
const instructionArray = data.map((row) => row.split(' ').map(Number));

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

// PART 2 TEST PROGRAM, OPCODEFUNCTIONS:

// addr (add register) stores into register C 
// the result of adding register A and register B.
const addr = (instruction, before) => {
  const newValue = getA(instruction, false, before) + getB(instruction, false, before);
  // console.log(newValue);
  setC(before, instruction, newValue);
  return before;
}
// addi (add immediate) stores into register C 
// the result of adding register A and value B.
const addi = (instruction, before) => {
  const newValue = getA(instruction, false, before) + getB(instruction, true, before);
  // console.log(newValue);
  setC(before, instruction, newValue);
  return before;
}
// mulr (multiply register) stores into register C 
// the result of multiplying register A and register B.
const mulr = (instruction, before) => {
  const newValue = getA(instruction, false, before) * getB(instruction, false, before);
  // console.log(newValue);
  setC(before, instruction, newValue);
  return before;
}
// muli (multiply immediate) stores into register C 
// the result of multiplying register A and value B.
const muli = (instruction, before) => {
  const newValue = getA(instruction, false, before) * getB(instruction, true, before);
  // console.log(newValue);
  setC(before, instruction, newValue);
  return before;
}
// banr (bitwise AND register) stores into register C 
// the result of the bitwise AND of register A and register B.
const banr = (instruction, before) => {
  const newValue = getA(instruction, false, before) & getB(instruction, false, before);
  // console.log(newValue);
  setC(before, instruction, newValue);
  return before;
}
// bani (bitwise AND immediate) stores into register C 
// the result of the bitwise AND of register A and value B.
const bani = (instruction, before) => {
  const newValue = getA(instruction, false, before) & getB(instruction, true, before);
  // console.log(newValue);
  setC(before, instruction, newValue);
  return before;
}
// borr (bitwise OR register) stores into register C 
// the result of the bitwise OR of register A and register B.
const borr = (instruction, before) => {
  const newValue = getA(instruction, false, before) | getB(instruction, false, before);
  // console.log(newValue);
  setC(before, instruction, newValue);
  return before;
}
// bori (bitwise OR immediate) stores into register C 
// the result of the bitwise OR of register A and value B.
const bori = (instruction, before) => {
  const newValue = getA(instruction, false, before) | getB(instruction, true, before);
  // console.log(newValue);
  setC(before, instruction, newValue);
  return before;
}
// setr (set register) copies the contents of register A 
// into register C. (Input B is ignored.)
const setr = (instruction, before) => {
  const newValue = getA(instruction, false, before);
  // console.log(newValue);
  setC(before, instruction, newValue);
  return before;
}
// seti (set immediate) stores value A 
// into register C. (Input B is ignored.)
const seti = (instruction, before) => {
  const newValue = getA(instruction, true, before);
  // console.log(newValue);
  setC(before, instruction, newValue);
  return before;
}
// gtir (greater-than immediate/register) sets register C 
// to 1 if value A is greater than register B. Otherwise, register C is set to 0.
const gtir = (instruction, before) => {
  const a = getA(instruction, true, before); 
  const b = getB(instruction, false, before);
  if (a > b) {
    setC(before, instruction, 1);
  } else {
    setC(before, instruction, 0);
  }
  return before;
}
// gtri (greater-than register/immediate) sets register C 
// to 1 if register A is greater than value B. Otherwise, register C is set to 0.
const gtri = (instruction, before) => {
  const a = getA(instruction, false, before); 
  const b = getB(instruction, true, before);
  if (a > b) {
    setC(before, instruction, 1);
  } else {
    setC(before, instruction, 0);
  }
  return before;
}
// gtrr (greater-than register/register) sets register C 
// to 1 if register A is greater than register B. Otherwise, register C is set to 0.
const gtrr = (instruction, before) => {
  const a = getA(instruction, false, before); 
  const b = getB(instruction, false, before);
  if (a > b) {
    setC(before, instruction, 1);
  } else {
    setC(before, instruction, 0);
  }
  return before;
}
// eqir (equal immediate/register) sets register C 
// to 1 if value A is equal to register B. Otherwise, register C is set to 0.
const eqir = (instruction, before) => {
  const a = getA(instruction, true, before); 
  const b = getB(instruction, false, before);
  if (a === b) {
    setC(before, instruction, 1);
  } else {
    setC(before, instruction, 0);
  }
  return before;
}
// eqri (equal register/immediate) sets register C 
// to 1 if register A is equal to value B. Otherwise, register C is set to 0.
const eqri = (instruction, before) => {
  const a = getA(instruction, false, before); 
  const b = getB(instruction, true, before);
  if (a === b) {
    setC(before, instruction, 1);
  } else {
    setC(before, instruction, 0);
  }
  return before;
}
// eqrr (equal register/register) sets register C 
// to 1 if register A is equal to register B. Otherwise, register C is set to 0.
const eqrr = (instruction, before) => {
  const a = getA(instruction, false, before); 
  const b = getB(instruction, false, before);
  if (a === b) {
    setC(before, instruction, 1);
  } else {
    setC(before, instruction, 0);
  }
  return before;
}

/// PART2 - for checking of meaning of opcodes
// opcodefunctions in manually selected order
const opcodeFunctionsArray = [eqri, mulr, gtri, gtrr, banr, addi, seti, gtir, muli, bori,  setr, addr, bani, borr, eqir, eqrr];

// let's run the program:
let startRegister = [0,0,0,0];
for (let i = 0; i < instructionArray.length; i++) {
  let rule = opcodeFunctionsArray[instructionArray[i][0]];
  startRegister = rule(instructionArray[i], startRegister);
  console.log(startRegister);
}

// BELOW CODE GIVES THE OPCODES AND CORRESPONDING FUNCTIONS
// filter to get samples by opcode
const filteredByOpcode = (opcode) => samplesData.filter(sample =>  {
  return sample.Instructions[0] === opcode;
});

// instructions with one selected opcode will be checked using different opcode functions, one at a time
// if whole filtered array produces true --> opcode function is valid 
// --> return (or push to array if cannot be assumed 1 opcode -- 1 function only)

const checkOpcode = (opcode) => {
  const samplesByOpcode = filteredByOpcode(opcode);
  const retArr = [];
  for (let i = 0; i < opcodeFunctionsArray.length; i++) { // check one opcodefunction at a time
    if (checkFunction(samplesByOpcode, opcodeFunctionsArray[i])) {
      retArr.push(opcodeFunctionsArray[i]);
      // return opcodeFunctionsArray[i];
    }
  }
  return retArr;
}

// // checks if function returns true for every sample
const checkFunction = (samplesByOpcode, OCfunction) => {
  for (let j = 0; j < samplesByOpcode.length; j++) { // check one sample at a time
    if (!OCfunction(samplesByOpcode[j].Instructions, [...samplesByOpcode[j].Before], samplesByOpcode[j].After)) {
      return false;
    }
  }
  return true;
}

// get all opcodes-function-pairs as an array
// opcodes 0..15
// for (i = 0; i <= 15; i++) {
//   const result = checkOpcode(i); 
//   console.log(i, result);
// }
// gives result --> manual work for a change, could be looped..  -->
/*
3 gtrr
2 gtri
10 setr
14 eqir
15 eqrr
0 eqri
7 gtir
4 banr
12 bani
6 seti
1 mulr
5 addi
11 addr
13 borr
9 bori
8 muli
*/
// The registers start with the value 0

