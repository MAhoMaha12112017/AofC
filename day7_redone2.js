// Advent Of Code - Day7, Part2. Finnish comments below, elsewhere in english
    // 2 (ainakin) taulua: t1: vapaat työt (aluksi orphans), t2: työn alle otetut työt
    // otetaan min(orphans,workers - sorttaus?) työn alle (taulukkoon) 
    // käyt. muista työn alla olevista
    // prosessoidaan valmiiksi tulluttsekataan minimiaika, jonka mukaan seuraava vaihe (looppi)
    // vähennetään minimiaika kaikista, 
    // - lisätään aika kok.aikaan eli lopputulokseen
    // - lisätään tehtyjen listaan (jos ei jo aiemmin) kirjain - ei tarvita?
    // - lapsilta parentti pois
    // - poistetaan node inprocess-taulusta
    // - lisätään lapset (jos ei parenttia) listaan, josta voi ottaa tehtäviä (t1)

const fs = require('fs')

fs.readFile('./data7.txt', "utf8", (err, data) => {
  if (err) throw err;

  let inputToArray = data.split('\r\n').map(row => row.charAt(5) + row.charAt(36));
  const myGraph = new Graph();
  myGraph.fillTheGraph(inputToArray)
  // console.log(myGraph.nodeList); 
  // orphans has no parent --> valid starting points
  const orphans = myGraph.findOrphans(); 
  // PART2
  const orderPart2 = myGraph.findRouteWithWorkers(orphans, 5);
  console.log(orderPart2);
  // PART 1
  // const order = myGraph.findRoute(orphans);
  // let orderString = '';
  // for(let r = 0; r < order.length; r++) { // reduce..
  //   orderString += order[r].value;
  // }
  // console.log(orderString);
});

class Node {
  constructor(value) {
    this.value = value;
    this.parent = {};
    this.children = {};
    this.weight = value.charCodeAt(0) - 4; // 64+60
  }
  addChild(node) { 
    this.children[node.value] = node;
  } 
  addParent(node) { 
    this.parent[node.value] = node;
  } 
  removeChild(node) { 
    delete this.children[node.value];
  } 
  removeParent(node) { 
    delete this.parent[node.value];
  }
  hasParent() {
    if (Object.keys(this.parent).length === 0) {
      return false;
    }
    return true;
  }
  reduceWeight(amount) {
    this.weight -= amount;
  }
}

class Graph { // instruction graph with parent<-->child data 
  constructor() { 
    this.numberOfNodes = 0;
    this.nodeList = {
    }; 
  } 
  addVertex(node)  { 
    this.nodeList[node.value] = node;   // assumption: existence checked elsewhere
    this.numberOfNodes++;
  } 
  
  addChildAndParent(parent, child) {
    parent.addChild(child);
    child.addParent(parent);
  }
  removeVertex(node) {
    delete this.nodeList[node.value];
  }

  fillTheGraph(inputArray) { // fill the graph with all the ordered instructions in array
    for (let i = 0; i < inputArray.length; i++) {
      this.addInstruction(inputArray[i].charAt(0),inputArray[i].charAt(1));
    }
  }
  addInstruction(value1, value2) { // adds instruction as parent<-->children. If no parent/children lets create.
    let parent = this.nodeList[value1];
    let child = this.nodeList[value2]
    if (!parent) {
      parent = new Node(value1);
      this.addVertex(parent);
    }
    if (!child) {
      child = new Node(value2);
      this.addVertex(child);
    }
    this.addChildAndParent(parent, child)
  }

  findOrphans() {
    const orphans = [];
    const allNodes = Object.keys(this.nodeList);  
    for (let node of allNodes) { 
      if (!this.nodeList[node].hasParent()) {
        orphans.push(this.nodeList[node]);
      }
    }
    return orphans;
  }

  // PART1
  findRoute(orphans) {
    let queue = orphans;
    let orderList = [];
    while (queue.length) {
      if (queue.length > 1) {
        this.sortNodes(queue); // sort desc
      }
      // loop until queue/stack has one with no parent
      let indexNoParent = queue.length-1;
      while (true) {
        // if no parent, removal
        if (!queue[indexNoParent].hasParent()) {  
          // add to orderList
          orderList.push(queue[indexNoParent]);
          // remove as parent of children and put children to queue and save to orderList (of order)
          this.processNode(queue, queue, indexNoParent);
          break;
        } else {
          indexNoParent--; // yritetään seuraavaa
        }
      }
    }
    return orderList;
  }

  findRouteWithWorkers(orphans, workers) {
    let timeUsed = 0;
    const orphansInProcess = [];
    debugger;
    while (true) {
      if (orphans.length > 1) {
        this.sortNodes(orphans); // sort desc - tarviiko sortata?
      }
      // take amount of min(orphans,workers) to be processed
      while (orphansInProcess.length < workers && orphans.length > 0) {
        orphansInProcess.push(orphans.pop());
      } 
      // work process minTime (till at least one finished)
      let minTime = getMinWeight(orphansInProcess);
      timeUsed += minTime;
      reduceWeights(orphansInProcess, minTime);
      // in case of task completed, process node (and it's children)
      for (let i = 0; i < orphansInProcess.length; i++) {
        if (orphansInProcess[i].weight === 0) { 
          // routeUsed += orphansInProcess[i].value;
          this.processNode(orphansInProcess, orphans, i)
        }
      }
      if (orphans.length === 0 && orphansInProcess.length === 0) { 
        // done, return the results;
        // console.log('routeUsed', routeUsed);
        return timeUsed;
      }
    }
  }

  processNode(queue, queueToPush, indexNoParent) { // process instruction, add to orderList
    const parent = queue[indexNoParent];
    const childNodes = Object.keys(parent.children); // get all children (keys) of parent in question
    const tempChildren = [];
    debugger;
    for (let key of childNodes) {   // loop children
      parent.children[key].removeParent(parent); // remove child's parent 
      // only in case if child has no (other) parent should be added to array to be processed next round
      if (!parent.children[key].hasParent()) {
        tempChildren.push(parent.children[key]);
      }
    }
    // remove parent from process queue // virhe: pitäis poistaa jossakin tapauksessa jokin muu?
    queue.splice(indexNoParent, 1);
    // loop children and push child to queue if not already there 
    this.pushToQueueIfNotAlready (tempChildren, queue, queueToPush) ;
    return queue;
  }

  pushToQueueIfNotAlready(tempChildren, queue, queueToPush) {
    
    for (let i = 0; i < tempChildren.length; i++) { 
      // push child to queue if not already there
      let toBePushed = true;
      for (let j = 0; j < queueToPush.length; j++) { // queue check
        if (tempChildren[i].value === queueToPush[j].value) { 
          toBePushed = false; // already in queue 
          break;
        } 
      } 
      if (toBePushed) {
        queueToPush.push(tempChildren[i]); 
      }
    }
  }

  sortNodes(queue) { // descending 
    queue.sort(function(a,b) {
      if (a.value.charCodeAt(0) < b.value.charCodeAt(0)) {
        return 1;
      } else {
        return -1;
      }
    });
  }
} 

const getMinWeight = (queue) => {
  let minWeight = queue[0].weight;
  for (let i = 0; i < queue.length; i++) {
    if (queue[i].weight < minWeight) {
      minWeight =  queue[i].weight;
    }
  }
  return minWeight;
}

const reduceWeights = (queue, amount) => {
  for (let i = 0; i < queue.length; i++) {
    queue[i].reduceWeight(amount);
  }
}

