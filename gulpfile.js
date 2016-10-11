var gulp = require("gulp");
var ts = require("gulp-typescript");
var eventStream = require('event-stream');
var tsProject = ts.createProject("tsconfig.json");

gulp.task("build:css", function () {
    return gulp.src("src/css/pagination.css")
        .pipe(gulp.dest("dist"));
});

gulp.task("build:ts", function () {
    var tsResult = tsProject.src()
        .pipe(tsProject());

    return eventStream.merge(
        tsResult.dts.pipe(gulp.dest('dist')),
        tsResult.js.pipe(gulp.dest("dist"))
    );
});

gulp.task("default", ["build:ts", "build:css"]);