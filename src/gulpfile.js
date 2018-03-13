const gulp = require("gulp");
const ts = require('gulp-typescript');
const typescript = require('typescript');
var merge = require('merge-stream');
var tsProject = ts.createProject('./tsconfig.json', { typescript: typescript });

gulp.task("build", function () {
    var js = gulp.src("./**/*.ts")
        .pipe(ts(tsProject));
    return merge([
        js.js.pipe(gulp.dest('./dist'))
    ]);
});

gulp.task('watch', ['build'], function () {
    gulp.watch('./**/*.ts', ['build']);
});

gulp.task('docker-container-watch', ['build'], function () {
    gulp.watch('./**/*.ts', ['build']);
});

gulp.task("default", ["build"], function () {

});