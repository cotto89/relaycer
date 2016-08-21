import assert from 'power-assert';
import cloneDeep from 'lodash/cloneDeep';
import Composer from './../../src/composer.js';
import dispatcher from './../../src/dispatcher.js';

describe('Composer()', function() {
  const initState = {
    a: [{ id: 1 }, { id: 2 }],
  };

  const mod = ({ a }, val) => ({ a: [...a, val] });
  const transform = (current, next, val) => {
    const a = next.a.map(x => Object.assign({}, { id: x.id * val }));
    return { a };
  };
  const breaker = () => true;
  const skip = () => true;

  describe('#constructor()', function() {
    it('default props', function() {
      assert.deepEqual(new Composer(), {
        async: false,
        forceUpdate: false,
        _tasks: [],
      });

      assert.deepEqual(new Composer({ async: true }), {
        async: true,
        forceUpdate: false,
        _tasks: [],
      });
    });
  }); // end of #constructor

  describe('#batch, #transform, #breakIf, #skipIf', function() {
    it('should return correct tasks structure', function() {
      const composer = new Composer()
        .batch(mod, { id: 3 })
        .skipIf(skip)
        .transfrom(transform, 10)
        .breakIf(breaker);

      assert.deepEqual(composer._tasks, [
        {
          type: 'modifier',
          fn: mod,
          arg: { id: 3 },
          skipIf: skip,
        },
        {
          type: 'transformer',
          fn: transform,
          arg: 10,
          skipIf: undefined,
        },
        {
          type: 'breaker',
          fn: breaker,
          arg: undefined,
          skipIf: undefined,
        },
      ]);
    });

    it('shoud have 2 tasks when #batch(modifiers)', function() {
      const composer = new Composer()
        .batch([mod, mod], { id: 3 });

      assert.equal(composer._tasks.length, 2);
    });
  }); // end of #batch, #transform, #breakIf, #skipIf

  describe('#dispatch', function() {
    it('should be dispatched when validator return true', function() {
      dispatcher.on('composer:dispatch', (composer) => {
        assert.equal(composer._tasks.length, 1);
      });

      const composer = new Composer()
        .batch(mod)
        .dispatch(() => true);

      assert(composer instanceof Composer);
    });
  });

  describe('#__compose__', function() {
    beforeEach(function() {
      this.state = cloneDeep(initState);
    });

    describe('batch + transform', function() {
      it('should return nextState', function() {
        const nextState = new Composer()
          .batch(mod, { id: 3 })
          .transfrom(transform, 10)
          .__compose__(this.state, function(err, curent, next) {
            assert.equal(err, undefined);
            assert.deepEqual(next, {
              a: [{ id: 10 }, { id: 20 }, { id: 30 }],
            });
            return next;
          });

        assert.deepEqual(nextState, {
          a: [{ id: 10 }, { id: 20 }, { id: 30 }],
        });
      });
    });

    describe('batch + skipIf', function() {
      it('should skip prev mod', function() {
        new Composer()
          .batch(mod, { id: 3 })
          .skipIf(skip)
          .batch(mod, { id: 4 })
          .__compose__(this.state, function(err, current, next) {
            assert.deepEqual(next, {
              a: [{ id: 1 }, { id: 2 }, { id: 4 }],
            });
          });
      });
    });

    describe('batch + breakIf', function() {
      it('should break after process when breakIf return true', function() {
        new Composer()
          .batch(mod, { id: 4 })
          .breakIf(breaker)
          .batch(mod, { id: 5 })
          .batch(mod, { id: 6 })
          .__compose__(this.state, function(err, current, next) {
            assert.deepEqual(next, {
              a: [{ id: 1 }, { id: 2 }, { id: 4 }],
            });
          });
      });
    });

    describe('when exception occur', function() {
      it('should break after process when breakIf return true', function() {
        new Composer()
          .batch(mod, { id: 4 })
          .transfrom(() => {
            throw new Error();
          })
          .__compose__(this.state, function(err, current, next) {
            assert(err instanceof Error);
            assert.deepEqual(next, {});
          });
      });
    });
  }); // end of #__compose__()
});
