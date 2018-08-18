const path = require('path')
const globby = require('globby')
const { markdown: md } = require('markdown')
const fs = require('fs-extra')

async function findPaths (root, ext = '.md') {
  return await globby(`**/*${ext}`, { cwd: root })
}

function formatHeaderText (text, wordSplitter) {
  return text.split(wordSplitter)
    .map(word => word.slice(0, 1).toUpperCase() + word.slice(1))
    .join(' ')
}

async function createTOCItems (relPaths, root, tocDir, wordSplitter = '-') {
  let items = {}
  await Promise.all(relPaths.map(async function (relPath) {
    let isHeader = false
    do {
      if (items[relPath]) return
      let absPath = path.join(root, relPath)
      let href = path.relative(tocDir, absPath)
      items[relPath] = {
        href,
        level: relPath.split(path.sep).length,
        isHeader
      }
      if (!isHeader) {
        items[relPath].text = await getLinkText(absPath)
        isHeader = true
      } else {
        items[relPath].text = formatHeaderText(path.basename(relPath), wordSplitter)
      }
      relPath = path.dirname(relPath)
    } while (relPath !== '.')
  }))
  return Object.values(items)
}

async function getLinkText (file) {
  let source = await fs.readFile(file, 'utf8')
  let tree = md.parse(source)
  for (let i = 1, len = tree.length; i < len; i++) {
    // the first heading
    if (tree[i][0] === 'header') return tree[i][2]
  }
  return path.basename(file)
}

function markdownify (items, maxHeaderLevel = 2) {
  return items.filter(o => !o.isHeader || o.level <= maxHeaderLevel)
    .sort((a, b) => a.href < b.href ? -1 : 1)
    .map(({isHeader, level, text, href}) => {
      if (isHeader) {
        return '\n' + '#'.repeat(level + 1) + ` ${text}`
      }
      return `- [${text}](${href})`
    })
    .join('\n')
}

async function tocify ({root, tocDir, ext, maxLevel, wordSplitter}) {
  root = root && path.resolve(root) || path.join(process.cwd(), 'docs')
  tocDir = tocDir && path.resolve(tocDir) || process.cwd()
  let docPaths = await findPaths(root, ext)
  let toc = await createTOCItems(docPaths, root, tocDir, wordSplitter)
  return markdownify(toc, maxLevel)
}

module.exports = tocify
