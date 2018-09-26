const gulp = require('gulp');
const ts = require('gulp-typescript');
const eventStream = require('event-stream');
const tsProject = ts.createProject('tsconfig.json');
const tslint = require('gulp-tslint');
const concat = require('gulp-concat');
const sourcemaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');

const config = {
    tsSourceGlob: 'src/*.ts',
    cssSourceGlob: 'src/css/pagination.css',
    jsBundle: 'pagination.js',
    jsMinBundle: 'pagination.min.js',
    dtsBundle: 'pagination.d.ts',
    dist: 'dist',
};

gulp.task('build:css', () =>
    gulp.src(config.cssSourceGlob)
        .pipe(gulp.dest(config.dist))
);

gulp.task('lint:ts', () =>
    gulp.src(config.tsSourceGlob)
        .pipe(tslint({
            formatter: 'verbose'
        }))
        .pipe(tslint.report())
);

gulp.task('build:ts', ['lint:ts'], () => {
    const tsResult = tsProject.src()
        .pipe(sourcemaps.init())
        .pipe(tsProject().on('error', function () { process.exit(1) }))
        ;

    return eventStream.merge(
        tsResult.dts
            .pipe(concat(config.dtsBundle))
            .pipe(gulp.dest(config.dist)),
        tsResult.js
            .pipe(concat(config.jsBundle))
            .pipe(sourcemaps.write('.'))
            .pipe(gulp.dest(config.dist))
    );
});

gulp.task('minify:js', ['build:ts'], () =>
    gulp.src(config.dist + '/' + config.jsBundle)
        .pipe(uglify())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest(config.dist))
);

gulp.task('default', ['minify:js', 'build:css']);
