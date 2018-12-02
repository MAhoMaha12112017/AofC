const fs = require('fs');

fs.readFile('./data.txt', "utf8", (err, data) => {
  if (err) throw err;
  
  const inputArray = data.split('\r\n');
  const numbersArray = inputArray.map(Number);

  // 1
  const sum = numbersArray.reduce((a, b) => a + b);
  console.log(sum);

  // 2
  const firstSameSum = findDuplicate();
  console.log(firstSameSum(numbersArray, 0));

});

// recursive function to find duplicate sum from array
function findDuplicate(array, sum) {
  let numbersObject = {0:0}; 
  return function findD(array, sum) {
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

    return findD(array, sum);
    }
}



