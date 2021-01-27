import React, {Component} from 'react';
import Node from './Node/Node';
import {dijkstra, getNodesInShortestPathOrderDijkstra} from '../algorithms/dijkstra';
import {astar, getNodesInShortestPathOrderAstar} from '../algorithms/astar';

import './PathfindingVisualizer.css';

const START_NODE_ROW = 10;
const START_NODE_COL = 15;
const FINISH_NODE_ROW = 10;
const FINISH_NODE_COL = 35;

export default class PathfindingVisualizer extends Component {
  constructor() {
    super();
    this.state = {
      grid: [],
      mouseIsPressed: false,
      moveStart: false,
      moveFinish: false,
      startNodeCol: START_NODE_COL,
      startNodeRow: START_NODE_ROW,
      finishNodeCol: FINISH_NODE_COL,
      finishNodeRow: FINISH_NODE_ROW,
      working: false,
    };
  }

  componentDidMount() {
    const grid = getInitialGrid();
    this.setState({grid});
    window.onclick = function(event) {
      if (!event.target.matches('#dropbtn')) {
        document.getElementById("dropdown").className = 'dropdown-content hide';
        document.getElementById("dropbtn").className = 'navItem';
      }
    }
  }

  handleMouseDown(row, col) {
    if (this.state.working) return;
    const {startNodeCol} = this.state;
    const {startNodeRow} = this.state;
    const {finishNodeCol} = this.state;
    const {finishNodeRow} = this.state;
    if (row === startNodeRow && col === startNodeCol){
      this.setState({mouseIsPressed: true, moveStart: true});
    }
    else if (row === finishNodeRow && col === finishNodeCol) {
      this.setState({mouseIsPressed: true, moveFinish: true});
    }
    else {
      const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
      this.setState({grid: newGrid, mouseIsPressed: true});
    }
  }

  handleMouseEnter(row, col) {
    if (this.state.working) return;
    if (!this.state.mouseIsPressed) return;
    if (this.state.moveStart) {
      const {startNodeCol} = this.state;
      const {startNodeRow} = this.state;
      const newGrid2 = updateStart(this.state.grid, startNodeRow, startNodeCol);
      const newGrid = updateStart(newGrid2, row, col);
      this.setState({grid: newGrid, startNodeCol: col, startNodeRow: row});
    }
    else if (this.state.moveFinish){
      const {finishNodeCol} = this.state;
      const {finishNodeRow} = this.state;
      const newGrid2 = updateFinish(this.state.grid, finishNodeRow, finishNodeCol);
      const newGrid = updateFinish(newGrid2, row, col);
      this.setState({grid: newGrid, finishNodeCol: col, finishNodeRow: row});
    }
    else {
      const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
      this.setState({grid: newGrid});
    }
  }

  handleMouseUp() {
    this.setState({mouseIsPressed: false, moveStart: false, moveFinish: false});
  }

