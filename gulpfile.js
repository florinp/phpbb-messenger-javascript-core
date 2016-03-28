var gulp = require('gulp');
var browserify = require('gulp-browserify');
var concat = require('gulp-concat');
var sass = require('gulp-ruby-sass');
var uglify = require('gulp-uglify');


gulp.task('browserify', function() {
    gulp.src('src/app.js')
        .pipe(browserify({transform: 'reactify'}))
        .pipe(concat('chat.js'))
        .pipe(uglify())
        .pipe(gulp.dest('../phpBB/ext/florinp/messenger/styles/all/theme/js'))
});

gulp.task('browserify-no-uglify', function() {
    gulp.src('src/app.js')
        .pipe(browserify({transform: 'reactify'}))
        .pipe(concat('chat.js'))
        .pipe(gulp.dest('../phpBB/ext/florinp/messenger/styles/all/theme/js'))
});

gulp.task('sass', function() {
    return sass('scss/chat.scss')
        .on('error', sass.logError)
        .pipe(gulp.dest('../phpBB/ext/florinp/messenger/styles/all/theme/css'));
});

gulp.task('watch-style', function() {
    gulp.watch('scss/*.scss', ['sass']);
});
gulp.task('watch-src', function() {
    gulp.watch('src/**/*.*', ['browserify-no-uglify']);
});

gulp.task('watch', ['watch-src', 'watch-style']);
gulp.task('build', ['browserify', 'sass']);