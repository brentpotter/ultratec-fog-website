var gulp           = require('gulp');
var browserSync    = require('browser-sync').create();
var sass           = require('gulp-sass');
var nunjucksRender = require('gulp-nunjucks-render');
var prettify       = require('gulp-prettify');

// Static Server + watching scss/html files
gulp.task('serve', ['sass'], function() {

  browserSync.init({
      server: "./build"
  });

  gulp.watch("src/scss/*.scss", ['sass']);
  gulp.watch(["src/pages/**/*.html", "src/templates/**/*.html"], ['nunjucks']);
  gulp.watch("build/*.html").on('change', browserSync.reload);
});

// Compile sass into CSS & auto-inject into browsers
gulp.task('sass', function() {
  return gulp.src("src/scss/*.scss")
    .pipe(sass())
    .pipe(gulp.dest("build/css"))
    .pipe(browserSync.stream());
});

// Compile nunjuck templates/pages into HTML files
gulp.task('nunjucks', function() {
  nunjucksRender.nunjucks.configure(['src/templates/'], {watch: false});
  return gulp.src('src/pages/**/*.html')
    .pipe(nunjucksRender())
    .pipe(prettify({indent_size: 2}))
    .pipe(gulp.dest('build'));
});

gulp.task('default', ['serve']);
