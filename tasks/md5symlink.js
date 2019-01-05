var
  grunt,
  options,
  patterns,
  hashWidth,
  extensions,
  fs      = require('fs'),
  path    = require('path'),
  chalk   = require('chalk'),
  md5File = require('md5-file'),
  isThere = require('is-there'),

  log = function log(chalkColor, messages) {
    grunt.log.writeln(chalkColor.apply(this, messages));
  },

  createMD5Symlink = function createMD5Symlink(nodeInfo, nodePath) {
    var
      hash        = md5File.sync(nodePath),
      symlinkName = nodeInfo.base + '-' + hash.substr(0, hashWidth) + nodeInfo.ext,
      symlinkPath = path.join(nodeInfo.dir, symlinkName);

    if (isThere(symlinkPath)) {
      log(chalk.blue, ['md5-symlink already exist:', symlinkPath]);
    } else {
      log(chalk.green, ['creating md5-symlink:', symlinkPath + ' => ' + nodePath]);
      fs.symlinkSync(nodeInfo.name, symlinkPath);
    }
  },

  isSymlinkable = function isSymlinkable(nodeInfo) {
    var lstat = nodeInfo.lstat;

    if (lstat.isDirectory() || lstat.isSymbolicLink()) {
      return;
    }

    return true;
  },

  getNodeInfo = function getNodeInfo(nodePath) {
    var
      lstat = fs.lstatSync(nodePath),
      ext   = path.extname(nodePath),
      dir   = path.dirname(nodePath),
      name  = path.basename(nodePath),
      base  = path.basename(nodePath, ext);

    return {
      'lstat' : lstat,
      'ext'   : ext,
      'dir'   : dir,
      'name'  : name,
      'base'  : base
    };
  },

  isExtensionMatching = function isExtensionMatching(nodeExtension, nodePath) {
    var
      i,
      extension;

    if (extensions.length === 0) {
      return true;
    }

    for (i = 0; i < extensions.length; i++) {
      extension = extensions[i];

      if (nodeExtension === extension) {
        return true;
      }
    }

    log(chalk.magenta, ['path does not match any extension:', nodePath]);

    return false;
  },

  isPatternMatching = function isPatternMatching(nodePath) {
    var
      i,
      pattern;

    if (patterns.length === 0) {
      return true;
    }

    for (i = 0; i < patterns.length; i++) {
      pattern = patterns[i];

      if (nodePath.indexOf(pattern) !== -1) {
        return true;
      }
    }

    log(chalk.magenta, ['path does not match any pattern:', nodePath]);

    return false;
  },

  processFile = function processFile(nodePath) {
    var
      nodeInfo = getNodeInfo(nodePath);

    if (!isSymlinkable(nodeInfo, nodePath)) {
      return;
    }

    if (!isPatternMatching(nodePath)) {
      return;
    }

    if (!isExtensionMatching(nodeInfo.ext, nodePath)) {
      return;
    }

    createMD5Symlink(nodeInfo, nodePath);
  },

  processFiles = function processFiles(files) {
    files.src.forEach(processFile);
  },

  run = function run() {
    options     = this.options();
    patterns    = options.patterns    || [];
    extensions  = options.extensions  || [];
    hashWidth   = options.hashWidth   || 32;

    if (!Array.isArray(patterns) ) {
      throw new Error('PATTERN_SHOULD_BE_AN_ARRAY');
    }

    if (!Array.isArray(extensions) ) {
      throw new Error('EXTENSION_SHOULD_BE_AN_ARRAY');
    }

    this.files.forEach(processFiles);
  },

  exportTask = function exportTask(gruntObj) {
    grunt = gruntObj;

    grunt.registerMultiTask('md5symlink', 'Create symlink by the md5 of given files.', run);
  };

module.exports = exportTask;
