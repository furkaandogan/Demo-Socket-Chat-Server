const gulp = require("gulp");
const ts = require('gulp-typescript');
const typescript = require('typescript');
var merge = require('merge-stream');
var tsProject = ts.createProject('./tsconfig.json', { typescript: typescript });

gulp.task("build", function () {
    var js = gulp.src("./src/**/*.ts")
        .pipe(ts(tsProject))
        .pipe(gulp.dest('./publish/linux'));
    var package = gulp.src("./package.json")
        .pipe(gulp.dest('./publish/linux'));;
    var packageLock = gulp.src("./package-lock.json")
        .pipe(gulp.dest('./publish/linux'));;
    return merge(js, package, packageLock);
});

gulp.task("linux-cli", function () {
    var script = gulp.src("./linux-cli/**/*.sh")
        .pipe(gulp.dest("./publish/linux/scripts"));
    var makefile = gulp.src("./linux-cli/Makefile")
        .pipe(gulp.dest("./publish/linux/"));
    var docker = gulp.src("./docker/*")
        .pipe(gulp.dest("./publish/"));
    return merge(script, makefile, docker);
})

gulp.task("linux", ["build", "linux-cli"], function () {

});

gulp.task('watch', ['build'], function () {
    gulp.watch('./src/**/*.ts', ['scripts']);
});

gulp.task("default", ["linux"], function () {

});