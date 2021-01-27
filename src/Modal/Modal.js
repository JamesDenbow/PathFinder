import React, {Component} from 'react';
import logo from '../tutorial.gif';

import './Modal.css';

export default class Modal extends Component {
  constructor() {
    super();
    this.state = {
      show: true,
      page: 1,
    };
  }

  setFn() {
    this.setState({show: false});
  }

  showModal () {
    document.getElementById(`modal`).className = "modal modAni";
    setTimeout(function() {this.setState({show: false})}.bind(this), 1000);
  }

  pageChange() {
    this.setState({page: 2});
  }

  render() {
    if (this.state.show === false) {
      return null;
    }
    if (this.state.page === 1){
      return (
        <div id="modal" className="modal">
          <div id="modpg1" className="modal-content">
            <h3>Welcome to</h3>
            <h1><b>PathFinder</b></h1>
            <p>This project was made by James Denbow</p>
            <a href="https://github.com/JamesDenbow/PathFinder" target="_blank" className="tutButton">GitHub</a>
            <a href="http://www.jamesdenbow.com/projects/pathfinder.php" target="_blank" className="tutButton">Learn More</a>
            <button onClick={() => {this.pageChange();}} className="tutButton3">Test it Out!</button>
            <a href="http://www.jamesdenbow.com" target="_blank" className="tutButton2">Website</a>
            <a href="https://www.linkedin.com/in/jed-denbow/" target="_blank" className="tutButton2">LinkedIn</a>
          </div>
        </div>
      );
    }
    else {
      return (
        <div id="modal" className="modal">
          <div id="modpg2" className="modal-content2">
            <h3>Basic Functions:</h3>
            <p>Click and drag your mouse across the grid to draw walls and/or move nodes.</p>
            <img src={logo} alt="tutorial" height="90%"/>
            <p>Use the top menu to select your pathfinding algorithm or generate a maze of walls!</p>
            <button onClick={() => {this.showModal();}} className="tutButton3">Start!</button>
          </div>
        </div>
      );
    }
  }
}
