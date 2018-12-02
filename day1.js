const fs = require('fs');
let numbersObject = {};
numbersObject[0] = 0;

fs.readFile('./data.txt', "utf8", (err, data) => {
  if (err) throw err;
  
  const inputArray = data.split('\r\n');
  const numbersArray = inputArray.map(Number);

  // 1
  const sum = numbersArray.reduce((a, b) => a + b);
  console.log(sum);

  // 2
  let numbersObject = {};
  numbersObject[0] = 0;

  const firstSameSum = findDuplicate(numbersArray, 0);
  console.log(firstSameSum);

});

function findDuplicate(array, sum) {

  let counter = 0;
  const length = array.length;

  while (counter < length) {
    sum = sum + array[counter];

    if (numbersObject[sum] ) {
      return sum;
    } else {
      numbersObject[sum] = sum;
    }
    counter++;
  }

  return findDuplicate(array, sum);
}

