# PathFinder
A React Application that visualizes and demonstrates different Pathfinding Algorithms.

#### [Live Preview](http://pathfinder.jamesdenbow.com) - Check out the Live Online Preview

## About

### Algorithms
* **Dijkstra's Algorithm** (weighted) - Developed in the 1950s, and considered to be the original pathfinding algorithm, Dijkstra's guarantees the shortest path by finding the sum of each individual paths on the way from the source node to the end node.
* __A* Search Algorithm__ (weighted) - A informed search algorithm, meaning it searches with knowledge of the location of the ending node, the A* Search guarantees the shortest path by using heuristics to target the ending node.

### Features
* **Draw Walls** - by clicking and dragging across the grid you are able to draw walls to create barriers and obstacles for the pathfinder to navigate. Clicking / dragging over a wall will remove a placed wall.
* **Move Nodes** - by clicking on the Start or End nodes and then dragging them you are able to move and place these nodes anywhere on the grid.
* **Generate Maze** - clicking the generate maze button will create a complex and random maze of walls for the pathfinder to navigate using a Recursive Division algorithm.
* **Clear Board** - clicking the clear board button will remove all walls and paths, as well as reseting the start and end nodes. 
* **Clear Path** - clicking the clear path button will remove the generated path but leave the walls and position of nodes intact.

## Known Bugs
* If you drag the StartNode onto the same GridNode as the EndNode and clear the board both the StartNode and EndNode will be graphically shown as the StartNode till an action is taken to affect the EndNode. This is a purely graphical bug, with no effect on the operations of the application.

## License
MIT License

Copyright (c) 2020 James Denbow

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWAR
