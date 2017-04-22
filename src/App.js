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
            Alpha: {
              // Sit on a swivel chair and turn
              deviceData.do.alpha
            }
            <br />
            Beta : {
              // How up-right the phone is
              // facing up = 0
              // standing up = 90
              // facing down = 180/-180
              // upside down = -90
              deviceData.do.beta
            }
            <br />
            Gamma: {
              // When facing up, how balanced it is. 0 is balanced. -90 <-> 90
              // When standing up, how rotated it is by tilting head.
              deviceData.do.gamma
            }
            <br />
          </pre>
          <p>Device Motion:</p>
          <pre>
            X: {
              // Relative to phone: left right when looking at phone
              this._convertFloatToString(deviceData.dm.x)
            }
            <br />
            Y: {
              // Up down when looking at phone
              this._convertFloatToString(deviceData.dm.y)
            }
            <br />
            Z: {
              // Towards and away when looking at phone
              this._convertFloatToString(deviceData.dm.z)
            }
            <br />
          </pre>
        </div>
      </div>
    );
  }

  _convertFloatToString(float) {
    if (float < 0) {
      return float.toString();
    } else {
      return ' ' + float.toString();
    }
  }
}

export default App;
