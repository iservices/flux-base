/* eslint-env node, mocha */
import Flex from '../local/index';
import SimplePage from './fixtures/simpleApp/simplePage';
import JSDom from 'jsdom';
import assert from 'assert';

/**
 * Simple unit tests.
 */
describe('PageBuilder', function () {
  it('Build page as expected.', function () {
    const pageBuilder = new Flex.PageBuilder();
    pageBuilder.title = 'exampleTitle';
    pageBuilder.scripts = ['<script src="exampleScriptPath"></script>'];
    pageBuilder.styleSheets = ['<link rel="stylesheet" type="text/css" href="exampleStylePath"></link>'];

    const page = new SimplePage({ isBrowserContext: false });
    const result = pageBuilder.renderToString(page);
    const doc = JSDom.jsdom(result);

    assert.ok(doc, 'doc is not valid');

    const scriptTag = doc.querySelector('script');
    assert.ok(scriptTag, 'could not find any scripts');
    assert.equal(scriptTag.getAttribute('src'), 'exampleScriptPath', 'script attribute does not have correct value');

    const linkTag = doc.querySelector('link');
    assert.ok(linkTag, 'could not find any links');
    assert.equal(linkTag.getAttribute('href'), 'exampleStylePath', 'link attribute does not have correct value');

    const span = doc.querySelector('span');
    assert.ok(span, 'could not find any spans');
    assert.equal(span.innerHTML, 'Details', 'span tag has incorrect value');
  });
});
