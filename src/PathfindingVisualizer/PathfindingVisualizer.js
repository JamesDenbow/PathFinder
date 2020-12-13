import React, {Component} from 'react';
import Node from './Node/Node';
import {dijkstra, getNodesInShortestPathOrder} from '../algorithms/dijkstra';

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
  }

  handleMouseDown(row, col) {
    if (this.state.working) return;
    const {startNodeCol} = this.state;
    const {startNodeRow} = this.state;
    const {finishNodeCol} = this.state;
    const {finishNodeRow} = this.state;
    if (row == startNodeRow && col == startNodeCol){
      this.setState({mouseIsPressed: true, moveStart: true});
    }
    else if (row == finishNodeRow && col == finishNodeCol) {
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

  animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder) {
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          this.animateShortestPath(nodesInShortestPathOrder);
        }, 10 * i);
        return;
      }
      const node = visitedNodesInOrder[i];
      setTimeout(() => {
        document.getElementById(`node-${node.row}-${node.col}`).className =
          'node node-visited';
      }, 10 * i);
    }
  }

  animateShortestPath(nodesInShortestPathOrder) {
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
    }, 50 * x);
  }

  visualizeDijkstra() {
    document.getElementById(`navGenMaze`).className = 'navItem disabled';
    document.getElementById(`navClear`).className = 'navItem disabled';
    document.getElementById(`navPath`).className = 'visButton vertical-center disabled';
    this.setState({working: true});
    const {grid} = this.state;
    const {startNodeCol} = this.state;
    const {startNodeRow} = this.state;
    const {finishNodeCol} = this.state;
    const {finishNodeRow} = this.state;
    const startNode = grid[startNodeRow][startNodeCol];
    const finishNode = grid[finishNodeRow][finishNodeCol];
    const visitedNodesInOrder = dijkstra(grid, startNode, finishNode);
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
    this.animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder);
  }

  clearBoard() {
    const grid2 = getInitialGrid();
    this.setState({grid: grid2, startNodeCol: START_NODE_COL, startNodeRow: START_NODE_ROW, finishNodeRow: FINISH_NODE_ROW, finishNodeCol: FINISH_NODE_COL});
    const {grid} = this.state;
    const len = grid.length;
    const len2 = grid[0].length;
    for (var i = 0; i < len; i++) {
      for (var x = 0; x < len2; x++) {
        if (x == this.state.startNodeCol && i == this.state.startNodeRow) {
          document.getElementById(`node-${i}-${x}`).className = "node node-start";
        }
        else if (x == this.state.finishNodeCol && i == this.state.finishNodeRow) {
          document.getElementById(`node-${i}-${x}`).className = "node node-finish";
        }
        else {
          document.getElementById(`node-${i}-${x}`).className = "node";
        }
      }
    }
    document.getElementById(`navGenMaze`).className = 'navItem';
    document.getElementById(`navPath`).className = 'visButton vertical-center';
    this.setState({working: false});
  }

  genMaze_orientation(width, height) {
    if (width < height) {
      return 0;
    }
    else if (height < width) {
      return 1;
    }
    else {
      var rand = Math.random();
      if (rand < 0.5){
        return 0;
      }
      else {
        return 1;
      }
    }
  }

  genMaze_divide(grid, x, y, width, height, ori) {
    console.log('loop');
    if (width < 2 || height < 2) {
      console.log('loop-endF');
      return grid;
    }
    else {
      //Find where the division will be made
      if (ori == 0) {
        var waly = y + Math.floor(Math.random() * (height - 2));
      }
      else {
        var walx = x + Math.floor(Math.random() * (width - 2));
      }
      //Find the passage within the division
      if (ori == 0) {
        var px = walx + Math.floor(Math.random() * width);
      }
      else {
        var py = waly + Math.floor(Math.random() * height);
      }
      //Direction wall will be drawn
      if (ori == 0) {
        var dx = 0;
      }
      else {
        var dy = 1;
      }
      //Draw wall
      const {startNodeCol} = this.state;
      const {startNodeRow} = this.state;
      const {finishNodeCol} = this.state;
      const {finishNodeRow} = this.state;
      while ((walx < width) && (waly < height)) {
        if (!(waly == startNodeCol && walx == startNodeRow) && !(waly == finishNodeCol && walx == finishNodeRow)) {
          if (walx != px || waly != py){
            grid = getNewGridWithWallToggled(grid, walx, waly);
            this.setState({grid});
          }
        }
        walx = walx + dx;
        waly = waly + dy;
      }

      //Determine subfields
      var nx = x;
      var ny = y;
      if (ori == 0) {
        var w = width;
        var h = waly - y + 1;
      }
      else {
        var w = walx - x + 1;
        var h = height;
      }
      console.log('loop1');
      grid = this.genMaze_divide(grid, nx, ny, w, h, this.genMaze_orientation(w, h));

      if (ori == 0) {
        var nx = walx + 1;
        var ny = y;
        var w = width;
        var h = y + height - waly - 1;
      }
      else {
        var nx = x;
        var ny = waly + 1;
        var w = x + width - walx - 1;
        var h = height;
      }
      console.log('loop2');
      grid = this.genMaze_divide(grid, nx, ny, w, h, this.genMaze_orientation(w, h));
      return grid;
      console.log('loopEnd');
    }
  }

  generateMaze() {
    document.getElementById(`navGenMaze`).className = 'navItem disabled';
    document.getElementById(`navClear`).className = 'navItem disabled';
    document.getElementById(`navPath`).className = 'visButton vertical-center disabled';
    var {grid} = this.state;
    grid = this.genMaze_divide(grid, 0, 0, 50, 20, this.genMaze_orientation(50, 20));
    this.setState({grid});
    document.getElementById(`navClear`).className = 'navItem';
    document.getElementById(`navPath`).className = 'visButton vertical-center';
  }

  render() {
    const {grid, mouseIsPressed} = this.state;

    return (
      <>
        <div className="topMenu">
          <a onClick={() => window.location.reload(false)} className="vertical-center title"><h1><b>PathFinder</b></h1></a>
          <span className="vertical-center nav">
            <a href="#" className="navItem">Algorithms <span className="caretDown">▼</span></a>
            <a id="navGenMaze" onClick={() => this.generateMaze()} className="navItem">Generate Maze</a>
            <a id="navClear" onClick={() => this.clearBoard()} className="navItem">Clear Board</a>
          </span>
          <button id="navPath" className="visButton vertical-center" onClick={() => this.visualizeDijkstra()}>
            Find Path
          </button>
        </div>
        <div className="keyMenu">
          <span className="keyMenuItem"><span className="endNode">★</span> Start Node</span>
          <span className="keyMenuItem"><span className="endNode">⦿</span> End Node</span>
          <span className="keyMenuItem"><span className="nodeExample"></span> Unvisited Node</span>
          <span className="keyMenuItem"><span className="nodeExample2"></span> Visited Node</span>
          <span className="keyMenuItem"><span className="nodeExample3"></span> Path Node</span>
          <span className="keyMenuItem"><span className="nodeExample4"></span> Wall Node</span>
        </div>
        <div className="description">
          <b>Dijkstra Algorithm</b>: the original pathfinding algorithm - weighted - guarantees the shortest path
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
