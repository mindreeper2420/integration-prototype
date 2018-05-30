var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();
var header = require('gulp-header');
var rename = require("gulp-rename");
var notify = require('gulp-notify');
var pkg = require('./package.json');
var cssmin = require('gulp-cssmin');
var postcss = require('gulp-postcss');

//
// Set the banner content
// remove this if you do not want banners automatically added to your compiled files
//
var banner = ['/*!\n',
  ' * Prototype Template - <%= pkg.title %> v<%= pkg.version %> (<%= pkg.homepage %>)\n',
  ' * Copyright 2018-' + (new Date()).getFullYear(), ' <%= pkg.author %>\n',
  ' */\n',
  ''
].join('');

gulp.task('lint-sass', function lintCssTask() {
  const gulpStylelint = require('gulp-stylelint');

  return gulp
    .src('sass/*.scss')
    .pipe(gulpStylelint({
      reporters: [
        {formatter: 'string', console: true}
      ]
    }));
});

gulp.task('sass', ['lint-sass'], function () {
  return gulp.src("sass/*.scss")
    .pipe(sass().on('error', sass.logError))
    .pipe(header(banner, {
      pkg: pkg
    }))
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest('css'))
    .pipe(browserSync.reload({
      stream: true
    }))
    .pipe(notify("CSS compiled")); // remove this line if you do not want notifications
});

// ensure sass finishes, reload browser
gulp.task('sass-watch', ['sass'], function (done) {
  browserSync.reload();
  done();
});

// Configure the browserSync task
gulp.task('browserSync', function () {
  browserSync.init({
    server: {
      baseDir: ''
    },
  })
});

// Dev task with browserSync
gulp.task('serve', ['sass'], function () {
  browserSync.init({
    server: {
      baseDir: "./"
    }
  });
  gulp.watch('sass/*.scss', ['sass-watch']);
  gulp.watch('*.html').on('change', browserSync.reload);
});

// Run everything
gulp.task('default', ['sass']);
