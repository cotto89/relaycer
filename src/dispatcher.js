import EventEmitter from 'events';

export class Dispatcher extends EventEmitter {
  /**
   * @param {string} event
   * @param {any} args
   */
  dispatch(event, ...args) {
    super.emit(event, ...args);
  }
}

export default new Dispatcher();
