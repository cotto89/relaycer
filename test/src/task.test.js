import assert from 'power-assert';
import sinon from 'sinon';
import cloneDeep from 'lodash/cloneDeep';
import Task from './../../src/task.js';

describe('Task()', function() {
  describe('#constructor()', function() {
    const modA = ({ a }, val) => ({ a: [...a, val] });
    it('should have default props', function() {
      const task = new Task({ type: 'modifier', fn: modA, arg: { d: 3 } });
      assert.deepEqual(task, {
        type: 'modifier',
        fn: modA,
        arg: { d: 3 },
        skipIf: undefined,
      });
    });
  });

  describe('#run()', function() {
    const initialState = { a: [{ b: 1 }, { c: 2 }] };
    const mod = ({ a }, val) => ({ a: [...a, val] });
    const transformer = ({ a }, next, val) => ({ a: [...a, val] });
    const breaker = () => true;
    const skipIf = () => true;


    beforeEach(function() {
      this.state = cloneDeep(initialState);
    });

    describe('type: modifier', function() {
      const spyMod = sinon.spy(mod);
      const spySkipIf = sinon.spy(skipIf);

      it('should called correct args and return nextState', function() {
        const state = this.state;
        const task = new Task({ type: 'modifier', fn: spyMod, arg: { d: 3 } });
        const nextState = task.run(state, {});
        assert(spyMod.calledWith(state, { d: 3 }));
        assert.deepEqual(nextState, {
          a: [{ b: 1 }, { c: 2 }, { d: 3 }],
        });
      });

      it('should return {} when skipIf return true', function() {
        const state = this.state;
        const task = new Task({
          type: 'modifier',
          fn: spyMod,
          arg: { d: 3 },
          skipIf: spySkipIf,
        });
        const nextState = task.run(state, {});
        assert(spySkipIf.calledWith(state, { a: [{ b: 1 }, { c: 2 }, { d: 3 }] }));
        assert.deepEqual(nextState, {});
      });
    });

    describe('type: transformer', function() {
      const spy = sinon.spy(transformer);

      it('should called correct args and return nextState', function() {
        const state = this.state;
        const task = new Task({ type: 'transformer', fn: spy, arg: { d: 3 } });
        const nextState = task.run(state, {});
        assert(spy.calledWith(state, {}, { d: 3 }));
        assert.deepEqual(nextState, {
          a: [{ b: 1 }, { c: 2 }, { d: 3 }],
        });
      });
    });

    describe('type: breaker', function() {
      const spy = sinon.spy(breaker);

      it('should called correct args and return BREAK', function() {
        const state = this.state;
        const task = new Task({ type: 'breaker', fn: spy, arg: { d: 3 } });
        const result = task.run(state, {});
        assert(spy.calledWith(state, {}, { d: 3 }));
        assert.deepEqual(result, 'BREAK');
      });
    });
  }); // end of #run
});
