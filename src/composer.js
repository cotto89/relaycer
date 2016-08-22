import isEmpty from 'lodash/isEmpty';
import dispatcher from './dispatcher.js';
import Task from './task.js';

/*
TODO: async transaction
*/

export default class Composer {
  /**
   * @param {boolean} {async}
   * @param {boolean} {forceUpdate}
   */
  constructor({ async, forceUpdate } = {}) {
    this.async = async || false;
    this.forceUpdate = forceUpdate || false;
    this._tasks = [];
  }

  /**
   * Register task as modifier
   *
   * @param {Function|Function[]} modifier(s)
   * @param {any} [value]
   * @returns {Composer}
   */
  batch(modifier, value) {
    const modifiers = Array.isArray(modifier) ? modifier : [modifier];

    for (const fn of modifiers) {
      const task = new Task({ type: 'modifier', fn, arg: value });
      this._tasks.push(task);
    }
    return this;
  }

  /**
   * Register task as transformer
   *
   * @param {Function} transformer
   * @param {any} [value]
   * @returns {Composer}
   */
  transform(transformer, value) {
    const task = new Task({ type: 'transformer', fn: transformer, arg: value });
    this._tasks.push(task);
    return this;
  }

  /**
   * Register task as breakder
   *
   * @param {Function} breakder
   * @returns {Composer}
   */
  breakIf(breakder) {
    const task = new Task({ type: 'breaker', fn: breakder });
    this._tasks.push(task);
    return this;
  }

  /**
   * Register skipIf to prev task.
   *
   * @param {Function} validator
   * @returns {Composer}
   */
  skipIf(validator) {
    const lastTask = this._tasks.slice(-1)[0];
    if (!isEmpty(lastTask)) lastTask.skipIf = validator;
    return this;
  }

  /**
   * @param {Function} [validator]
   * @returns {Composer}
   */
  dispatch(validator = () => true) {
    validator() && dispatcher.dispatch('composer:dispatch', this);
    return this;
  }

  /**
   * Execute transaction on Store
   *
   * @param {Object} currentState
   * @param {Function} done
   */
  __compose__(currentState, done) {
    /** @type {Object} */
    let nextState = {};
    /** @type {Error} */
    let err;
    /** @type {boolean} */
    let _break_ = false;

    try {
      nextState = this._tasks.reduce((result, task) => {
        if (_break_) return Object.assign(result, {});

        const next = task.run(currentState, result);
        if (next === 'BREAK') {
          _break_ = true;
          return Object.assign(result, {});
        }

        return Object.assign(result, next);
      }, {});
    } catch (e) {
      err = e;
    }

    return done(err, currentState, nextState);
  }

}
