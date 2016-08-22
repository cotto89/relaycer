'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _events = require('events');

var _events2 = _interopRequireDefault(_events);

var _dispatcher = require('./dispatcher.js');

var _dispatcher2 = _interopRequireDefault(_dispatcher);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Store = function (_EventEmitter) {
  (0, _inherits3.default)(Store, _EventEmitter);

  /**
   * @param {Object} initialState
   */
  function Store(initialState) {
    (0, _classCallCheck3.default)(this, Store);

    var _this = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(Store).call(this));

    _this.state = initialState || {};
    _this.dispatcher = _dispatcher2.default;

    _this.dispatcher.on('composer:dispatch', function (composer) {
      _this.process(composer);
    });
    return _this;
  }

  (0, _createClass3.default)(Store, [{
    key: 'getState',
    value: function getState() {
      return this.state;
    }

    /**
     * @param {Object} nextState
     */

  }, {
    key: 'setState',
    value: function setState(nextState) {
      this.state = (0, _assign2.default)({}, nextState);
      this.emit('change');
      return this.state;
    }

    /**
     * @param {Composer} composer
     * @returns {Object|Error}
     */

  }, {
    key: 'process',
    value: function process(composer) {
      var _this2 = this;

      return composer.__compose__(this.state, function (err, current, next) {
        if (err) {
          _this2.emit('process:error', err);
          return err;
        }
        return _this2.setState(next);
      });
    }
  }]);
  return Store;
}(_events2.default);

exports.default = Store;
//# sourceMappingURL=store.js.map