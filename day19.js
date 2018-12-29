const fs = require('fs');

let dataFile = fs.readFileSync('data19.txt', 'utf8');
const data = dataFile.split('\r\n');
const pointerBound = data.splice(0,1)[0].substring(4);
let instructionArray = data.map((row) => row.split(' '));
instructionArray = instructionArray.map((row) => {
  return [row[0], Number(row[1]), Number(row[2]), Number(row[3])]
});

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
const getPointerFromReg = (pointerBound, reg) => {
  return reg[pointerBound];
} 
const setPointerToReg = (pointerValue, reg) => {
  reg[pointerBound] = pointerValue;
}


// OPCODEFUNCTIONS:

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

// input functionname gives a function based to functions array from day16
const opcodeFunctionsArray = [eqri, mulr, gtri, gtrr, banr, addi, seti, gtir, muli, bori,  setr, addr, bani, borr, eqir, eqrr];
const getFunctionByFunctionName = (functionName) => {
  for (let i = 0; i < opcodeFunctionsArray.length; i++) {
    if (opcodeFunctionsArray[i].name === functionName) {
      return opcodeFunctionsArray[i];
    }
  }
  return null;
}

// let's run starting with zero reg and pointerBound value from first line of instructions
let register = [0,0,0,0,0,0];
let instructionIndex = getPointerFromReg(pointerBound, register);
let instruction = instructionArray[instructionIndex];
let functionToRun = getFunctionByFunctionName(instruction[0]);
console.log('instructionIndex', instructionIndex)
console.log(instructionArray.length)

while (true) {
  // console.log(instruction);
  instruction = instructionArray[instructionIndex];
  // console.log('instruction', instruction)
  functionToRun = getFunctionByFunctionName(instruction[0]);
  functionToRun(instruction, register);
  // console.log('a register', register);
  instructionIndex = getPointerFromReg(pointerBound, register) + 1;
  // console.log('instructionIndex', instructionIndex);
  if (instructionIndex > instructionArray.length - 1) {
    console.log('instructionIndex outside of array. Program halts.');
    console.log('register', register);
    console.log('instructionIndex', instructionIndex);
    return;
  }  
  setPointerToReg(instructionIndex, register);
}


