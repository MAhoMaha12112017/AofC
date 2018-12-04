const fs = require('fs');

// fs.readFile('./data4.txt', "utf8", (err, data) => {
fs.readFile('./datacheck.txt', "utf8", (err, data) => {

  if (err) throw err;
  
  const inputArray = data.split('\r\n');
  inputArray.sort();
  // console.log(inputArray);
  const editedArray = editArray(inputArray);
  console.log('editedArray ' , editedArray);
  // kirjoita(editedArray);
  const sleepTimes = getSleepTimes(editedArray);
  // console.log(sleepTimes);
  // getGuard who sleeps the most
  const sleepyID = getSleepyGuardID(sleepTimes);
  // console.log(sleepyID);
  // get Sleepiest Guard Data
  const sleepiestData = sleepiestGuardData(sleepyID, editedArray);
  // console.log(sleepiestData);
  const sleepyMinute = getSleepiestMinute(sleepiestData);
  console.log(sleepyMinute*sleepyID);

});

const getSleepiestMinute = (sleepiestData) => {
  const minutes = Array(60).fill(0);
  for (let i = 0; i < sleepiestData.length; i++) {
    // console.log(sleepiestData[i]);
    for (j = sleepiestData[i].falltime; j < sleepiestData[i].waketime; j++) {
      minutes[j]++;
    }
  }
  // which has most minutes
  let maxminutes = 0;
  let maxminutesId = 0;
  for (let k = 0; k < minutes.length; k++) {
    if (minutes[k] > maxminutes) {
      maxminutes = minutes[k];
      maxminutesId = k;
    }
  }
  return maxminutesId;
}

const sleepiestGuardData = (sleepyID, array) => {
  const sleepMinutesObject = [];

  const arrayLength = array.length;
  let falltime = 0;

  for (let i = 0; i < arrayLength; i++) {
    // if new guard, change id and null fall time
    if (array[i][1].includes('#')) {
      const regex1 = / begins shift/;
      const regex2 = /Guard #/;
      id = array[i][1].replace(regex1, '').replace(regex2, '');
    // if slept, save time to variable
    } else if (array[i][1].includes('falls asleep')) {
      falltime = Number(array[i][0]);
    // if wakes, save time value to array - only if id match!!! (copypasted..not very clever)
    } else if (array[i][1].includes('wakes up') && id === sleepyID) {
      waketime = Number(array[i][0]);
      sleepMinutesObject.push({falltime, waketime});
    }
  }
  console.log('sleepMinutesObject ', sleepMinutesObject);
  return sleepMinutesObject;
}


const editArray = (array) =>
  array.map((row) => row.slice(15)).map((row) => row.split('] '));

const getSleepTimes = (array) => {
  // array to collect sleep times
  const sleepTimeObject = {};

  const arrayLength = array.length;
  let id = null;
  let falltime = 0;

  for (let i = 0; i < arrayLength; i++) {
    // if new guard, change id and null fall time
    if (array[i][1].includes('#')) {
      const regex1 = / begins shift/;
      const regex2 = /Guard #/;
      id = array[i][1].replace(regex1, '').replace(regex2, '');
      falltime = 0;
    // if slept, save time to variable
    } else if (array[i][1].includes('falls asleep')) {
      falltime = Number(array[i][0]);
    // if wakes, save time value to array
    } else if (array[i][1].includes('wakes up')) {
      waketime = Number(array[i][0]);
      saveSleepTime(id, falltime, waketime, sleepTimeObject);
    }
  }
  console.log('sleepTimeObject ', sleepTimeObject);
  return sleepTimeObject;
}

const saveSleepTime = (id, falltime, waketime, sleepTimeObject) => {
  if (sleepTimeObject[id]) {
    sleepTimeObject[id].sleeptime =  sleepTimeObject[id].sleeptime + (waketime-falltime);
  } else {
    sleepTimeObject[id] = {
      sleeptime: waketime-falltime
    }
  }
}

// hakee
const getSleepyGuardID = (sleepTimes) => {
  let sleepyID = null;
  let maxSleep = 0;
  for (let key in sleepTimes) {
    // console.log(key, ' ', sleepTimes[key])
    if (sleepTimes[key].sleeptime > maxSleep) {
      maxSleep = sleepTimes[key].sleeptime;
      sleepyID = key;
    }
  }
  console.log(sleepyID)
  return sleepyID;
}

function kirjoita(data) {
  fs.writeFile('message3.txt', data, (err) => {
    if (err) throw err;
    console.log('The file has been saved!');
  });
}
