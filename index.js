/* eslint-env node */
'use strict';

var Plugin = require('broccoli-plugin');
var walkSync = require('walk-sync');
var fs = require('fs');
var FSTree = require('fs-tree-diff');
var Promise = require('rsvp').Promise;
var path = require('path');
var os = require("os");

module.exports = StyleManifest;

StyleManifest.prototype = Object.create(Plugin.prototype);
StyleManifest.prototype.constructor = StyleManifest;
function StyleManifest(inputNode, options) {
  options = options || {};
  Plugin.call(this, [inputNode], {
    annotation: options.annotation,
    persistentOutput: true
  });

  this.currentTree = new FSTree();
  this.styleFiles = {};
  this.outputFileStem = options.outputFileNameWithoutExtension;
  this.defaultExtension = options.defaultExtension || 'css';
}

StyleManifest.prototype.build = function() {
  var entries = walkSync.entries(this.inputPaths[0], {
    directories: false,
  });
  var nextTree = new FSTree.fromEntries(entries, {
    sortAndExpand: true
  });
  var currentTree = this.currentTree;
  var patches = currentTree.calculatePatch(nextTree);

  this.currentTree = nextTree;

  return Promise.resolve()
    .then(this.ganerateManifest.bind(this, patches))
    .then(this.ensureFile.bind(this));
};

StyleManifest.prototype.ganerateManifest = function(patches) {
  for (var i = 0; i < patches.length; i++) {
    switch (patches[i][0]) {
      case 'create':
        this.addImport(patches[i][1]);
        break;
      case 'unlink':
        this.removeImport(patches[i][1]);
        break;
    }
  }

  return this.makeManifest();
}

StyleManifest.prototype.addImport = function(stylePath) {
  var extension = path.extname(stylePath);

  this.styleFiles[extension] = this.styleFiles[extension] || {};
  this.styleFiles[extension][stylePath] = '@import "' + stylePath + '"';
}

StyleManifest.prototype.removeImport = function(stylePath) {
  var extension = path.extname(stylePath);

  delete this.styleFiles[extension][stylePath];
}

StyleManifest.prototype.makeManifest = function() {
  for (var extension in this.styleFiles) {
    var output = '';
    for (var file in this.styleFiles[extension]) {
      output = this.styleFiles[extension][file] + ';' + os.EOL + output;
    }
    fs.writeFileSync(path.join(this.outputPath, this.outputFileStem + extension), output);
  }
}

const EMPTY_FILE_COMMENT = '\
/*\n\
  broccoli-style-manifest: This is an empty style mainfest file.\n\
*/\n';

StyleManifest.prototype.ensureFile = function() {
  if (Object.keys(this.styleFiles).length === 0) {
    if (!this.emptyFile) {
      this.emptyFile = path.join(this.outputPath, this.outputFileStem + '.' + this.defaultExtension);
      fs.writeFileSync(this.emptyFile, EMPTY_FILE_COMMENT);
    }
  } else if (this.emptyFile) {
    fs.unlinkSync(this.emptyFile);
    delete this.emptyFile;
  }

  return true;
}
