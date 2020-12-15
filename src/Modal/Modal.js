import React, {Component} from 'react';

import './Modal.css';

export default class Modal extends Component {
  constructor() {
    super();
    this.state = {
      show: true,
    };
  }

  setFn() {
    this.setState({show: false});
  }

  showModal () {
    document.getElementById(`modal`).className = "modal modAni";
    setTimeout(function() {this.setState({show: false})}.bind(this), 1000);
  }

  render() {
    if (this.state.show === false) {
      return null;
    }
    return (
      <div id="modal" className="modal">
        <div class="modal-content">
          <h3>Welcome to</h3>
          <h1><b>PathFinder</b></h1>
          <p>This project was made by James Denbow</p>
          <a href="https://github.com/JamesDenbow/PathFinder" target="_blank" className="tutButton">GitHub</a>
          <a href="http://www.jamesdenbow.com/projects/pathfinder.php" target="_blank" className="tutButton">Learn More</a>
          <button onClick={() => {this.showModal();}} className="tutButton3">Test it Out!</button>
          <a href="http://www.jamesdenbow.com" target="_blank" className="tutButton2">Website</a>
          <a href="https://www.linkedin.com/in/jed-denbow/" target="_blank" className="tutButton2">LinkedIn</a>
        </div>
      </div>
    );
  }
}
