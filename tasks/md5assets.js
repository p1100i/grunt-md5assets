var
  grunt,
  fs      = require('fs'),
  path    = require('path'),
  chalk   = require('chalk'),
  md5File = require('md5-file'),
  isThere = require('is-there'),

  processableFileExtensions = ['.js', '.css'],

  createMD5Symlink = function createMD5Symlink(nodeInfo, nodePath) {
    var
      hash        = md5File(nodePath),
      symlinkName = nodeInfo.base + '-' + hash + nodeInfo.ext,
      symlinkPath = path.join(nodeInfo.dir, symlinkName);

    if (isThere(symlinkPath)) {
      grunt.log.writeln(chalk.blue('md5-symlink already exist:', symlinkPath));
    } else {
      grunt.log.writeln(chalk.green('creating md5-symlink:', symlinkPath + ' => ' + nodePath));
      fs.symlinkSync(nodeInfo.name, symlinkPath);
    }
  },

  isCacheableAsset = function isCacheableAsset(nodeInfo, nodePath) {
    var lstat = nodeInfo.lstat;

    if (lstat.isDirectory() || lstat.isSymbolicLink()) {
      return;
    }

    if (processableFileExtensions.indexOf(nodeInfo.ext) === -1) {
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

  processFile = function processFile(nodePath) {
    var nodeInfo = getNodeInfo(nodePath);

    if (isCacheableAsset(nodeInfo, nodePath)) {
      createMD5Symlink(nodeInfo, nodePath);
    }
  },

  processFiles = function processFiles(files) {
    files.src.forEach(processFile);
  },

  run = function run() {
    this.files.forEach(processFiles);
  },

  exportTask = function exportTask(gruntObj) {
    grunt = gruntObj;

    grunt.registerMultiTask('md5assets', 'Create symlinks by the md5 of asset files.', run);
  };

module.exports = exportTask;
