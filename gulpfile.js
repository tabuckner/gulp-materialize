const gulp = require('gulp'),
	sass = require('gulp-sass'),
	autoprefixer = require('gulp-autoprefixer'),
	cleanCSS = require('gulp-clean-css'),
	pug = require('gulp-pug'),
	htmlreplace = require('gulp-html-replace'),
	browserSync = require('browser-sync'),
	browserify = require('browserify'),
	babelify = require('babelify'),
	eslint = require('gulp-eslint'),
	sourcemaps = require('gulp-sourcemaps'),
	uglify = require('gulp-uglify'),
	imagemin = require('gulp-imagemin'),
	runSequence = require('run-sequence').use(gulp),
	source = require('vinyl-source-stream'),
	buffer = require('vinyl-buffer'),
	rename = require('gulp-rename'),
	concat = require('gulp-concat'),
	merge = require('gulp-merge'),
	del = require('del'),
	cache = require('gulp-cache');

let allInDir = '/**/*',
	srcDirs = {
		js: {
			app: 'app/src/js/',
			vendor: 'app/src/js/vendor/',
		},
		view: ['app/src/views/*.pug', '!app/src/views/_*.pug'],
		scss: 'app/src/scss/',
		fonts: 'app/src/fonts/'
	},
	srcFileNames = {
		js: 'main.js',
	},
	buildDirs = {
		js: 'app/build/js',
		css: 'app/build/css',
		img: 'app/build/img',
		html: 'app/build'
	},
	buildFileNames = {
		js: 'bundle.js',
		vendorJs: 'vendor.js'
	},
	distFileNames = {
		css: 'styles.min.css',
		js: 'app.min.js',
	},
	pathReplacements = {
		css: 'css/styles.min.css',
		js: 'js/app.min.js'
	},
	distDirs = {
		root: 'dist',
		css: './dist/css',
		js: 'dist/js',
		img: 'dist/img/',
		fonts: 'dist/fonts',

	},
	vendorMergeFiles = [ // IN ORDER!
		'app/src/js/vendor/jquery-3.3.1.min.js',
		'app/src/js/vendor/materialize.js'
	],
	jsFILES = [buildFileNames.js, buildFileNames.vendorJs];


/**
 * HTML Tasks
 */
gulp.task('views', function buildHTML() {
	return gulp.src(srcDirs.view)
		.pipe(pug({
			pretty: true,
		}))
		.on('error', console.error.bind(console))
		.pipe(gulp.dest(buildDirs.html))
		.pipe(browserSync.reload({
			stream: true
		}))
});

// Corrects file paths in HTML files for production.
gulp.task('html-replace', () => {
	return gulp.src(buildDirs.html + allInDir + '.html')
		.pipe(htmlreplace({
			'css': pathReplacements.css,
			'js': pathReplacements.js,

		}))
		.pipe(gulp.dest(distDirs.root))
})

/**
 * Style Tasks
 */
gulp.task('sass', function () {
	return gulp.src(srcDirs.scss + allInDir + '.scss') //Source all files ending with.scss in scss directory and its subdirectories
		.pipe(sass())
		.on('error', console.error.bind(console))
		.pipe(autoprefixer({
			browsers: ['last 2 versions'],
			cascade: false
		}))
		.pipe(gulp.dest(buildDirs.css))
		.pipe(browserSync.reload({
			stream: true
		}))
});

gulp.task('css', () => {
	return gulp.src(buildDirs.css + allInDir + '.css')
		.pipe(sourcemaps.init())
		.pipe(cleanCSS({ debug: true }, (details) => {
			console.log(`${details.name} Reduced: ${details.stats.minifiedSize / details.stats.originalSize * 100}%`);
		}))
		.pipe(concat(distFileNames.css))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest(distDirs.css))
});

/**
 * JavaScript Tasks
 */
// Converts ES6 to browser-ready JS w/ ENV Preset.
gulp.task('babel', () => { // Converts es6 to browser ready
	return browserify({
		entries: [srcDirs.js.app + srcFileNames.js],
		debug: true,
	})
		.transform(babelify, { presets: ['env'] }) // babelify
		.bundle() // bundle
		.pipe(source(buildFileNames.js)) // grab viny stream
		.pipe(buffer()) // buffer the stream
		.pipe(gulp.dest(buildDirs.js)) // pipe to app/build/js
});

