/* eslint-disable import/no-extraneous-dependencies, react/jsx-filename-extension */
import ReactDOM from 'react-dom';
import React, { Component } from 'react';
import { RelaycerStore, relaycer } from './../index.js';

/* Model */
const initState = { count: 0 };

function increment({ count }) {
  return { count: count + 1 };
}

function decrement({ count }) {
  return { count: count - 1 };
}

function clearCountIf(current, { count }) {
  if (count >= 10) return { count: 0 };
  return {};
}

/* Controller */
function countUp() {
  return relaycer()
    .batch(increment)
    .transform(clearCountIf)
    .dispatch();
}

function countDown() {
  return Promise.resolve().then(() => {
    relaycer().batch([decrement]).dispatch();
  });
}

/* Store */
const store = new RelaycerStore(initState);

/* View */
class App extends Component {
  constructor(props) {
    super(props);
    this.state = store.getState();
  }

  componentDidMount() {
    store.on('change', () => {
      this.setState(store.getState());
    });
  }

  render() {
    return (
      <div className="container">
        <div className="count">
          {this.state.count}
        </div>
        <div className="buttons">
          <button onClick={countUp}>+ increment +</button>
          <button onClick={countDown}>- decrement -</button>
        </div>
      </div>
    );
  }
}

window.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(<App />, document.querySelector('#entry'));
});
