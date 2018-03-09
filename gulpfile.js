const gulp = require('gulp')
  ,uglify = require('gulp-uglify')
  ,cleanCSS = require('gulp-clean-css')
  ,rename = require('gulp-rename')
  ,autoprefixer = require('gulp-autoprefixer')
  ,imagemin = require('imagemin')
  ,pngquant = require('imagemin-pngquant')
  ,spritesmith = require('gulp.spritesmith')
  ,cache = require('gulp-cache')
  //,eslint = require('gulp-eslint')
  ,webpack = require("webpack")
  ,watch = require('gulp-watch')
 ,csso = require('gulp-csso')
 ,webp = require('gulp-webp');


// gulp.task('default',()=>{
//   console.log(111222333)
// })
//  return;

//  console.log(uglify);

//const wpk_config = require("./webpack.config.js");


// gulp.task('watch',()=>{
//   gulp.watch('src/scripts/*.js',['lint']);
// })


gulp.task('wpk',()=>{
  //webpack(wpk_config,()=>{});
})
gulp.task('lint',()=>{
  gulp.src(['src/scripts/*.js'])
  .pipe(eslint())
  .pipe(eslint.format())
  .pipe(eslint.failAfterError());
})

// gulp.task('watch',['src/scripts/*.js'],['webpack']);

// gulp.task('watch', function() {
//   gulp.watch('src/scripts/*.js', ['scripts']);
//   gulp.watch(paths.images, ['images']);
// });

gulp.task('cps', ()=>{
  
  // gulp.src('src/css/*.css')
  // .pipe(cleanCSS())
  // .pipe(gulp.dest('dist/css'));


  //main1.fsdf322.js
  // gulp.src('dist/scripts/*.js')
  // .pipe(uglify({
  //   // mangle: false,
  //   // compress: false,//false保留注释
  //   // preserveComments: 'all'//compress必须配合preserveComments：all？
  //   mangle: true,
  //   compress: true
  // }))
  // //ugliify 不能压缩未经过处理过的es6语法
  // //.on('error',function(e){console.log(e)}))
  // //.pipe(gulp.dest('dist/scripts'))
  // // .pipe(uglify({
  // //   mangle: true,
  // //   compress: true
  // // }))
  // //给后缀，但是正则没发匹配处不含后缀的文件，随意一旦生成它。。将会一直累加文件
  // //这个占时不弄了。。
  // // .pipe(rename({  
  // //  // prefix: 'min-'
  // //   suffix:'.min'
  // // }))
  // .pipe(gulp.dest('dist/scripts'));
  // 
  // 
  // =========================
  // 
  // 
  gulp.src('dist/scripts/*.js')
  .pipe(uglify({
    // mangle: false,
    // compress: false,//false保留注释
    // preserveComments: 'all'//compress必须配合preserveComments：all？
    mangle: true,
    compress: true
  }))
  //ugliify 不能压缩未经过处理过的es6语法
  //.on('error',function(e){console.log(e)}))
  //.pipe(gulp.dest('dist/scripts'))
  // .pipe(uglify({
  //   mangle: true,
  //   compress: true
  // }))
  //给后缀，但是正则没发匹配处不含后缀的文件，随意一旦生成它。。将会一直累加文件
  //这个占时不弄了。。
  // .pipe(rename({  
  //  // prefix: 'min-'
  //   suffix:'.min'
  // }))
  .pipe(gulp.dest('dist/scripts'));

});

 
//对png基本没压..
// gulp.task('img', function () {
//   gulp.src('src/img/*.{png,jpg,gif}')
//   .pipe(imagemin({
//       optimizationLevel: 7, 
//       progressive: true, 
//       // interlaced: true,
//   }))
//   .pipe(gulp.dest('dist/img'));
// });
// 

//这个压缩png的靠谱。。。
gulp.task('img', ()=>{
  //主要是png
  //console.log(imagemin,pngquant)
  //cache(
    // imagemin(['src/img/*.{png,jpg,jpeg,gif}'], 'dist/img', {use: [pngquant()]}).then(() => {
    //   //console.log('..98324782340392840');
    // })
  //)
  //
  // imagemin(['dist/img*.{png,jpg,jpeg,gif}'], 'dist/img', {use: [pngquant()]}).then(() => {
  //   console.log('..98324782340392840');
  // })
  // imagemin(['src/**/*.{png,jpg,jpeg,gif}'], 'src', {use: [pngquant()]}).then(() => {
  //   console.log('..2333333xxxxx...!!');
  // })
  //这里因为这个插件没法按照原项目结构输出到目录。。所以图片当作公共资源得了！
  imagemin(
    ['dist/img/*.{png,jpg,jpeg,gif}']
    ,'dist/img/'
    ,{use: [pngquant({quality:90})]}
  ).then(() => {
    console.log('imagemin:done!');
  })

});

gulp.task('webp',()=>{
  gulp.src('src/common/img/*.{png,jpg,jpeg,gif}')
    .pipe(webp())
    .pipe(gulp.dest('src/common/img/webp'));

})

// gulp.task('watch', function() {
//   console.log('watch...')
//   gulp.watch('src/**/*',['webp']);
// });


gulp.task('spe', ()=>{

  const spriteData = gulp.src('src/img/slice/*.{png,jpg,jpeg,gif}').pipe(spritesmith({
    imgName: 'sprite.png',
    cssName: 'sprite.css'
  }));

  spriteData.img
  .pipe(gulp.dest('dist/img'));

  spriteData.css
  .pipe(gulp.dest('dist/css'));


});

