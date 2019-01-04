const fs = require('fs')

fs.readFile('./data7.txt', "utf8", (err, data) => {
  if (err) throw err;

  let inputToArray = data.split('\r\n').map(row => row.charAt(5) + row.charAt(36));
  const myGraph = new Graph();
  myGraph.fillTheGraph(inputToArray)
  // console.log(myGraph.nodeList);   // console.log(myGraph);
  // orphans has no parent --> valid starting points
  const orphans = myGraph.findOrphans(); 
  const order = myGraph.findRoute(orphans);
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
  hasParent() {
    if (Object.keys(this.parent).length === 0) {
      return false;
    }
    return true;
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
          this.processNode(queue, orderList, indexNoParent);
          break;
        } else {
          indexNoParent--; // yritetään seuraavaa
        }
      }
    }
    return orderList;
  }

  processNode(queue, orderList, indexNoParent) { // process instruction and add to orderList
    const parent = queue[indexNoParent];
    const childNodes = Object.keys(parent.children); // get all children (keys) of parent in question
    const tempChildren = [];
    for (let key of childNodes) {   // loop children
      parent.children[key].removeParent(parent); // remove child's parent 
      tempChildren.push(parent.children[key]);
    }
    // remove parent from process queue // virhe: pitäis poistaa jossakin tapauksessa jokin muu?
    queue.splice(indexNoParent, 1);
    // loop children
    for (let i = 0; i < tempChildren.length; i++) { 
      // push child to queue if not already there or not already in orderList (should not be possible)
      let toBePushed = true;
      for (let j = 0; j < queue.length; j++) { // queue check
        if (tempChildren[i].value === queue[j].value) {
          toBePushed = false; // already in queue
        } 
      } 
      if (toBePushed) {
        queue.push(tempChildren[i]); 
      }
    }
    return queue;
  }

  sortNodes(queue) { // sort descending 
    queue.sort(function(a,b) {
      if (a.value.charCodeAt(0) < b.value.charCodeAt(0)) {
        return 1;
      } else {
        return -1;
      }
    });
  }
} 