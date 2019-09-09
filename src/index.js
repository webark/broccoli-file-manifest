const fs = require('fs');
const path = require('path');
const os = require('os');

const TreeWalker = require('broccoli-tree-walker');

const Defaults = require('./default-options');

class Manifest extends TreeWalker {
  constructor(inputNodes, options = {}) {
    super(inputNodes, {
      ...options,
      directories: false,
    });

    Defaults.defineOptions(this, options);
  }

  files = {}

  create(filePath) {
    const extension = path.extname(filePath).slice(1);
    const template = this.templates[extension] || this.templates.default;
  
    this.files[extension] = this.files[extension] || {};
    this.files[extension][filePath] = template.replace('<file-path>', filePath) + os.EOL;
  }

  unlink(filePath) {
    const extension = path.extname(filePath).slice(1);
    delete this.files[extension][filePath];
  }

  nodesChanged() {
    for (const [extension, files] of Object.entries(this.files)) {
      const output = this._generateManifestContent(files, this.sortMethod);
      fs.writeFileSync(this._filePath(extension), output);
    }
  }

  _generateManifestContent(fileList, sortMethod, output = '') {
    return Object.keys(fileList).sort(sortMethod).reduce((contents, file) => contents + fileList[file], output);
  }

  _filePath(extension = this.defaultExtension) {
    return path.join(this.outputPath, `${this.outputFileStem}.${extension}`);
  }
}

module.exports = function manifest(...params) {
  return new Manifest(...params);
}

module.exports.Manifest = Manifest;
