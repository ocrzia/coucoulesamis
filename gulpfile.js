// ⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡
// 1. Déclaration des variables
// ⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡
var gulp          =     require('gulp');
var sass          =     require('gulp-sass')(require('sass'));
var rename        =     require('gulp-rename');
var sourcemaps    =     require('gulp-sourcemaps');
var autoprefixer  =     require('gulp-autoprefixer'); 
var browserSync   =     require('browser-sync').create();
var imagemin      =     require('gulp-imagemin');

// ⚡⚡⚡⚡⚡⚡
// 2. Mes tâches
// ⚡⚡⚡⚡⚡⚡

// La tâche pour s'occuper de nos fichiers .scss
gulp.task('sassification', function() {
  return gulp.src('dev/css/*.scss')
  .pipe(sourcemaps.init())
  .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
  .pipe(rename(function (path) {
    path.basename += ".min";
  }))
  .pipe(autoprefixer())
  .pipe(sourcemaps.write(''))
  .pipe(gulp.dest('prod/css'));
});

// La tâche pour s'occuper de nos fichiers .html
gulp.task('htmlification', function(){
  return gulp.src('dev/*.html')
  .pipe(gulp.dest('prod'));
})

// La tâche pour s'occuper de nos fichiers images
gulp.task('imgification', function(){
  return gulp.src('dev/img/*')
  .pipe(imagemin())
  .pipe(gulp.dest('prod/img'));
})

// La tâche pour s'occuper de nos fichiers .js
gulp.task('jsification', function(){
  return gulp.src('dev/js/*.js')
  .pipe(gulp.dest('prod/js'));
})

// La tâche pour le Go Live
gulp.task('browser-sync', function() {
  browserSync.init({
      server: {
          baseDir: "prod"
      }
  });
});

// ⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡
// 3. Exécution des tâches
// ⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡
gulp.task('observation', gulp.parallel('browser-sync','jsification','sassification', 'htmlification', 'imgification', function() {
  gulp.watch('dev/css/**/*.scss', gulp.series('sassification'));
  gulp.watch('dev/*.html', gulp.series('htmlification'));
  gulp.watch('dev/js/*.js', gulp.series('jsification'));
  gulp.watch('prod/**/*').on('change', browserSync.reload);
}));

gulp.task('default', gulp.series('observation'));