# tocify
Build a TOC for markdown files, meant to work with github pages (built with jekyll).

## Install

`npm install --save-dev tocify`

## Usage

In `package.json`:

```json
{
  "scripts": {
    "toc": "tocify docs > README.md"
  }
}

```

Then `README.md` would be the index page with navigation links (toc) to pages built from markdown files in the directory `docs`.

## Options

```
  Usage: tocify [options]

  Options:

    -V, --version                   output the version number
    -d, --toc-dir                   directory where the toc file is meant to host
    -e, --ext <extname>             extname of markdown files (default: .md)
    -m, --max-level <level>         max level of header should be rendered (default: 2)
    -s, --word-splitter <splitter>  word splitters in path (default: _)
    -h, --help                      output usage information

```

