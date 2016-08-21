import assert from 'power-assert';
import Store from './../../src/store.js';

describe('Store()', function() {
  describe('#setState, #setState', function() {
    it('should return state', function() {
      const store = new Store({ a: 1 });
      store.on('change', () => {
        assert.deepEqual(store.getState(), { a: 2 });
      });

      store.setState({ a: 2 });
    });
  });

  describe('#process', function() {
    const composer = {
      __compose__(state, callback) {
        return callback(undefined, state, { a: 2 });
      },
    };

    const composerWithError = {
      __compose__(state, callback) {
        return callback(new Error(), state, { a: 2 });
      },
    };

    beforeEach(function() {
      this.store = new Store({ a: 1 });
    });

    it('should change store state', function() {
      this.store.on('change', () => {
        assert.deepEqual(this.store.state, { a: 2 });
      });

      this.store.process(composer);
    });

    it('should occur exception', function() {
      assert.throws(function() {
        this.store.process(composerWithError);
      });
    });
  });
});
