const tocify = require('..')
const { test } = require('tap')
const path = require('path')
const fs = require('fs-extra')

test('hyphenate word splitter', t => {
  return tocify({
    root: `${__dirname}/fixture`,
    tocDir: __dirname,
  })
  .then(result => {
    return fs.readFile(`${__dirname}/hyphenate_expected.md`, 'utf8')
      .then(expected => t.same(result, expected, 'should be the same'))
  })
})
