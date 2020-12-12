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
    };
  }

  componentDidMount() {
    const grid = getInitialGrid();
    this.setState({grid});
  }

  handleMouseDown(row, col) {
    const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
    this.setState({grid: newGrid, mouseIsPressed: true});
  }

  handleMouseEnter(row, col) {
    if (!this.state.mouseIsPressed) return;
    const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
    this.setState({grid: newGrid});
  }

  handleMouseUp() {
    this.setState({mouseIsPressed: false});
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
    }, 50 * x);
  }

  visualizeDijkstra() {
    const {grid} = this.state;
    const startNode = grid[START_NODE_ROW][START_NODE_COL];
    const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
    const visitedNodesInOrder = dijkstra(grid, startNode, finishNode);
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
    this.animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder);
  }

  clearBoard() {
    const grid2 = getInitialGrid();
    this.setState({grid: grid2});
    const {grid} = this.state;
    const len = grid.length;
    const len2 = grid[0].length;
    for (var i = 0; i < len; i++) {
      for (var x = 0; x < len2; x++) {
        if (i == START_NODE_ROW && x == START_NODE_COL) {
          document.getElementById(`node-${i}-${x}`).className =
            'node node-start';
        }
        else if (i == FINISH_NODE_ROW && x == FINISH_NODE_COL) {
          document.getElementById(`node-${i}-${x}`).className =
            'node node-finish';
        }
        else {
          document.getElementById(`node-${i}-${x}`).className =
            'node';
        }
      }
    }
  }

  render() {
    const {grid, mouseIsPressed} = this.state;

    return (
      <>
        <div className="topMenu">
          <a href="#" className="vertical-center title"><h1><b>PathFinder</b></h1></a>
          <span className="vertical-center nav">
            <a href="#" className="navItem">Algorithms <span className="caretDown">▼</span></a>
            <a href="#" className="navItem">Generate Maze</a>
            <a onClick={() => this.clearBoard()} className="navItem">Clear Board</a>
          </span>
          <button className="visButton vertical-center" onClick={() => this.visualizeDijkstra()}>
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
