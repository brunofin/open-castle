var project = require('./project.json'),
  gulp = require('gulp'),
  gutil = require('gulp-util'),
  sass = require('gulp-sass'),
  prettify = require('gulp-jsbeautifier'),
  closureCompiler = require('gulp-closure-compiler'),
  sourcemaps = require('gulp-sourcemaps'),
  angularFilesort = require('gulp-angular-filesort'),
  rename = require("gulp-rename"),
  clean = require('gulp-clean'),
  inject = require('gulp-inject');

gulp.task('default', ['fixjsstyle', 'fixscssstyle', 'fixhtmlstyle', 'inject-dependencies:debug'],
  function() {
    gutil.log('Watching source-code for changes...');

    gulp.watch([
      'src/' + project.jsSrcFolder + '/**/*.js', './*.js*', './.*rc',
      'src/' + project.scssSrcFolder + '/**/*.scss',
      'src/' + project.partialsSrcFolder + '/**/*.html',
      'src/*.html', "!src/index.html"
    ], function(event) {
      var path = event.path.substring(0, event.path.lastIndexOf('/')),
        filename = event.path.substring(event.path.lastIndexOf('/') + 1, event.path.length),
        extension = filename.substring(filename.lastIndexOf('.') + 1, filename.length),
        stream = gulp.src(event.path);

      if (event.type !== 'deleted') {
        stream = stream.pipe(prettify({
            config: '.jsbeautifyrc',
            mode: 'VERIFY_AND_WRITE'
          }))
          .pipe(gulp.dest(path));
      }

      switch (extension) {
        case 'scss':
          minifyScss(true);
          break;

        case 'js':
          if (event.path.lastIndexOf(project.jsSrcFolder) !== -1) {
            injectDependencies()
            break;
          }
      }

      return stream;
    });
  });

/* ####################### DEVELOPMENT TASKS ####################### */

/** Automatically formats EVERY JS file */
gulp.task('fixjsstyle', ['fixjsstyle:home'], function() {
  gutil.log('Formatting JavaScript source-code...');

  return gulp.src('src/' + project.jsSrcFolder + '/**/*.js')
    .pipe(prettify({
      config: '.jsbeautifyrc',
      mode: 'VERIFY_AND_WRITE'
    }))
    .pipe(gulp.dest('src/' + project.jsSrcFolder));
});

gulp.task('fixjsstyle:home', function() {
  gutil.log('Formatting JavaScript source-code...');

  return gulp.src(['./*.js*', './.*rc'])
    .pipe(prettify({
      config: '.jsbeautifyrc',
      mode: 'VERIFY_AND_WRITE'
    }))
    .pipe(gulp.dest('./'));
});

gulp.task('fixscssstyle', function() {
  gutil.log('Formatting SCSS source-code...');

  return gulp.src('src/' + project.scssSrcFolder + '/**/*.scss')
    .pipe(prettify({
      config: '.jsbeautifyrc',
      mode: 'VERIFY_AND_WRITE'
    }))
    .pipe(gulp.dest('src/' + project.scssSrcFolder));
});

gulp.task('fixhtmlstyle', function() {
  gutil.log('Formatting HTML source-code...');

  return gulp.src('src/' + project.partialsSrcFolder + '/**/*.html')
    .pipe(prettify({
      config: '.jsbeautifyrc',
      mode: 'VERIFY_AND_WRITE'
    }))
    .pipe(gulp.dest('src/' + project.partialsSrcFolder));
});

/* ####################### BUILD TASKS ####################### */

var minifyScss = function(debug) {
  if (debug === undefined) {
    debug = false
  }

  gutil.log('Generating CSS, debug: ' + debug);

  var stream = gulp.src((debug ? 'src/' : 'dist/') + project.scssSrcFolder + '/*.scss');

  if (debug) {
    stream = stream.pipe(sourcemaps.init());
  }

  stream = stream.pipe(sass({
    style: (debug ? 'expanded' : 'compressed')
  }).on('error', sass.logError));

  stream = stream.pipe(rename('styles.min.css'));

  if (debug) {
    stream = stream.pipe(sourcemaps.write('.'));
  }

  stream = stream.pipe(gulp.dest(debug ? 'src/' : 'dist/'));

  return stream;
}

gulp.task('minify-css:debug', function() {
  return minifyScss(true);
});

var minifyJs = function(debug) {
  if (debug === undefined) {
    debug = false
  }

  gutil.log('Generating JS, debug: ' + debug);
  var sources = project.jsLibs.map(function(lib) {
    return (debug ? 'src/' : 'dist/') + lib;
  }).concat((debug ? 'src/' : 'dist/') + project.jsSrcFolder + '/**/*.js');

  var compilerFlags = {
    compilation_level: "WHITESPACE_ONLY", // https://github.com/steida/gulp-closure-compiler/blob/master/flags.txt#L31
    logging_level: 'OFF', // https://docs.oracle.com/javase/7/docs/api/java/util/logging/Level.html
    summary_detail_level: 0, // https://github.com/steida/gulp-closure-compiler/blob/master/flags.txt#L259
    warning_level: 'QUIET', // https://github.com/steida/gulp-closure-compiler/blob/master/flags.txt#L295
    language_in: 'ECMASCRIPT6' // https://github.com/steida/gulp-closure-compiler/blob/master/flags.txt#L145
  }

  if (debug) {
    compilerFlags.create_source_map = 'dist/' + files.jsOutputName + '.map';
  }

  return gulp.src(sources)
    .pipe(closureCompiler({
      compilerPath: 'node_modules/google-closure-compiler/compiler.jar',
      fileName: (debug ? 'src/' : 'dist/') + project.jsOutputName,
      continueWithWarnings: true,
      compilerFlags: compilerFlags
    }))
    .pipe(gulp.dest('.'));
}

gulp.task('minify-js:debug', function() {
  return minifyJs(true);
});


var injectDependencies = function(debug) {
  if (debug === undefined) {
    debug = false
  }

  gutil.log('Injecting dependencies into index.html, debug: ' + debug);

  var target = gulp.src((debug ? 'src/' : 'dist/') + 'index.src.html');
  var sources = null;

  if (debug) {
    sources = gulp.src(project.jsLibs.map(function(lib) {
      return 'src/' + lib;
    }).concat('src/' + project.jsSrcFolder + '/**/*.js').concat('src/styles.min.css'));
  } else {
    sources = gulp.src(['dist/app.min.js', 'dist/styles.min.css']);
  }

  return target.pipe(rename('index.html'))
    .pipe(inject(sources, { // sources.pipe(angularFilesort())  TODO: <- must fix problem with modules within closures first
      relative: true
    }))
    .pipe(gulp.dest(debug ? 'src/' : 'dist/'));
}

gulp.task('inject-dependencies:debug', ['minify-css:debug'], function() {
  return injectDependencies(true);
})


gulp.task('prepare-deploy', function() {
  return gulp.src('src/**/*.*').pipe(gulp.dest('dist/'));
});

gulp.task('minify-css', ['prepare-deploy'], function() {
  return minifyScss();
});

gulp.task('minify-js', ['minify-css'], function() {
  return minifyJs();
});

gulp.task('inject-dependencies', ['minify-js'], function() {
  return injectDependencies();
})

gulp.task('clean', ['inject-dependencies'], function() {
  return gulp.src([
      'dist/bower_components',
      'dist/*.map',
      'dist/index.src.html',
      'dist/js',
      'dist/scss'
    ], {
      read: false
    })
    .pipe(clean());
});

gulp.task('deploy', ['clean'], function() {
  gutil.log('Deployed files to "./dist".');
});
