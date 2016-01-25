/* eslint-env node, mocha */
import SimplePage from './fixtures/simpleApp/simplePage';
import SubPage from './fixtures/subsApp/subPage';
import DetailPage from './fixtures/masterApp/detailPage';
import CountPage from './fixtures/countApp/countPage';
import ReactTest from 'react-addons-test-utils';
import assert from 'assert';

/**
 * Simple unit tests.
 */
describe('Page', function () {
  it('Simple page renders as expected.', function () {
    const page = new SimplePage();
    page.load();
    const span = document.querySelector('span');
    assert.ok(span, 'could not find span element');
    assert.equal(span.innerHTML, 'Details', 'span does not have correct value');
  });

  it('Page routing works as expected.', function () {
    const page = new SubPage();
    page.load();

    let span = document.querySelector('span');
    assert.ok(span, 'could not find span element');
    assert.equal(span.innerHTML, 'One', 'span does not have correct value');

    page.routeSubTwo();
    span = document.querySelector('span');
    assert.ok(span, 'could not find span element');
    assert.equal(span.innerHTML, 'Two', 'span does not have correct value');
  });

  it('Page with master renders as expected.', function () {
    const page = new DetailPage();
    page.load();
    const spans = document.querySelectorAll('span');
    assert.ok(spans, 'could not find spans');
    assert.equal(spans.length, 3, 'incorrect number of spans');
    assert.equal(spans[0].innerHTML, 'Start', 'first span has incorrect value.');
    assert.equal(spans[1].innerHTML, 'Details', 'second span has incorrect value.');
    assert.equal(spans[2].innerHTML, 'End', 'third span has incorrect value.');
  });

  it('Page with events renders and behaves as expected.', function () {
    const page = new CountPage();
    page.load();
    let displayCount = document.querySelector('#countDisplay');
    const incrementCount = document.querySelector('#countIncrement');

    assert.ok(displayCount, 'could not find countDisplay element');
    assert.equal(displayCount.innerHTML, '0', 'countDisplay has incorrect value.');
    assert.ok(incrementCount, 'could not find countIncrement element');

    ReactTest.Simulate.click(incrementCount);

    displayCount = document.querySelector('#countDisplay');
    assert.ok(displayCount, 'could not find countDisplay element after click.');
    assert.equal(displayCount.innerHTML, '1', 'countDisplay has incorrect value after click.');
  });
});
