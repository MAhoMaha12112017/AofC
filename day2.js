const fs = require('fs');

fs.readFile('./data2.txt', "utf8", (err, data) => {
  // 1 & 2
  if (err) throw err;
  const inputArray = data.split('\r\n');

  // 1
  const checkSum = getcheckSum(inputArray);
  console.log('Checksum: ', checkSum);

  // 2
  for (let i = 0; i < inputArray.length - 1; i++) {
    for (let j=i+1; j < inputArray.length; j++) {
      let commonLetters = findCommonLetters(inputArray[i], inputArray[j]);
      if (commonLetters) {
        console.log('Common letters: ', giveEqualParts(inputArray[i], inputArray[j]))
      }
    }
  }
})

// 2 // function returns true if exactly one common letter - divide & conquer
function findCommonLetters(string1, string2) {
  
  // devide and compare both halfs
  let middle = Math.floor(string1.length / 2);
  const sameLeft = compareStrings(string1.slice(0, middle), string2.slice(0, middle));
  const sameRight = compareStrings(string1.slice(middle), string2.slice(middle));

  // last round should have only one char which should be different
  if (string1.length === 1 && string2.length === 1) {
    // if one chars only, which are different --> true
    if (string1 !== string2) {
      return true;
    } else {
      //  if one chars only, which are equal --> false
      return false;
    }
  }
  if (sameLeft && !sameRight) {
    // exactly one false-half, meaning right, continued with the false half 
    return findCommonLetters(string1.slice(middle), string2.slice(middle));
  } else if (!sameLeft && sameRight) {
    // exactly one false half, meaning left, continued with the false half 
    return findCommonLetters(string1.slice(0, middle), string2.slice(0, middle));
  } 
  return false;
}

// 2 // function just to make all more readable
function compareStrings(str1, str2) {
  if (str1 === str2) {
    return true;
  } 
  return false;
}

// 2 // function removes different character, leaves the rest
function giveEqualParts(string1, string2) {
  let index;
  for(let i = 0; i < string1.length; i++) {
    if (string1.charAt(i) !== string2.charAt(i) ) {
      return string1.slice(0, i) + string1.slice(i + 1);
    }
  }     
}

// 1 // function forms the checksum based to input array and given rules
function getcheckSum(array) {
  let twos = 0;
  let threes = 0;
  // loop of array --> password
  for (i = 0; i < array.length; i++) {
    let twoOrThrees = find2or3Same(array[i]); 
    twos = twos + twoOrThrees.twos;
    threes = threes + twoOrThrees.threes;
  }
  return twos * threes;
}

// 1 // function checks if same char 2/3 times
function find2or3Same(stringi) {
  let twos = 0;
  let threes = 0;
  
  const characterCounts = findCountOfCharacters(stringi);
  const counts = Object.values(characterCounts);
  
  if (counts.includes(2)) {
    twos = 1;
  } 
  if (counts.includes(3)) {
    threes = 1;
  }
  // 1 // returns object prop: twos as 0/1 and threes as 0/1 (no other values allowed)
  return {
    twos,
    threes
  }
}

// 1 // function counts number of character occurences
function findCountOfCharacters(stringi) {
  const charCounts = {};

  // occurrence of each number counted by incrementing counter in object. 
  for (let i = 0; i < stringi.length; i++) {
    if (charCounts[stringi.charAt(i)]) {
      charCounts[stringi.charAt(i)]++;
    } else {
      charCounts[stringi.charAt(i)] = 1;
    }
  }
  // returned as an object (letter incountered : count)
  return charCounts;
}





