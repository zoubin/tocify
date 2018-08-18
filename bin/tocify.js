#!/usr/bin/env node
const tocify = require('..')
const { Command } = require('commander')
const program = new Command('tocify')

program
  .version(require('../package.json').version)
  .option('-d, --toc-dir', 'directory where the toc file is meant to host')
  .option('-e, --ext <extname>', 'extname of markdown files', '.md')
  .option('-m, --max-level <level>', 'max level of header should be rendered', 2)
  .option('-s, --word-splitter <splitter>', 'word splitters in path', '_')
  .parse(process.argv)

async function main() {
  let options = {...program, root: program.args[0]}
  let res = await tocify(options)
  process.stdout.write(res)
}
main()
