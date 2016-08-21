export default class Task {

  /**
   * Creates an instance of Task.
   *
   * @param {string} type
   * @param {Function} fn
   * @param {any} [arg]
   * @param {Function} [skipIf]
   */
  constructor({ type, fn, arg, skipIf }) {
    this.type = type;
    this.fn = fn;
    this.arg = arg;
    this.skipIf = skipIf;
  }

  /**
   * @param {Object} current
   * @param {Object} next
   */
  run(current, next) {
    /** @type {string|Object} */
    let result = {};
    switch (this.type) {
      case 'modifier':
        result = this.fn(current, this.arg) || {};
        break;
      case 'transformer':
        result = this.fn(current, next, this.arg) || {};
        break;
      case 'breaker':
        if (this.fn(current, next, this.arg)) {
          result = 'BREAK';
        }
        break;
      default:
        result = {};
        break;
    }

    if (this.skipIf && this.skipIf(current, result)) {
      result = {};
    }
    return result;
  }
}
