const gulp = require('gulp');
const watch = require('gulp-watch');
const babel = require('gulp-babel');
const version = require('./package.json').version;

gulp.task('build', ()=>{
  gulp.src([
    'src/**/*.{js,jsx}'
  ])
  .pipe(
    babel({ presets: ['es2015','react']  })
  )
  .pipe(gulp.dest('dist'));

   gulp.src('src/**/*.{css,less}')
  .pipe(gulp.dest('dist'));

  gulp.src('src/**/*.{png,jpg,jpeg,gif}')
  .pipe(gulp.dest('dist'));
  
});

gulp.task('watch', function() {
  gulp.watch('src/*.{js,jsx,css,less}', ['build']);
});

gulp.task('default',['build']);
// //gulp.task('default', ['build', 'watch']);