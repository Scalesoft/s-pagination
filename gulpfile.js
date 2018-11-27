const gulp = require('gulp');
const ts = require('gulp-typescript');
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

const tsResult = () => {
	const tsProject = ts.createProject('tsconfig.json');

	return tsProject.src()
		.pipe(sourcemaps.init())
		.pipe(tsProject().on('error', function () {
			process.exit(1)
		}))
};

gulp.task('build:ts:dts',
	() => tsResult().dts
		.pipe(concat(config.dtsBundle))
		.pipe(gulp.dest(config.dist))
);

gulp.task('build:ts:js',
	() => tsResult().js
		.pipe(concat(config.jsBundle))
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest(config.dist))
);

gulp.task('minify:js', () =>
	gulp.src(config.dist + '/' + config.jsBundle)
		.pipe(uglify())
		.pipe(rename({suffix: '.min'}))
		.pipe(gulp.dest(config.dist))
);

gulp.task('build:ts', gulp.parallel('lint:ts', 'build:ts:dts', 'build:ts:js'));

gulp.task('build:js', gulp.series('build:ts','minify:js'));

gulp.task('default', gulp.parallel('build:js', 'build:css'));