// Merges jQuery and Materialize JS libs in correct order
gulp.task('vendor', () => {
	return merge(
		gulp.src(vendorMergeFiles)
			.pipe(concat(buildFileNames.vendorJs))
			.pipe(gulp.dest(buildDirs.js)) // Drops in build DIR
	);
})

// Lints non-vendor JS w/ AirBnB Preset
gulp.task('lint', () => {
	return gulp.src([
		srcDirs.js.app + allInDir + '.js',
		'!' + srcDirs.js.vendor + allInDir + '.js'
	])
		.pipe(eslint())
		.pipe(eslint.format())
		.pipe(eslint.failAfterError());
});

// JS Bundle Task
gulp.task('bundle', ['babel'], () => {
	return gulp.src([
		buildDirs.js + buildFileNames.vendorJs,
		buildDirs.js + buildFileNames.js
	])
		.pipe(buffer())
		.pipe(sourcemaps.init({ loadMaps: true }))
		.pipe(concat(distFileNames.js))
		.pipe(uglify())
		.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest(distDirs.js));
});

// JS Build Task
gulp.task('js', () => {
	jsFILES.map((entry) => {
		return browserify({ entries: [buildDirs.js + '/' + entry] }) // Browserfy start
			.transform(babelify, { presets: ['env'] }) // babelify
			.bundle() // bundle
			.pipe(source(entry)) // grab the source?
			.pipe(rename({ extname: '.min.js' })) // rename it
			.pipe(buffer()) // must grab a buffer ??
			.pipe(sourcemaps.init({ loadMaps: true })) // init sourcemapping
			.pipe(uglify()) // uglify
			.pipe(sourcemaps.write('./')) // write sourcemap in current dir
			.pipe(gulp.dest(distDirs.js)) // pipe to dest
	});
})

/**
 * Image Tasks
 */
gulp.task('imagemin', function () {
	return gulp.src('app/src/img/**/*.+(png|jpg|gif|swg|svg)')
		.pipe(cache(imagemin({
			gif: {
				interlaced: true
			}
		})))
		.pipe(gulp.dest(buildDirs.img))
});

gulp.task('images', () => {
	return gulp.src(buildDirs.img + allInDir)
		.pipe(gulp.dest(distDirs.img));
});

/**
 * Font Tasks
 */
gulp.task('fonts', function () { // TODO: Test dest filepaths
	return gulp.src(srcDirs.fonts + allInDir)
		.pipe(gulp.dest(distDirs.fonts))
});

/**
 * Cleanup Tasks
 */
gulp.task('clean:dist', function () {
	return del.sync([distDirs.root + allInDir]);
});

gulp.task('clean:app', () => {
	return del.sync(['app/**/*', '!app/src', '!app/src/**/*']); // Leave as is. No vars.
});

/**
 * Default & Watch Tasks
 */
gulp.task('default', function (callback) {
	runSequence('watch',
		['sass', 'vendor', 'babel', 'views', 'browserSync', 'imagemin'],
		callback
	);
});

gulp.task('watch', function () {
	gulp.watch('app/src/scss/**/*.scss', ['sass']); // Watch SCSS Src files and build
	gulp.watch('app/src/views/**/*.pug', ['views']); // Watch Pug Files and build
	gulp.watch('app/src/js/**/*.js', ['lint', 'babel']); // Watch JS Src files and build
	gulp.watch('app/src/img', ['imagemin', browserSync.reload]);
	gulp.watch('app/build/**/*', browserSync.reload); // Reload when anything is changed in Build
});

gulp.task('browserSync', function () {
	browserSync.init({
		server: {
			baseDir: 'app/build' // TODO: Find out if this breaks by changing to app/build
		}
	});
});

/**
 * Build Tasks
 */
gulp.task('build', function (callback) {
	runSequence('clean:dist',
		'views', 'sass',
		'css', 'js', 'html-replace', 'images', 'fonts',
		'clean:app',
		callback);
});

gulp.task('build:prod', function (callback) {
	runSequence('clean:dist',
		'views', 'sass', 'vendor', 'css', 'bundle',
		'html-replace', 'imagemin', 'images', 'fonts',
		'clean:app',
		callback);
});
