/* eslint amd:true */

require('dotenv').config();

const port = process.env.PORT;
const gulp = require('gulp');
const plugins = require('gulp-load-plugins')();
const browserSync = require('browser-sync');

const src = {
  scss: './public/css/common.scss'
};

const out = {
  css: './public/css/'
};

gulp.task('sass', () => {
  gulp.src(src.scss)
    .pipe(plugins.sass())
    .pipe(gulp.dest(out.css));
});

gulp.task('lint', () => {
  const jsFilter = plugins.filter(['gulpfile.js', 'public/js/**/*.js', 'test/**/*.js', 'app/**/*.js']);
  gulp.src('./**/*.js')
  .pipe(jsFilter)
  .pipe(plugins.eslint())
  .pipe(plugins.eslint.format());
});

gulp.task('nodemon', () => {
  plugins.nodemon({
    script: 'server.js',
    ext: 'js',
    env: { NODE_ENV: 'development' }
  });
});

gulp.task('pre-test', () => {
  gulp.src(['test/**/*.js'])
    .pipe(plugins.istanbul({ includeUntested: true }))
    .pipe(plugins.istanbul.hookRequire());
});

gulp.task('mochaTest', ['pre-test'], () => {
  gulp.src(['./test/**/*.js'], { read: false })
    .pipe(plugins.mocha({ reporter: 'spec' }))
    .pipe(plugins.istanbul.writeReports({
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
  plugins.bower('./bower_components')
    .pipe(gulp.dest('./public/lib'));
});

gulp.task('serve', ['nodemon'], () => {
  browserSync({
    proxy: `localhost:${port}`,
    port: 5000,
    ui: {
      port: 5001
    },
    reloadOnRestart: true
  });
});

gulp.task('watch', () => {
  gulp.watch('app/views/**', browserSync.reload);
  gulp.watch(['public/js/**', 'app/**/*.js'], browserSync.reload);
  gulp.watch('public/views/**', browserSync.reload);
  gulp.watch(src.scss, ['sass']);
  gulp.watch('public/css/**', browserSync.reload);
});

gulp.task('default', ['watch', 'serve', 'lint']);
