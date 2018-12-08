// Spaghetti code. Part one ready and working.
// Did not get part2 ready. Have to code again, everything.
// Should be restructured
// What I learned:
// - brake code to smaller methods/functions
// - try to maintain clear structure, make clear comments while coding
// - if there is a change/misunderstanding --> check everything again with time and peace!!!
// - do not rush, if not much time!!!
// - take a break when need to


const fs = require('fs')

fs.readFile('./data7.txt', "utf8", (err, data) => {
  if (err) throw err;

  let inputToArray = data.split('\r\n').map(row => row.charAt(5) + row.charAt(36));
  // console.log(inputToArray);
  const myGraph = new Graph();
  myGraph.fillTheGraph(inputToArray)
  // console.log(myGraph.nodeList);
  // console.log(myGraph);
  const firstOnes = myGraph.findTheFirstOnes();
  console.log('firstOnes ', firstOnes);
  // // aloitetaan firstOnesta
  const order = myGraph.findRoute(firstOnes);
  let orderString = '';
  for(let r = 0; r < order.length; r++) { // reduce..
    orderString += order[r].value;
  }
  console.log(orderString);
});

class Node {
  constructor(value) {
    this.value = value;
    this.parent = {};
    this.children = {};
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
}

class Graph { 
  constructor() { 
    this.numberOfNodes = 0;
    this.nodeList = {
    }; 
  } 
  addVertex(node)  { 
    this.nodeList[node.value] = node;
    this.numberOfNodes++;
  } 
  
  addChildParent(parent, child) {
    if (!this.nodeList[parent.value]) {
      this.addVertex(parent);
    }
    if (!this.nodeList[child.value]) {
      this.addVertex(child);
    } 
    parent.addChild(child);
    child.addParent(parent);
  }

  fillTheGraph(inputArray) {
    for (let i = 0; i < inputArray.length; i++) {
      this.addInstruction(inputArray[i].charAt(0),inputArray[i].charAt(1));
    }
  }
  addInstruction(value1, value2) {
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
    this.addChildParent(parent, child)
  }

  findTheFirstOnes() {
    const firstOnes = [];
    const allNodes = Object.keys(this.nodeList);  
    for (let node of allNodes) { 
      if (!this.hasParent(this.nodeList[node])) {
        firstOnes.push(this.nodeList[node]);
      }
    }
    return firstOnes;
  }
  
  findRoute(firstOnes) {
    let queue = firstOnes;
    let list = [];
    while (queue.length > 0) {
      // console.log('while,queue.length ', queue.length)
      if (queue.length > 1) {
        this.sortNodes(queue);
        // console.log('queue:: ', queue)
      }
      // console.log('uloimmassa whilessä sortattu queue ', queue)
      // luupataan kunnes jonosta löytyy semmoinen, jolla ei ole parentia
      let toBeRemoved = queue.length-1;
      while (true) {
        // console.log('toBeRemoved ', toBeRemoved)
        // console.log('queue[toBeRemoved]] ' , queue[toBeRemoved]);
        // jos aakkosissa ekalla ei ole parentia, poistetaan oheistoimineen
        if (!this.hasParent(queue[toBeRemoved])) {
          // console.log('voidaanpoistaa', queue[toBeRemoved].value);
          // lisätään listaan
          list.push(queue[toBeRemoved]);
          // console.log('lisätty listaan ', queue[toBeRemoved])
          // poistetaan lapsilta ko. parent ja // laitetaan lapset queen
          this.editChildrenRemoveParentAndEditQueue(queue[toBeRemoved], queue, list, toBeRemoved);
          break;
        } else {
          toBeRemoved--; // yritetään seuraavaa
        }
      }
    }
    console.log('list: ', list);
    return list;
  }
  sortNodes(queue) {
    queue.sort(function(a,b) {
      if (a.value.charCodeAt(0) < b.value.charCodeAt(0)) {
        return 1;
      } else {
        return -1;
      }
    });
  }


  editChildrenRemoveParentAndEditQueue(node, queue, list, toBeRemoved) {
    // console.log('queue::: ', queue)
    const allNodes = Object.keys(node.children); 
    const tempChildren = [];
    for (let key of allNodes) { 
      node.children[key].removeParent(node);
      tempChildren.push(node.children[key]);
    }
    // remove parent from queue // virhe: pitäis poistaa jossakin tapauksessa jokin muu
    queue.splice(toBeRemoved, 1);
    for (let i = 0; i < tempChildren.length; i++) {
      // push to queue if not already there // not working
      // or not already in list
      let toBePushed = true;
      for (let j = 0; j < queue.length; j++) { // queue check
        // console.log(' tempChildren[i] ',tempChildren[i])
        // console.log('tempChildren[i].value ', tempChildren[i].value);
        // console.log('queue[j].value ', queue[j].value);
        if (tempChildren[i].value === queue[j].value) {
          toBePushed = false; // already in queue
        } 
      } 
      for (let k = 0; k < list.length; k++) { // list check
        // console.log(' tempChildren[i] ',tempChildren[i])
        // console.log('tempChildren[i].value ', tempChildren[i].value);
        // console.log('list[k].value ', list[k].value);
        if (tempChildren[i].value === list[k].value) {
          toBePushed = false; // already in queue
        } 
      } 
      if (toBePushed) {
        queue.push(tempChildren[i]); // jos täällä asti voi pushata
        // console.log('XXXXXXXXXXxx voi pushata tempChildren[i]', tempChildren[i].value);
      }
    }
    return queue;
  }

  hasParent(node) {
    if (Object.keys(node.parent).length === 0) {
      return false;
    }
    return true;
  }

} 