'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Dispatcher = undefined;

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _get3 = require('babel-runtime/helpers/get');

var _get4 = _interopRequireDefault(_get3);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _events = require('events');

var _events2 = _interopRequireDefault(_events);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Dispatcher = exports.Dispatcher = function (_EventEmitter) {
  (0, _inherits3.default)(Dispatcher, _EventEmitter);

  function Dispatcher() {
    (0, _classCallCheck3.default)(this, Dispatcher);
    return (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(Dispatcher).apply(this, arguments));
  }

  (0, _createClass3.default)(Dispatcher, [{
    key: 'dispatch',

    /**
     * @param {string} event
     * @param {any} args
     */
    value: function dispatch(event) {
      var _get2;

      for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      (_get2 = (0, _get4.default)((0, _getPrototypeOf2.default)(Dispatcher.prototype), 'emit', this)).call.apply(_get2, [this, event].concat(args));
    }
  }]);
  return Dispatcher;
}(_events2.default);

exports.default = new Dispatcher();
//# sourceMappingURL=dispatcher.js.map