const Composer = require('./dist/composer').default;
const RelaycerStore = require('./dist/store').default;
const dispatcher = require('./dist/dispatcher').default;

/**
 * @param {Object} [option={ async, forceUpdate }]
 * @returns {Composer}
 */
function relaycer(option = {}) {
  return new Composer(option);
}

module.exports = {
  relaycer,
  Composer,
  RelaycerStore,
  dispatcher,
};
