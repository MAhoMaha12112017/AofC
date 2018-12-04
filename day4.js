// THIS IS PRETTY AWFUL SPAGHETTI CODE OF NO VALUE.
// Have no time to fix and no need to. Maybe later.
// Spagettikoodia. Toimii. En ala toistaiseksi fiksaamaan.

const fs = require('fs');

fs.readFile('./data4.txt', "utf8", (err, data) => {
  if (err) throw err;
  
  const inputArray = data.split('\r\n');
  inputArray.sort();
  const editedArray = editArray(inputArray);
  const sleepTimesObject = getSleepTimes(editedArray); 
  const sleepTimes = sleepTimesObject[0];
  const sleepTimesForPartTwo = sleepTimesObject[1];
  // console.log('sleepTimesForPartTwo:::', sleepTimesForPartTwo)

  // getGuard who sleeps the most
  const sleepyID = getSleepyGuardID(sleepTimes);
  // get Sleepiest Guard Data
  const sleepiestData = sleepiestGuardData(sleepyID, editedArray);
  const sleepyMinute = getSleepiestMinute(sleepiestData);
  console.log('Part1: ', sleepyMinute*sleepyID);

  const partTwoResult = findMaxMinute(sleepTimesForPartTwo);
  console.log('Part2: ', partTwoResult);
});

const findMaxMinute = (sleepTimesForPartTwo) => {
  let maxkey = 0;
  let maxvalue = 0;
  let minute = 0;
  for (let key in sleepTimesForPartTwo) {
    // haetaan taulukon suurin arvo kutakin id:ta kohti
    for (let i = 0; i < 60; i++) {
      if (sleepTimesForPartTwo[key][i] > maxvalue) {
        maxvalue = sleepTimesForPartTwo[key][i];
        maxkey = key;
        minute = i;
      }
    }
  }
  return minute*maxkey;
}

const getSleepiestMinute = (sleepiestData) => {
  const minutes = Array(60).fill(0);
  for (let i = 0; i < sleepiestData.length; i++) {
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
  // console.log('sleepMinutesObject ', sleepMinutesObject);
  return sleepMinutesObject;
}


const editArray = (array) =>
  array.map((row) => row.slice(15)).map((row) => row.split('] '));

const getSleepTimes = (array) => {
  // array to collect sleep times
  const sleepTimeObject = {};
  const sleepTimeObjectForPartTwo = {};

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
      // for part 2 spaghetti
      saveSleepTimeForPartTwo(id, falltime, waketime, sleepTimeObjectForPartTwo);
    }
  }
  // console.log('sleepTimeObject ', sleepTimeObject);
  return [sleepTimeObject, sleepTimeObjectForPartTwo];
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

const saveSleepTimeForPartTwo = (id, falltime, waketime, sleepTimeObjectForPartTwo) => {

  if (sleepTimeObjectForPartTwo[id]) {
    // // lisätään uudet arvot
    for (let i = falltime; i < waketime; i++) {
      sleepTimeObjectForPartTwo[id][i] += 1;
    }
    
  } else {
    // sijoitetaan uudet arvot
    const minutes = Array(60).fill(0);
    for (let i = falltime; i < waketime; i++) {
      minutes[i] = 1;
    }
    sleepTimeObjectForPartTwo[id] = minutes;
  }
}

// hakee
const getSleepyGuardID = (sleepTimes) => {
  let sleepyID = null;
  let maxSleep = 0;
  for (let key in sleepTimes) {
    if (sleepTimes[key].sleeptime > maxSleep) {
      maxSleep = sleepTimes[key].sleeptime;
      sleepyID = key;
    }
  }
  console.log(sleepyID)
  return sleepyID;
}
