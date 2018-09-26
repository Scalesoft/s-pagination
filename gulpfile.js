const gulp = require("gulp");
const ts = require("gulp-typescript");
const eventStream = require('event-stream');
const tsProject = ts.createProject("tsconfig.json");
const tslint = require("gulp-tslint");

gulp.task("build:css", () =>
    gulp.src("src/css/pagination.css")
        .pipe(gulp.dest("dist"))
);

gulp.task("lint:ts", () =>
    gulp.src("src/*.ts")
        .pipe(tslint({
            formatter: "verbose"
        }))
        .pipe(tslint.report())
);

gulp.task("build:ts", ["lint:ts"], () => {
    const tsResult = tsProject.src()
        .pipe(tsProject().on('error', function () { process.exit(1) }));

    return eventStream.merge(
        tsResult.dts.pipe(gulp.dest('dist')),
        tsResult.js.pipe(gulp.dest("dist"))
    );
});

gulp.task("default", ["build:ts", "build:css"]);
