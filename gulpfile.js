var gulp           = require('gulp');
var browserSync    = require('browser-sync').create();
var sass           = require('gulp-sass');
var nunjucksRender = require('gulp-nunjucks-render');
var prettify       = require('gulp-prettify');
var rsync          = require('gulp-rsync');
var clean          = require('gulp-clean');

// Static Server + watching scss/html files
gulp.task('serve', ['sass'], function() {

  browserSync.init({
      server: "./build"
  });

  gulp.watch("src/scss/**/*.scss", ['sass']);
  gulp.watch("src/js/**/*.js", ['copyjs']).on('change', browserSync.reload);
  gulp.watch(["src/pages/**/*.html", "src/templates/**/*.html"], ['nunjucks']);
  gulp.watch("build/*.html").on('change', browserSync.reload);
  gulp.watch("src/img/**/*", ['copyimg']).on('change', browserSync.reload);

});

// Compile sass into CSS & auto-inject into browsers
gulp.task('sass', function() {
  return gulp.src("src/scss/*.scss")
    .pipe(sass())
    .pipe(gulp.dest("build/css"))
    .pipe(browserSync.stream());
});

//Copy JS
gulp.task('copyjs', function() {
  gulp.src('src/js/**/*.js')
    .pipe(gulp.dest('build/js'));
});

//Copy Images
gulp.task('copyimg', function() {
  gulp.src('src/img/**/*')
    .pipe(gulp.dest('build/img'));
});

// Transfer files to server
gulp.task('rsync', function(){
  return gulp.src('build/**')
    .pipe(rsync({
      root: 'build',
      hostname: 'root@159.203.12.128',
      destination: '/var/www/ultratec/html',
    }));
});

// Clean directory
gulp.task('clean', function () {
  return gulp.src('build', {read: false})
    .pipe(clean());
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
