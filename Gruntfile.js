var path = require('path')
  , types  = { 'js': [ 'js' ]
             , 'css': [ 'css', 'map', 'less']
             , 'fonts': [ 'eot', 'svg', 'ttf', 'woff', 'woff2']
             }

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
    }
  })

  grunt.loadNpmTasks('grunt-bower-task')

}