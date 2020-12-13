import logo from './logo.svg';
import './App.css';
import PathfindingVisualizer from './PathfindingVisualizer/PathfindingVisualizer';
import Modal from './Modal/Modal';

function App() {

  return (
    <div className="App">
      <Modal></Modal>
      <PathfindingVisualizer></PathfindingVisualizer>
    </div>
  );
}

export default App;
