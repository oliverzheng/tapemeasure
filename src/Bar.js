/** @flow */

import React, { Component } from 'react';

import classNames from 'classnames';

import './Bar.css';

export default class Bar extends Component {
  render() {
    const {length} = this.props; // from 0 to 1
    const lengthStyle = Math.abs(length / 2 * 100).toString() + '%';
    return (
      <div className="Bar">
        <div
          className={
            classNames({
              'Bar-length': true,
              'Bar-positive': length >= 0,
              'Bar-negative': length < 0,
            })
          }
          style={{width: lengthStyle}}
        />
        <div className="Bar-middle" />
      </div>
    );
  }
}

