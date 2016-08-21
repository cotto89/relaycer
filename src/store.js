import EventEmitter from 'events';
import dispatcher from './dispatcher.js';

export default class Store extends EventEmitter {
  /**
   * @param {Object} initialState
   */
  constructor(initialState) {
    super();
    this.state = initialState || {};
    this.dispatcher = dispatcher;

    this.dispatcher.on('composer:dispatch', (composer) => {
      this.process(composer);
    });
  }

  getState() {
    return this.state;
  }

  /**
   * @param {Object} nextState
   */
  setState(nextState) {
    this.state = Object.assign({}, nextState);
    this.emit('change');
    return this.state;
  }

  /**
   * @param {Composer} composer
   * @returns {Object|Error}
   */
  process(composer) {
    return composer.__compose__(this.state, ((err, current, next) => {
      if (err) return err;
      return this.setState(next);
    }));
  }
}
