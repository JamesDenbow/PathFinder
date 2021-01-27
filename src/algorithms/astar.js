export function astar(grid, startNode, finishNode) {
  const visitedNodes = [];
  const nodeList = getAllNodes(grid);
  const closedList = [];
  //If start and finish are equal return
  if (startNode === finishNode) {
    return visitedNodes;
  }
  const openList = [];
  startNode.f = 0;
  openList.push(startNode);
  visitedNodes.push(startNode);
  var foundDest = false;

  while (openList.length > 0) {
    sortNodesByDistance(openList);
    const currentNode = openList.shift();
    closedList.push(currentNode);
    const succN = nodeSearch(nodeList, (currentNode.col - 1), currentNode.row)
    const succS = nodeSearch(nodeList, (currentNode.col + 1), currentNode.row)
    const succE = nodeSearch(nodeList, currentNode.col, (currentNode.row + 1))
    const succW = nodeSearch(nodeList, currentNode.col, (currentNode.row - 1))
    succN.parent = currentNode;
    succS.parent = currentNode;
    succW.parent = currentNode;
    succE.parent = currentNode;
    var gNew;
    var hNew;
    var fNew;
    if (!!succN) {
      if (succN === finishNode) {
        finishNode.parent = currentNode;
        foundDest = true;
        visitedNodes.push(finishNode);
        return visitedNodes;
      }
      else if (succN.isWall === false) {
        visitedNodes.push(succN);
        if (succN.g) {
          gNew = succN.g + 1;
        }
        else {
          gNew = 1;
        }
        var gx = finishNode.col;
        var gy = finishNode.row;
        var x = succN.col;
        var y = succN.row;
        hNew = Math.abs(x - gx) + Math.abs(y - gy);
        fNew = gNew + hNew;
        if (listSearch(openList, succN)) {
          if (fNew < succN.f) {
            for (var i = 0; i < openList.length; i++) {
              if (openList[i] === succN) {
                openList.splice(i, 1);
              }
            }
          }
        }
        succN.f = fNew;
        succN.g = gNew;
        succN.h = hNew;
        openList.push(succN);
      }
    }
    if (!!succS) {
      if (succS === finishNode) {
        finishNode.parent = currentNode;
        foundDest = true;
        visitedNodes.push(finishNode);
        return visitedNodes;
      }
      else if (succS.isWall === false) {
        visitedNodes.push(succS);
        if (succS.g) {
          gNew = succS.g + 1;
        }
        else {
          gNew = 1;
        }
        var gx = finishNode.col;
        var gy = finishNode.row;
        var x = succS.col;
        var y = succS.row;
        hNew = Math.abs(x - gx) + Math.abs(y - gy);
        fNew = gNew + hNew;
        if (listSearch(openList, succS)) {
          if (fNew < succS.f) {
            for (var i = 0; i < openList.length; i++) {
              if (openList[i] === succS) {
                openList.splice(i, 1);
              }
            }
          }
        }
        succS.f = fNew;
        succS.g = gNew;
        succS.h = hNew;
        openList.push(succS);
      }
    }
    if (!!succE) {
      if (succE === finishNode) {
        finishNode.parent = currentNode;
        foundDest = true;
        visitedNodes.push(finishNode);
        return visitedNodes;
      }
      else if (succE.isWall === false) {
        visitedNodes.push(succE);
        if (succE.g) {
          gNew = succE.g + 1;
        }
        else {
          gNew = 1;
        }
        var gx = finishNode.col;
        var gy = finishNode.row;
        var x = succE.col;
        var y = succE.row;
        hNew = Math.abs(x - gx) + Math.abs(y - gy);
        fNew = gNew + hNew;
        if (listSearch(openList, succE)) {
          if (fNew < succE.f) {
            for (var i = 0; i < openList.length; i++) {
              if (openList[i] === succE) {
                openList.splice(i, 1);
              }
            }
          }
        }
        succE.f = fNew;
        succE.g = gNew;
        succE.h = hNew;
        openList.push(succE);
      }
    }
    if (!!succW) {
      if (succW === finishNode) {
        finishNode.parent = currentNode;
        foundDest = true;
        visitedNodes.push(finishNode);
        return visitedNodes;
      }
      else if (succW.isWall === false) {
        visitedNodes.push(succW);
        if (succW.g) {
          gNew = succW.g + 1;
        }
        else {
          gNew = 1;
        }
        var gx = finishNode.col;
        var gy = finishNode.row;
        var x = succW.col;
        var y = succW.row;
        hNew = Math.abs(x - gx) + Math.abs(y - gy);
        fNew = gNew + hNew;
        if (listSearch(openList, succW)) {
          if (fNew < succW.f) {
            for (var i = 0; i < openList.length; i++) {
              if (openList[i] === succW) {
                openList.splice(i, 1);
              }
            }
          }
        }
        succW.f = fNew;
        succW.g = gNew;
        succW.h = hNew;
        openList.push(succW);
      }
    }



  }
  if (!foundDest) {
    return visitedNodes; //failed
  }
  else {
    visitedNodes.push(finishNode);
    return visitedNodes;
  }
}

function sortNodesByDistance(unvisitedNodes) {
  unvisitedNodes.sort((nodeA, nodeB) => nodeA.f - nodeB.f);
}

function nodeSearch(nodeList, col, row) {
  for (var i = 0; i < nodeList.length; i++) {
    if (nodeList[i].col === col && nodeList[i].row === row) {
      return nodeList[i];
    }
  }
  return;
}

function getAllNodes(grid) {
  const nodes = [];
  for (const row of grid) {
    for (const node of row) {
      node.parent = '';
      nodes.push(node);
    }
  }
  return nodes;
}

function listSearch(list, node) {
  for (var i = 0; i < list.length; i++) {
    if (list[i].col === node.col && list[i].row === node.row) {
      return true;
    }
  }
  return false;
}


// Backtracks from the finishNode to find the shortest path.
export function getNodesInShortestPathOrderAstar(finishNode) {
  const nodesInShortestPathOrder = [];
  let currentNode = finishNode;
  var i = 0;
  while (currentNode !== null && i < 20) {
    console.log(currentNode);
    nodesInShortestPathOrder.unshift(currentNode);
    currentNode = currentNode.parent;
    i++;
  }
  return nodesInShortestPathOrder;
}
