
var gulp = require('gulp');
var sass = require('gulp-sass');
// var watch = require('gulp-watch');
var minifycss = require('gulp-minify-css'),
browserSync = require('browser-sync').create();
clean = require('gulp-clean');
var webpack = require('gulp-webpack');
var webpackConfig = require('./webpack');
gulp.task('default', ['clean', 'watch', 'sass', 'webpack','browser-sync']);
gulp.task('sass:watch', function() {
  gulp.watch('../public/css/**.scss', ['sass']);
});
// gulp.task('font', function() {
//   gulp.src('../public/font/*.+(eot|svg|ttf|woff)').pipe(gulp.dest('../public/build/pages'));
// });

// 浏览器自动刷新功能
gulp.task('browser-sync', function() {
    browserSync.init({
        proxy: "0.0.0.0:3000"  // 代理到服务器
    });
    gulp.watch('../public/template/*.html').on('change', browserSync.reload);
    gulp.watch('../public/template/**/*.html').on('change', browserSync.reload);
});
// sass文件编译
gulp.task('sass', function() {
  gulp.src(['../public/css/main.scss']).pipe(sass.sync().on('error', sass.logError)).pipe(minifycss()).pipe(gulp.dest(
    '../public/build/pages'));
});
// 清除
gulp.task('clean', function() {
  return gulp.src('../public/build/pages/*', {
    read: false
  }).pipe(clean({force: true}));
});
// 引用webpack打包
gulp.task('webpack', function() {
  return gulp.src(['../public/js/']).pipe(webpack(webpackConfig))
    .pipe(gulp.dest('../public/build/pages'));
});
// 监听
gulp.task('watch', function() {
  gulp.watch('../public/css/**.scss', ['sass']).on('change', browserSync.reload);
  // gulp.watch(['../public/*.js','!../public/libs/','!../public/build/'], ['webpack']);
  gulp.watch(['../public/js/**/*.js','!../public/libs/','!../public/build/'], ['webpack']).on('change', browserSync.reload);
  gulp.watch(['../public/js/**/**/*.js','!../public/libs/','!../public/build/'], ['webpack']).on('change', browserSync.reload);
});
