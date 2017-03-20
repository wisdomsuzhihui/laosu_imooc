module.exports = function (grunt) {

  grunt.initConfig({
    watch: {
      jade: {
        files: ['views/**'],
        options: {
          livereload: true
        }
      },
      js: {
        files: ['public/js/**', 'models/**/*.js', 'schemas/**/*.js'],
        // tasks: ['jshint'],
        options: {
          livereload: true
        }
      }
    },

    nodemon: {
      dev: {
        options: {
          file: 'app.js',
          args: [],
          ignoredFiles: ['README.md', 'node_modules/**', '.DS_Store'],
          watchedExtensions: ['js'],
          watchedFolders: ['app', 'config'],
          debug: true,
          delayTime: 1,
          env: {
            PORT: 3000
          },
          cwd: __dirname
        }
      }
    },

    concurrent: {
      tasks: ['nodemon', 'watch'],
      options: {
        logConcurrentOutput: true
      }
    }

  })

  grunt.loadNpmTasks('grunt-contrib-watch') // 监控
  grunt.loadNpmTasks('grunt-nodemon') // 重启app.js 入口文件
  grunt.loadNpmTasks('grunt-concurrent') // 跑‘慢任务' 如：sass,less，jade ... 要编译的

  // 防止因报错中断服务
  grunt.option('force', true)
  grunt.registerTask('default', ['concurrent'])

}