var path = require('path')
  , types  = { 'js': [ 'js' ]
             , 'css': [ 'css', 'map', 'less']
             , 'fonts': [ 'eot', 'svg', 'ttf', 'woff', 'woff2']
             }
  , _ = require('underscore')

require('shelljs/global')

function getTypeByExtension (source) {
  var ext = source.substring(source.lastIndexOf('.') + 1)
  for (var i in types) {
    if (types[i].indexOf(ext)!=-1)
      return i
  }
  return ext
}

module.exports = function(grunt) {
  grunt.initConfig({
    bower: {
      install: {
        options: {
          targetDir: './public',
          layout: function (type, component, source) {
            if (type === '__untyped__') {
              type = getTypeByExtension(source)
            }
            if (type == 'js')
              return path.join(type, 'vendor')
            else
              return path.join(type)
          }
        }
      }
    },
    nodewebkit: {
      options: {
        version: '0.12.0',
        platforms: ['win'],
        buildDir: './build'
      },
      src: ['./build-temp/**/*']
    }
  })

  grunt.loadNpmTasks('grunt-bower-task')
  grunt.loadNpmTasks('grunt-node-webkit-builder')

  grunt.registerTask('prepare', 'prepare for build', function () {
    mkdir('-p', 'build-temp')
    var to_copy = [ 'bin', 'data', 'lib', 'node_modules', 'public'
                  , 'routes', 'views', 'package.json', 'start.html'
                  , 'app.js'
                  ]

    for (var i in to_copy) {
      cp('-r', to_copy[i], 'build-temp')
    }

    var pac = require('./package.json')
      , dev = _.keys(pac.devDependencies)

    if (test('-e', 'build-temp')) {
      cd('build-temp/node_modules')
      rm('-r', dev)
    }
    else {
      console.log('run grunt prepare first')
    }
  })

  grunt.registerTask('clean', 'prepare for build', function () {
    rm('-r', 'build-temp')
  })

  grunt.registerTask('build', 'build app', function () {
    var validPlatforms = [ 'win', 'win32', 'win64'
                         , 'osx', 'osx32', 'osx64'
                         , 'linux', 'linux32', 'linux64'
                         ]
      , platforms
      , invalid

    if (grunt.option('platforms')) {
      platforms = grunt.option('platforms').split(',')
      invalid = _.difference(platforms, validPlatforms)
    }
    else {
      platforms = ['os', 'win']
      invalid = []
    }

    if (invalid.length > 0) {
      console.log('invalid platforms: ', invalid.join(', '))
    }
    else {
      grunt.config.set('nodewebkit.options.platforms', platforms)
      grunt.task.run('nodewebkit')
    }
  })

}