  animateSearch(visitedNodesInOrder, nodesInShortestPathOrder, algo) {
    const node2 = visitedNodesInOrder[0];
    document.getElementById(`node-${node2.row}-${node2.col}`).className =
      'node node-visited node-start';
    for (let i = 1; i <= visitedNodesInOrder.length; i++) {
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          this.animateShortestPath(nodesInShortestPathOrder, algo);
        }, 10 * i);
        return;
      }
      const node = visitedNodesInOrder[i];
      setTimeout(() => {
        if (i === (visitedNodesInOrder.length - 1)){
          document.getElementById(`node-${node.row}-${node.col}`).className =
            'node node-visited node-finish';
        }
        else {
          document.getElementById(`node-${node.row}-${node.col}`).className =
            'node node-visited';
        }
      }, 10 * i);
    }
  }

  animateShortestPath(nodesInShortestPathOrder, algo) {
    setTimeout(() => {
      const node = nodesInShortestPathOrder[0];
      document.getElementById(`node-${node.row}-${node.col}`).className =
        'node node-shortest-path node-start';
    }, 50 * 0);
    for (let i = 1; i < (nodesInShortestPathOrder.length - 1); i++) {
      setTimeout(() => {
        const node = nodesInShortestPathOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          'node node-shortest-path';
      }, 50 * i);
    }
    const x = nodesInShortestPathOrder.length - 1;
    setTimeout(() => {
      const node = nodesInShortestPathOrder[x];
      document.getElementById(`node-${node.row}-${node.col}`).className =
        'node node-shortest-path node-finish';
      document.getElementById(`navGenMaze`).className = 'navItem';
      document.getElementById(`navClear`).className = 'navItem';
      document.getElementById(`navClearP`).className = 'navItem';
      if (algo === 1) {
        document.getElementById(`navPathDijkstra`).className = 'visButton vertical-center';
      }
      else if (algo === 2) {
        document.getElementById(`navPathASearch`).className = 'visButton vertical-center';
      }
    }, 50 * x);
  }

  visualizeDijkstra() {
    document.getElementById(`navGenMaze`).className = 'navItem disabled';
    document.getElementById(`navClear`).className = 'navItem disabled';
    document.getElementById(`navClearP`).className = 'navItem disabled';
    document.getElementById(`navPathDijkstra`).className = 'visButton vertical-center disabled';
    this.clearPath();
    this.setState({working: true});
    const {grid} = this.state;
    const {startNodeCol} = this.state;
    const {startNodeRow} = this.state;
    const {finishNodeCol} = this.state;
    const {finishNodeRow} = this.state;
    const newGrid = removeWall(grid, startNodeRow, startNodeCol);
    const newGrid2 = removeWall(newGrid, finishNodeRow, finishNodeCol);
    this.setState({grid: newGrid2});
    const startNode = newGrid2[startNodeRow][startNodeCol];
    const finishNode = newGrid2[finishNodeRow][finishNodeCol];
    const visitedNodesInOrder = dijkstra(newGrid2, startNode, finishNode);
    const nodesInShortestPathOrder = getNodesInShortestPathOrderDijkstra(finishNode);
    this.animateSearch(visitedNodesInOrder, nodesInShortestPathOrder, 1);
  }

  visualizeASearch() {
    document.getElementById(`navGenMaze`).className = 'navItem disabled';
    document.getElementById(`navClear`).className = 'navItem disabled';
    document.getElementById(`navClearP`).className = 'navItem disabled';
    document.getElementById(`navPathASearch`).className = 'visButton vertical-center disabled';
    this.clearPath();
    this.setState({working: true});
    const {grid} = this.state;
    const {startNodeCol} = this.state;
    const {startNodeRow} = this.state;
    const {finishNodeCol} = this.state;
    const {finishNodeRow} = this.state;
    const newGrid = removeWall(grid, startNodeRow, startNodeCol);
    const newGrid2 = removeWall(newGrid, finishNodeRow, finishNodeCol);
    this.setState({grid: newGrid2});
    const startNode = newGrid2[startNodeRow][startNodeCol];
    const finishNode = newGrid2[finishNodeRow][finishNodeCol];
    const visitedNodesInOrder = astar(newGrid2, startNode, finishNode);
    const nodesInShortestPathOrder = getNodesInShortestPathOrderAstar(finishNode);
    this.animateSearch(visitedNodesInOrder, nodesInShortestPathOrder, 2);
  }

  clearBoard() {
    const grid2 = getInitialGrid();
    this.setState({grid: grid2, startNodeCol: START_NODE_COL, startNodeRow: START_NODE_ROW, finishNodeRow: FINISH_NODE_ROW, finishNodeCol: FINISH_NODE_COL});
    const {grid} = this.state;
    const len = grid.length;
    const len2 = grid[0].length;
    for (var i = 0; i < len; i++) {
      for (var x = 0; x < len2; x++) {
        if (x === this.state.startNodeCol && i === this.state.startNodeRow) {
          document.getElementById(`node-${i}-${x}`).className = "node node-start";
        }
        else if (x === this.state.finishNodeCol && i === this.state.finishNodeRow) {
          document.getElementById(`node-${i}-${x}`).className = "node node-finish";
        }
        else {
          document.getElementById(`node-${i}-${x}`).className = "node";
        }
      }
    }
    document.getElementById(`navGenMaze`).className = 'navItem';
    this.setState({working: false});
  }

  clearPath(){
    const {grid} = this.state;
    const len = grid.length;
    const len2 = grid[0].length;
    for (var i = 0; i < len; i++) {
      for (var x = 0; x < len2; x++) {
        if (x === this.state.startNodeCol && i === this.state.startNodeRow) {
          document.getElementById(`node-${i}-${x}`).className = "node node-start";
        }
        else if (x === this.state.finishNodeCol && i === this.state.finishNodeRow) {
          document.getElementById(`node-${i}-${x}`).className = "node node-finish";
        }
        else {
          if(grid[i][x].isWall === false){
            document.getElementById(`node-${i}-${x}`).className = "node";
          }
          else {
            document.getElementById(`node-${i}-${x}`).className = "node node-wall";
          }
        }
      }
    }
  }

  genMaze_orientation(width, height) {
    if (width < height) {
      return 'h';
    }
    else if (height < width) {
      return 'v';
    }
    else {
      var rand = Math.random();
      if (rand < 0.5){
        return 'h';
      }
      else {
        return 'v';
      }
    }
  }

  randomIntRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  genMaze_divide(grid, x, y, x2, y2, ori) {
    if (ori === 'h' ){
      if ((x2 - x) < 2) {
        return grid;
      }
      else {
        var difY = Math.floor(this.randomIntRange(y, y2) / 2) * 2;
        var hole = Math.floor(this.randomIntRange(x, x2) / 2) * 2 + 1;
        for (var i = x; i <= x2; i++){
          if (i !== hole) {
            grid = getNewGridWithWallToggled(grid, difY, i);
          }
        }
        grid = this.genMaze_divide(grid, x, y, x2, (difY - 1), this.genMaze_orientation((x2 - x), ((difY - 1) - y)));
        grid = this.genMaze_divide(grid, x, (difY + 1), x2, y2, this.genMaze_orientation((x2 - x), (y2 - (difY + 1))));
      }
    }
    else {
      if ((y2 - y) < 2) {
        return grid;
      }
      else {
        var difX = Math.floor(this.randomIntRange(x, x2) / 2) * 2;
        var hole = Math.floor(this.randomIntRange(y, y2) / 2) * 2 + 1;
        for (var i = y; i <= y2; i++){
          if (i !== hole) {
            grid = getNewGridWithWallToggled(grid, i, difX);
          }
        }
        grid = this.genMaze_divide(grid, x, y, (difX - 1), y2, this.genMaze_orientation(((difX - 1) - x), (y2 - y)));
        grid = this.genMaze_divide(grid, (difX + 1), y, x2, y2, this.genMaze_orientation((x2 - (difX + 1)), (y2 - y)));
      }
    }
    return grid;
  }

  generateMaze() {
    document.getElementById(`navGenMaze`).className = 'navItem disabled';
    document.getElementById(`navClear`).className = 'navItem disabled';
    document.getElementById(`navClearP`).className = 'navItem disabled';
    var {grid} = this.state;
    grid = this.genMaze_divide(grid, 0, 0, 49, 19, this.genMaze_orientation(49, 19));
    this.setState({grid});
    document.getElementById(`navClear`).className = 'navItem';
    document.getElementById(`navClearP`).className = 'navItem';
  }

  selectAlgoDijkstra() {
    this.clearPath();
    document.getElementById("selectDijkstra").className = 'active disabled';
    document.getElementById("selectASearch").className = '';
    document.getElementById("descNo").className = 'description hide';
    document.getElementById("descDijkstra").className = 'description show';
    document.getElementById("descASearch").className = 'description hide';
    document.getElementById("navPathNo").className = 'visButton vertical-center disabled hide';
    document.getElementById("navPathDijkstra").className = 'visButton vertical-center';
    document.getElementById("navPathASearch").className = 'visButton vertical-center hide';
  }

  selectAlgoASearch() {
    this.clearPath();
    document.getElementById("selectDijkstra").className = '';
    document.getElementById("selectASearch").className = 'active disabled';
    document.getElementById("descNo").className = 'description hide';
    document.getElementById("descDijkstra").className = 'description hide';
    document.getElementById("descASearch").className = 'description show';
    document.getElementById("navPathNo").className = 'visButton vertical-center disabled hide';
    document.getElementById("navPathDijkstra").className = 'visButton vertical-center hide';
    document.getElementById("navPathASearch").className = 'visButton vertical-center';
  }

  dropdownToggle() {
    document.getElementById("dropbtn").className = 'navItem disabled';
    document.getElementById("dropdown").className = 'dropdown-content show';
  }

  render() {
    const {grid, mouseIsPressed} = this.state;

    return (
      <>
        <div className="topMenu">
          <a onClick={() => window.location.reload(false)} className="vertical-center title"><h1><b>PathFinder</b></h1></a>
          <span className="vertical-center nav">
            <a id="dropbtn" onClick={() => this.dropdownToggle()} href="#" className="navItem">Algorithms <span className="caretDown">▼</span></a>
            <a id="navGenMaze" onClick={() => this.generateMaze()} className="navItem">Generate Maze</a>
            <a id="navClear" onClick={() => this.clearBoard()} className="navItem">Clear Board</a>
            <a id="navClearP" onClick={() => this.clearPath()} className="navItem">Clear Path</a>
          </span>
          <button id="navPathNo" className="visButton vertical-center disabled">Find Path</button>
          <button id="navPathDijkstra" className="visButton vertical-center hide" onClick={() => this.visualizeDijkstra()}>Find Path</button>
          <button id="navPathASearch" className="visButton vertical-center hide" onClick={() => this.visualizeASearch()}>Find Path</button>
        </div>
        <div className="keyMenu">
          <span className="keyMenuItem"><span className="endNode">★</span> Start Node</span>
          <span className="keyMenuItem"><span className="endNode">⦿</span> End Node</span>
          <span className="keyMenuItem"><span className="nodeExample"></span> Unvisited Node</span>
          <span className="keyMenuItem"><span className="nodeExample2"></span> Visited Node</span>
          <span className="keyMenuItem"><span className="nodeExample3"></span> Path Node</span>
          <span className="keyMenuItem"><span className="nodeExample4"></span> Wall Node</span>
        </div>
        <div id="descNo" className="description">
          <b>Select an algorithm!</b>
        </div>
        <div id="descDijkstra" className="description hide">
          <b>Dijkstra Algorithm</b>: the original pathfinding algorithm - weighted - guarantees the shortest path
        </div>
        <div id="descASearch" className="description hide">
          <b>A* Search</b>: the best pathfinding algorithm - weighted - guarantees the shortest path
        </div>
        <div id="dropdown" className="dropdown-content hide">
          <ul>
            <a id="selectDijkstra" href="#" onClick={() => this.selectAlgoDijkstra()}>Dijkstra</a>
            <a id="selectASearch" href="#" onClick={() => this.selectAlgoASearch()}>A* Search</a>
          </ul>
        </div>
        <div className="grid">
          {grid.map((row, rowIdx) => {
            return (
              <div key={rowIdx}>
                {row.map((node, nodeIdx) => {
                  const {row, col, isFinish, isStart, isWall} = node;
                  return (
                    <Node
                      key={nodeIdx}
                      col={col}
                      isFinish={isFinish}
                      isStart={isStart}
                      isWall={isWall}
                      mouseIsPressed={mouseIsPressed}
                      onMouseDown={(row, col) => this.handleMouseDown(row, col)}
                      onMouseEnter={(row, col) =>
                        this.handleMouseEnter(row, col)
                      }
                      onMouseUp={() => this.handleMouseUp()}
                      row={row}></Node>
                  );
                })}
              </div>
            );
          })}
        </div>
      </>
    );
  }
}

