const gulp = require("gulp");
const ts = require('gulp-typescript');
const typescript = require('typescript');
var tsProject = ts.createProject('./tsconfig.json', { typescript: typescript });

gulp.task("build", function () {
    return gulp.src("./src/**/*.ts")
        .pipe(ts(tsProject))
        .pipe(gulp.dest('./build'));
});

gulp.task('watch', ['build'], function () {
    gulp.watch('./src/**/*.ts', ['scripts']);
});

gulp.task("default", ["build"], function () {

});