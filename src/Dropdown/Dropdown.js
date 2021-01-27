import React, {Component} from 'react';

import './Dropdown.css';

export default class Dropdown extends Component {
  constructor() {
    super();
    this.state = {
      show: true,
    };
  }

  dropdownToggle() {
    document.getElementById("dropbtn").className = 'navItem disabled';
    document.getElementById("dropdown").className = 'dropdown-content show';
  }

  render() {
    if (this.state.show === false) {
      return null;
    }
    return (
      <div id="dropdown" className="dropdown-content">
        <ul>
          <a id="selectDijkstra" href="#" onClick={() => this.selectAlgoDijkstra()}>Dijkstra</a>
          <a id="selectASearch" href="#" onClick={() => this.selectAlgoASearch()}>A* Search</a>
          <a id="selectGreedy" href="#" onClick={() => this.selectAlgoGreedy()}>Breath-First Search</a>
          <a id="selectGreedy2" href="#" onClick={() => this.selectAlgoGreedy2()}>Depth-First Search</a>
        </ul>
      </div>
    );
  }
}