const getInitialGrid = () => {
  const grid = [];
  for (let row = 0; row < 20; row++) {
    const currentRow = [];
    for (let col = 0; col < 50; col++) {
      currentRow.push(createNode(col, row));
    }
    grid.push(currentRow);
  }
  return grid;
};

const createNode = (col, row) => {
  return {
    col,
    row,
    isStart: row === START_NODE_ROW && col === START_NODE_COL,
    isFinish: row === FINISH_NODE_ROW && col === FINISH_NODE_COL,
    distance: Infinity,
    isVisited: false,
    isWall: false,
    previousNode: null,
  };
};

const getNewGridWithWallToggled = (grid, row, col) => {
  const newGrid = grid.slice();
  const node = newGrid[row][col];
  const newNode = {
    ...node,
    isWall: !node.isWall,
  };
  newGrid[row][col] = newNode;
  return newGrid;
};

const updateStart = (grid, row, col) => {
  const newGrid = grid.slice();
  const node = newGrid[row][col];
  const newNode = {
    ...node,
    isStart: !node.isStart,
  };
  newGrid[row][col] = newNode;
  return newGrid;
};

const updateFinish = (grid, row, col) => {
  const newGrid = grid.slice();
  const node = newGrid[row][col];
  const newNode = {
    ...node,
    isFinish: !node.isFinish,
  };
  newGrid[row][col] = newNode;
  return newGrid;
};

const removeWall = (grid, row, col) => {
  const newGrid = grid.slice();
  const node = newGrid[row][col];
  const newNode = {
    ...node,
    isWall: false,
  };
  newGrid[row][col] = newNode;
  return newGrid;
}
