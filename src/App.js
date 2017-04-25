/** @flow */

import React, { Component } from 'react';
// eslint-disable-next-line
import FullTilt from 'fulltilt/dist/fulltilt.js'; // needed for gyronorm
import GyroNorm from 'gyronorm';

import invariant from 'invariant';

import Bar from './Bar';

import './App.css';

class App extends Component {
  _gn = new GyroNorm();
  state: {deviceData: ?Object} = {
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

  _onDeviceUpdate = (data: Object) => {
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

    const dv = computeDirectionalVectors(
      deviceData.do.alpha,
      deviceData.do.beta,
      deviceData.do.gamma,
    );

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

          <p>Directional X:</p>
          <Bar length={dv.x[0]} />
          <Bar length={dv.x[1]} />
          <Bar length={dv.x[2]} />
          <p>Directional Y:</p>
          <Bar length={dv.y[0]} />
          <Bar length={dv.y[1]} />
          <Bar length={dv.y[2]} />
          <p>Directional Z:</p>
          <Bar length={dv.z[0]} />
          <Bar length={dv.z[1]} />
          <Bar length={dv.z[2]} />

          <p>Device Motion X:</p>
          <Bar length={deviceData.dm.x / 10} />
          <p>Device Motion Y:</p>
          <Bar length={deviceData.dm.y / 10} />
          <p>Device Motion Z:</p>
          <Bar length={deviceData.dm.z / 10} />
        </div>
      </div>
    );
  }

  _convertFloatToString(floatNum: number) {
    if (floatNum < 0) {
      return floatNum.toString();
    } else {
      return ' ' + floatNum.toString();
    }
  }
}


type Vector = Array<number>;
type Matrix = Array<Vector>;

function multiplyMatrix(m1: Matrix, m2: Matrix): Matrix {
  invariant(
    m1.every(row => row.length === m1[0].length),
    'Every row must be the same length',
  );
  invariant(
    m2.every(row => row.length === m2[0].length),
    'Every row must be the same length',
  );
  invariant(m1[0].length === m2.length, 'm1 width must === m2.height');

  const resultWidth = m2[0].length;
  const resultHeight = m1[0].length;

  return Array(resultHeight).fill(null).map((_, rowIndex) =>
    Array(resultWidth).fill(null).map((_, columnIndex) =>
      m1[rowIndex].map(
        (m1Value, i) => m1Value * m2[i][columnIndex]
      ).reduce((a, b) => a + b)
    )
  );
}

function multiplyMatrixWithVector(matrix: Matrix, vector: Vector): Vector {
  const result = multiplyMatrix(matrix, vector.map(val => [val]));
  return result.map(row => row[0]);
}

function degreesToRadians(degrees: number): number {
  return degrees * Math.PI / 180;
}

function getRotationMatrixAroundX(radians: number): Matrix {
  return [
    [1, 0,                  0                ],
    [0, Math.cos(radians), -Math.sin(radians)],
    [0, Math.sin(radians),  Math.cos(radians)],
  ];
}

function getRotationMatrixAroundY(radians: number): Matrix {
  return [
    [ Math.cos(radians), 0, Math.sin(radians)],
    [ 0,                 1, 0                ],
    [-Math.sin(radians), 0, Math.cos(radians)],
  ];
}

function getRotationMatrixAroundZ(radians: number): Matrix {
  return [
    [Math.cos(radians), -Math.sin(radians), 0],
    [Math.sin(radians),  Math.cos(radians), 0],
    [0,                  0                , 1],
  ];
}

const UNIT_VECTOR_X: Vector = [1, 0, 0];
const UNIT_VECTOR_Y: Vector = [0, 1, 0];
const UNIT_VECTOR_Z: Vector = [0, 0, 1];

function computeDirectionalVectors(alpha, beta, gamma): {x: Vector, y: Vector, z: Vector} {
  const rotationMatrix = [
    // Order matters, and this is what W3C specified this to be
    getRotationMatrixAroundZ(degreesToRadians(alpha)),
    getRotationMatrixAroundX(degreesToRadians(beta)),
    getRotationMatrixAroundY(degreesToRadians(gamma)),
  ].reduce((m1, m2) => multiplyMatrix(m1, m2));
  return {
    x: multiplyMatrixWithVector(rotationMatrix, UNIT_VECTOR_X),
    y: multiplyMatrixWithVector(rotationMatrix, UNIT_VECTOR_Y),
    z: multiplyMatrixWithVector(rotationMatrix, UNIT_VECTOR_Z),
  };
}

export default App;
