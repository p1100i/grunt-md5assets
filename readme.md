# grunt-md5symlink

> Create symlink by the md5 of given files.

## About
With this grunt task, you can create symlinks with the md5 value of a given file in their name.

Personally I've needed this, to allow browsers to cache served assets (.js/.css) files for long time, as the generated name changes when the content of the source file changes. To achieve this you can use the [grunt-symlinkassets][symlinkassets], however I've thought they are useful separately also.

## Install
To install as npm package and put it into your package.json:
```shell
npm install grunt-md5symlink --save-dev
```

To load/use it inside the Gruntfile.js:

```js
// With this config, grunt-md5symlink will iterate through all files of build/production
// and for those having .js or .css extension, a symlink will be created. The name
// of the symlink will be the original suffixed with the md5 of the original file and its
// extension. E.g.: app.js => app-<md5-of-app.js>.js

grunt.initConfig({
  'md5symlink' : {
    'options' : {
      'extensions' : ['.js', '.css']
    },

    'minified' : {
      'src'   : 'build/production/**/*',
      'dest'  : 'build/production'
    }
  }
});

grunt.loadNpmTasks('grunt-md5symlink');
```

## Options
### extensions
Type: `Array`

Default: `[]`

Symlinks will be created for files only having on of the extensions.

### patterns
Type: `Array`

Default: `[]`

Symlinks will be created for files having a substring in their path that matches a pattern.

## License
[MIT License][git-LICENSE]

[git-LICENSE]   : LICENSE
[symlinkassets] : https://github.com/p1100i/grunt-symlinkassets
