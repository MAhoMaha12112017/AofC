const fs = require('fs');

fs.readFile('./data.txt', "utf8", (err, data) => {
  if (err) throw err;
  const inputArray = data.split('\r\n');
  const numbersArray = inputArray.map(Number);
  const sum = numbersArray.reduce((a, b) => a + b);

  console.log(sum);
});