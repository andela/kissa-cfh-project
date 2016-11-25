/* eslint amd:true */
const gulp = require('gulp');
const mocha = require('gulp-mocha');
const nodemon = require('gulp-nodemon');
const bower = require('gulp-bower');
const browserSync = require('browser-sync');
const istanbul = require('gulp-istanbul');
const eslint = require('gulp-eslint');
const filter = require('gulp-filter');
const plugins = require('gulp-load-plugins')();
require('dotenv').config();

const port = process.env.PORT;

const src = {
  scss: './public/css/common.scss'
};

const out = {
  css: './public/css/'
};

gulp.task('sass', () => {
  return gulp.src(src.scss)
    .pipe(plugins.sass())
    .pipe(gulp.dest(out.css));
});

gulp.task('watch', () => {
  gulp.watch('app/views/**', browserSync.reload);
  gulp.watch(['public/js/**', 'app/**/*.js'], browserSync.reload);
  gulp.watch('public/views/**', browserSync.reload);
  gulp.watch(src.sass, ['sass']);
  gulp.watch('public/css/**', browserSync.reload);
});

gulp.task('nodemon', () => {
  nodemon({
    script: 'server.js',
    ext: 'js',
    env: { NODE_ENV: 'development' }
  });
});

gulp.task('pre-test', () => {
  return gulp.src(['test/**/*.js'])
  .pipe(istanbul({ includeUntested: true }))
  .pipe(istanbul.hookRequire());
});


gulp.task('mochaTest', ['pre-test'], () => {
  return gulp.src(['./test/**/*.js'],
    {
      read: false
    })
  .pipe(mocha({ reporter: 'spec' }))
  .pipe(istanbul.writeReports({
    dir: './coverage',
    reporters: ['lcov'],
    reportOpts: { dir: './coverage' },
  }))
  .once('error', () => {
    process.exit(1);
  })
  .once('end', () => {
    process.exit();
  });
});

gulp.task('bower', () => {
  return bower({
    cmd: 'install',
    directory: './public/lib',
    verbosity: 2
  });
});

gulp.task('serve', ['build', 'watch'], () => {
  browserSync({
    proxy: `localhost:${port}`,
    port: 5000,
    ui: {
      port: 5001
    },
    reloadOnRestart: true
  });
});

gulp.task('default', ['serve']);

gulp.task('build', ['sass', 'nodemon', 'bower']);

gulp.task('lint', () => {
  const jsFilter = filter(['gulpfile.js', 'public/js/**/*.js',
    'test/**/*.js', 'app/**/*.js', 'public/lib/**/*.js']);
  return gulp.src('./**/*.js')
  .pipe(jsFilter)
  .pipe(eslint())
  .pipe(eslint.format());
});
