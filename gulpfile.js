const gulp = require('gulp');
const fs = require('fs');
const browserify = require('browserify');
const nodemon = require('gulp-nodemon');
const stylus = require('gulp-stylus');
const nib = require('nib');
const babelify = require('babelify');
const flow = require('gulp-flowtype');
const runSequence = require('run-sequence');
const source = require('vinyl-source-stream');
const es = require('event-stream');

gulp.task('build', ['build:scripts', 'build:styles']);

gulp.task('typecheck', function() {
  return gulp.src(['./public/**/*.jsx', './public/**/*.jsx'])
    .pipe(flow({
        all: false,
        weak: false,
        // declarations: './declarations',
        killFlow: false,
        beep: true,
        abort: false
    }))
});

gulp.task('build:scripts', () => {
    const t1 = browserify('./public/components/App.jsx')
        .transform(babelify, { presets: ['es2015', 'react', 'stage-2'] })
        .bundle()
        .pipe(source('bundle.js'))
        .pipe(gulp.dest('./public'))
    const t2 = browserify('./public/sw.js')
        .transform(babelify, { presets: ['es2015', 'stage-2'] })
        .bundle()
        .pipe(source('sw-c.js'))
        .pipe(gulp.dest('./public'))

    return es.merge.apply(null, [t1, t2]);
});


gulp.task('build:styles', () => {
    gulp.src(['./public/components/App.styl'])
        .pipe(stylus({ use: nib(), compress: true, 'include css': true }))
        .pipe(gulp.dest('./public/components'));
});


gulp.task('watch', () => {
    return gulp.watch(['public/modules/*.js', 'public/components/*.jsx', 'public/components/*.styl'], ['build'])
});


gulp.task('develop', () => {
    nodemon({
        script: './server.js',
        execMap: 'babel-node',
        ignore: [
          'public/',
          'build/'
        ],
        tasks: files => {
          // console.log(files)
          const fs = files.filter(f => f.endsWith('/server.js'))
          return fs
        }
    });
});


gulp.task('default', runSequence('build', 'watch', 'develop'));
