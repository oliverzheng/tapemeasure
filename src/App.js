import React, { Component } from 'react';
// eslint-disable-next-line
import FullTilt from 'fulltilt/dist/fulltilt.js'; // needed for gyronorm
import GyroNorm from 'gyronorm';

import './App.css';

class App extends Component {
  _gn = new GyroNorm();
  state = {
    deviceData: null,
  };

  componentDidMount() {
    this._gn.init({
      frequency: 500,
    }).then(
      () => this._gn.start(this._onDeviceUpdate)
    );
  }

  componentWillUnmount() {
    this._gn.stop();
  }

  _onDeviceUpdate = (data) => {
    this.setState({
      deviceData: data,
    });
  }

  render() {
    return (
      <div className="App">
        {this._renderDeviceData()}
      </div>
    );
  }

  _renderDeviceData() {
    const {deviceData} = this.state;
    if (!deviceData) {
      return null;
    }

    return (
      <div className="App-deviceData">
        <div>
          <p>Device Orientation:</p>
          <pre>
            Alpha: {deviceData.do.alpha}<br />
            Beta : {deviceData.do.beta}<br />
            Gamma: {deviceData.do.gamma}<br />
            Absol: {deviceData.do.absolute}<br />
          </pre>
          <p>Device Motion:</p>
          <pre>
            X: {deviceData.dm.x}<br />
            Y: {deviceData.dm.y}<br />
            Z: {deviceData.dm.z}<br />
          </pre>
        </div>
      </div>
    );
  }
}

export default App;
