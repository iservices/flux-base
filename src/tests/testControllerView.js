/* eslint-env node, mocha */
import CustomController from './fixtures/controller/customController';
import OneStore from './fixtures/controller/oneStore';
import TwoStore from './fixtures/controller/twoStore';
import assert from 'assert';

/**
 * Simple unit tests.
 */
describe('ControllerView', function () {
  it('Stores added and removed as expected.', function () {
    const controller = new CustomController();
    const oneStore = new OneStore();
    const twoStore = new TwoStore();
    controller.addStore(oneStore);
    controller.addStore(twoStore);
    controller.addStore(twoStore);
    assert.equal(controller.mStores.length, 2, 'add function failed.');

    controller.removeStore(oneStore);
    assert.equal(controller.mStores.length, 1, 'remove function failed.');
    assert.equal(controller.mStores[0], twoStore, 'wrong store removed.');

    controller.removeAllStores();
    assert.equal(controller.mStores.length, 0, 'All stores not removed.');
  });
});
