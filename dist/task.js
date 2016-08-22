'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Task = function () {

  /**
   * Creates an instance of Task.
   *
   * @param {string} type
   * @param {Function} fn
   * @param {any} [arg]
   * @param {Function} [skipIf]
   */
  function Task(_ref) {
    var type = _ref.type;
    var fn = _ref.fn;
    var arg = _ref.arg;
    var skipIf = _ref.skipIf;
    (0, _classCallCheck3.default)(this, Task);

    this.type = type;
    this.fn = fn;
    this.arg = arg;
    this.skipIf = skipIf;
  }

  /**
   * @param {Object} current
   * @param {Object} next
   */


  (0, _createClass3.default)(Task, [{
    key: 'run',
    value: function run(current, next) {
      /** @type {string|Object} */
      var result = {};
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
  }]);
  return Task;
}();

exports.default = Task;
//# sourceMappingURL=task.js.map