require('dotenv').config();
var port = process.env.PORT;
var gulp = require('gulp');
var mocha = require('gulp-mocha');
var nodemon = require('gulp-nodemon');
var sequence = require('run-sequence');
var bower = require('gulp-bower');
var browserSync = require('browser-sync');
var istanbul = require('gulp-istanbul');
var jshint = require('gulp-jshint');
var filter = require('gulp-filter');

var plugins = require('gulp-load-plugins')();

var src = {
  scss: './public/css/common.scss'
};

var out = { 
  css: './public/css/'
};

gulp.task('sass', function(){
  return gulp.src(src.scss)
    .pipe(plugins.sass())
    .pipe(gulp.dest(out.css));
});   

gulp.task('nodemon', function () {
  nodemon({
    script: 'server.js',
    ext: 'js',
    env: { 'NODE_ENV': 'development' }
  });
});

gulp.task('pre-test',function(){
  return gulp.src(['test/**/*.js'])
    .pipe(istanbul({includeUntested: true}))
    .pipe(istanbul.hookRequire());
});


gulp.task('mochaTest',['pre-test'],function(){
  return gulp.src(['./test/**/*.js'],{read: false})
    .pipe(mocha({reporter: 'spec'}))
    .pipe(istanbul.writeReports({
      dir: './coverage',
      reporters: [ 'lcov' ],
      reportOpts: { dir: './coverage' },
    }))
    .once('error', function() {
      process.exit(1);
    })
    .once('end', function() {
      process.exit();
    });
});

gulp.task('bower', function() {
  return bower('./bower_components')
    .pipe(gulp.dest('./public/lib'));
});

gulp.task('serve', ['nodemon'], function(){
  browserSync({
    proxy: 'localhost:' + port,
    port: 5000,
    ui: {
      port: 5001
    },
    reloadOnRestart: true
  });
});

gulp.task('watch', function(){
  gulp.watch('app/views/**', browserSync.reload);
  gulp.watch(['public/js/**', 'app/**/*.js'], browserSync.reload);
  gulp.watch('public/views/**', browserSync.reload);
  gulp.watch(src.scss, ['sass']);
  gulp.watch('public/css/**', browserSync.reload); 
});

gulp.task('default', ['watch', 'serve']);

gulp.task('lint',function(){
  var jsFilter = filter(['gulpfile.js', 'public/js/**/*.js',
   'test/**/*.js', 'app/**/*.js']);
  return gulp.src('./**/*.js')
  .pipe(jsFilter)
  .pipe(jshint());
});