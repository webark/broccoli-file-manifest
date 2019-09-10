const path = require('path');

module.exports = class Defaults {
  static get templates() {
    return {
      default: '@import "<file-path>";',
    };
  }

  static get outputFileStem() {
    return 'manifest';
  }

  static get extension() {
    return 'css';
  }

  static get emptyFile() {
    return '';
  }

  static sortMethod(a, b) {
    const sortNumber = 0;
    const aLevels = path.normalize(a).split(path.sep).length;
    const bLevels = path.normalize(b).split(path.sep).length;
  
    if (aLevels < bLevels) {
      return -1;
    } else if (aLevels > bLevels) {
      return 1;
    } else if (a < b) {
      return -1;
    } else if (a > b) {
      return 1;
    } else {
      return 0;
    }
  }

  static defineOptions(self, options) {
    self.templates = options.templates || this.templates;
    self.outputFileStem = options.outputFileNameWithoutExtension || this.outputFileStem;
    self.defaultExtension = options.defaultExtension || this.extension;
    self.sortMethod = options.sortMethod || this.sortMethod;
    self.emptyFile = options.emptyFile || this.emptyFile;
  }
}
