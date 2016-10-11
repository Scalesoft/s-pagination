var gulp = require("gulp");
var ts = require("gulp-typescript");
var tsProject = ts.createProject("tsconfig.json");

gulp.task("build:css", function () {
    return gulp.src("src/css/pagination.css")
        .pipe(gulp.dest("dist"));
});

gulp.task("build:ts", function () {
    return tsProject.src()
        .pipe(tsProject())
        .js.pipe(gulp.dest("dist"));
});

gulp.task("build:dts", function () {
    return gulp.src("src/typings/pagination.d.ts")
        .pipe(gulp.dest("dist"));
});

gulp.task("default", ["build:ts", "build:dts", "build:css"]);