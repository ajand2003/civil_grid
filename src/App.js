import './App.css';
import MapDataDelegator from './components/MapDataDelegator';

function App() {
  return (
    <div>
      <title>Map of Ev Chargers</title>
      <script src="https://polyfill.io/v3/polyfill.min.js?features=default"></script>
      <link rel="stylesheet" type="text/css" href="./style.css" />
      <script
      src="https://maps.googleapis.com/maps/api/js?key=AIzaSyC_TM6mkSt4reTYVB3Z2Z5ywTMDxDaMZc0&callback=initMap&libraries=geometry&v=weekly"
      defer
       ></script>
      <MapDataDelegator></MapDataDelegator>
  </div>

  );
}

export default App;
