"use strict";

const del = require('del');
const gulp = require('gulp');
const path = require('path');
const argv = require('yargs').argv;
const gutil = require('gulp-util');
const source = require('vinyl-source-stream');
const buffer = require('gulp-buffer');
const uglify = require('gulp-uglify');
const gulpif = require('gulp-if');
const exorcist = require('exorcist');
const babelify = require('babelify');
const browserify = require('browserify');
const sass = require('gulp-ruby-sass');

const PHPBB_PATH = '../phpBB/ext/florinp/messenger/styles/all/theme';

const SCRIPTS_PATH = PHPBB_PATH + '/js';
const SOURCE_PATH = './src';
const JS_ENTRY_FILE = SOURCE_PATH + '/app.js';
const JS_OUTPUT_FILE = 'chat.js';

const STYLES_PATH = PHPBB_PATH + '/css';
const SCSS_PATH = './scss';
const CSS_ENTRY_FILE = SCSS_PATH + '/chat.scss';
const CSS_OUTPUT_FILE = 'chat.css';

let keepFiles = false;

function isProduction() {
    return argv.production;
}

function logBuildMode() {
    if(isProduction()) {
        gutil.log(gutil.colors.green('Running production build...'));
    } else {
        gutil.log(gutil.colors.yellow('Running development build...'));
    }
}

function cleanBuildJS() {
    del([SCRIPTS_PATH + '/' + JS_OUTPUT_FILE]);
}

function cleanBuildCSS() {
    del([STYLES_PATH + '/' + CSS_OUTPUT_FILE]);
}

function buildJS() {
    let sourcemapPath = SCRIPTS_PATH + '/' + JS_OUTPUT_FILE + '.map';
    logBuildMode();

    return browserify({
        paths: [path.join(__dirname, 'src')],
        entries: JS_ENTRY_FILE,
        debug: true,
        transform: [
            [
                babelify, {
                    presets: ['es2015', 'react', 'stage-2']
                }
            ]
        ]
    })
    .transform(babelify)
    .bundle().on('error', (error) => {
        gutil.log(gutil.colors.red('[JS Build Error]', error.message));
        this.emit(end);
    })
    .pipe(gulpif(!isProduction(), exorcist(sourcemapPath)))
    .pipe(source(JS_OUTPUT_FILE))
    .pipe(buffer())
    .pipe(gulpif(isProduction(), uglify()))
    .pipe(gulp.dest(SCRIPTS_PATH));;
}

function buildCSS() {
    return sass(CSS_ENTRY_FILE)
        .on('error', (error) => {
            gutil.log(gutil.colors.red('[JS Build Error]', error.message));
            this.emit(end);
        })
        .pipe(gulp.dest(STYLES_PATH));
}

function serve() {
    gulp.watch(SOURCE_PATH + '/**/*.js', ['watch-js']);
    gulp.watch(SCSS_PATH + '/**/*.scss', ['watch-style']);
}

gulp.task('cleanBuildJS', cleanBuildJS);
gulp.task('cleanBuildCSS', cleanBuildCSS);
gulp.task('buildJS', ['cleanBuildJS'], buildJS);
gulp.task('buildCSS', ['cleanBuildCSS'], buildCSS);
gulp.task('serve', ['buildJS', 'buildCSS'], serve);
gulp.task('watch-js', ['buildJS']);
gulp.task('watch-style', ['buildCSS']);

gulp.task('default', ['serve']);
