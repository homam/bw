const gulp = require('gulp');
const fs = require('fs');
const browserify = require('browserify');
const nodemon = require('gulp-nodemon');
const stylus = require('gulp-stylus');
const nib = require('nib');
const babelify = require('babelify');

gulp.task('build', ['build:scripts', 'build:styles']);


gulp.task('build:scripts', () => {
    browserify('./public/components/App.jsx')
        .transform(babelify, { presets: ['es2015', 'react', 'stage-2'] })
        .bundle()
        .pipe(fs.createWriteStream('./public/bundle.js'));
});


gulp.task('build:styles', () => {
    gulp.src(['./public/components/App.styl'])
        .pipe(stylus({ use: nib(), compress: true, 'include css': true }))
        .pipe(gulp.dest('./public/components'));
});


gulp.task('watch', () =>
    gulp.watch(['public/components/*.jsx', 'public/components/*.styl'], ['build'])
);


gulp.task('develop', () => {
    nodemon({
        script: './server.js',
        execMap: 'node',
    });
});


gulp.task('default', ['build', 'watch', 'develop']);
