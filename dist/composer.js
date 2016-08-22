'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _isEmpty = require('lodash/isEmpty');

var _isEmpty2 = _interopRequireDefault(_isEmpty);

var _dispatcher = require('./dispatcher.js');

var _dispatcher2 = _interopRequireDefault(_dispatcher);

var _task = require('./task.js');

var _task2 = _interopRequireDefault(_task);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
TODO: async transaction
*/

var Composer = function () {
  /**
   * @param {boolean} {async}
   * @param {boolean} {forceUpdate}
   */
  function Composer() {
    var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    var async = _ref.async;
    var forceUpdate = _ref.forceUpdate;
    (0, _classCallCheck3.default)(this, Composer);

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


  (0, _createClass3.default)(Composer, [{
    key: 'batch',
    value: function batch(modifier, value) {
      var modifiers = Array.isArray(modifier) ? modifier : [modifier];

      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = (0, _getIterator3.default)(modifiers), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var fn = _step.value;

          var task = new _task2.default({ type: 'modifier', fn: fn, arg: value });
          this._tasks.push(task);
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
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

  }, {
    key: 'transform',
    value: function transform(transformer, value) {
      var task = new _task2.default({ type: 'transformer', fn: transformer, arg: value });
      this._tasks.push(task);
      return this;
    }

    /**
     * Register task as breakder
     *
     * @param {Function} breakder
     * @returns {Composer}
     */

  }, {
    key: 'breakIf',
    value: function breakIf(breakder) {
      var task = new _task2.default({ type: 'breaker', fn: breakder });
      this._tasks.push(task);
      return this;
    }

    /**
     * Register skipIf to prev task.
     *
     * @param {Function} validator
     * @returns {Composer}
     */

  }, {
    key: 'skipIf',
    value: function skipIf(validator) {
      var lastTask = this._tasks.slice(-1)[0];
      if (!(0, _isEmpty2.default)(lastTask)) lastTask.skipIf = validator;
      return this;
    }

    /**
     * @param {Function} [validator]
     * @returns {Composer}
     */

  }, {
    key: 'dispatch',
    value: function dispatch() {
      var validator = arguments.length <= 0 || arguments[0] === undefined ? function () {
        return true;
      } : arguments[0];

      validator() && _dispatcher2.default.dispatch('composer:dispatch', this);
      return this;
    }

    /**
     * Execute transaction on Store
     *
     * @param {Object} currentState
     * @param {Function} done
     */

  }, {
    key: '__compose__',
    value: function __compose__(currentState, done) {
      /** @type {Object} */
      var nextState = {};
      /** @type {Error} */
      var err = void 0;
      /** @type {boolean} */
      var _break_ = false;

      try {
        nextState = this._tasks.reduce(function (result, task) {
          if (_break_) return (0, _assign2.default)(result, {});

          var next = task.run(currentState, result);
          if (next === 'BREAK') {
            _break_ = true;
            return (0, _assign2.default)(result, {});
          }

          return (0, _assign2.default)(result, next);
        }, {});
      } catch (e) {
        err = e;
      }

      return done(err, currentState, nextState);
    }
  }]);
  return Composer;
}();

exports.default = Composer;
//# sourceMappingURL=composer.js.map