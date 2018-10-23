var gulp = require('gulp');
var autoprefixer = require('autoprefixer');
var browserSync = require('browser-sync').create();
var cssnano = require('cssnano');
var header = require('gulp-header');
var postcss = require('gulp-postcss');
var pkg = require('./package.json');
var plumber = require('gulp-plumber');
var pug = require('gulp-pug');
var rename = require("gulp-rename");
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');

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

gulp.task('copy-fonts', function () {
  return gulp.src("assets/fonts/**")
    .pipe(gulp.dest('css/assets/fonts'))
    .pipe(browserSync.reload({
      stream: true
    }));
});

gulp.task('lint-sass', function lintCssTask() {
  const gulpStylelint = require('gulp-stylelint');

  return gulp
    .src('sass/*.scss')
    .pipe(gulpStylelint({
      reporters: [
        { formatter: 'string', console: true }
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
    }));
});

// ensure sass finishes, reload browser
gulp.task('sass-watch', ['sass'], function (done) {
  browserSync.reload();
  done();
});

// compile custom javascript file
gulp.task('js', function () {
  return gulp.src("dev/js/*.js")
    .pipe(header(banner, { pkg: pkg }))
    .pipe(gulp.dest('js'))
    .pipe(browserSync.reload({
      stream: true
    }));
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
    },
    reloadOnRestart: true,
    notify: false // prevent the browserSync notification from appearing
  });
  gulp.watch('assets/fonts/**', ['copy-fonts']);
  gulp.watch('sass/*.scss', ['sass-watch']);
  gulp.watch('dev/js/*.js', ['js']);
  gulp.watch('*.html').on('change', browserSync.reload);
});

// Run everything
gulp.task('default', ['copy-fonts', 'sass', 'js']);
