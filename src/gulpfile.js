'use strict';

var gulp = require('gulp');
var del = require('del');
var concat = require('gulp-concat');
var gulpInject = require('gulp-inject');
var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');
var nodemon = require('gulp-nodemon');
var livereload = require('gulp-livereload');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var Server = require('karma').Server;
var svgSprite = require('gulp-svg-sprite');
var svgmin = require('gulp-svgmin');
var autoprefixer = require('gulp-autoprefixer');
var templateCache = require('gulp-angular-templatecache');
var RevAll = require('gulp-rev-all');
var path = require('path');
var child_process = require('child_process');

var paths = {
  root: '.',
  build: 'build',
  server: 'server',
  app: 'wwwroot',
  lib: 'wwwroot/lib',
  styles: 'wwwroot/styles',
  tmp: 'tmp',
  tmpStyles: 'wwwroot/tmp', // Where SASS result is stored. By the moment it is useful for development environment and also as an auxiliar on build
  tmpPrebuild: 'tmp/prebuild', // Temporary place of built files before add revision to filename
  fonts: 'wwwroot/icons/',
  testsE2E: [
    'spec/**/*_spec.js'
  ]
};

/**
 * Cleans build directory before creating a new build.
 * Relies on: "del".
 */
gulp.task('clean', function (callback) {
  del([
    paths.build,
    paths.tmp,
    paths.tmpStyles
  ], callback);
});

/**
 * Ensures the code is beautiful.
 * Relies on "gulp-jshint".
 */
gulp.task('lint', function () {
  return gulp.src([
    paths.app + '/**/*.js',
    '!' + paths.lib + '/**/*.js'
  ])
  .pipe(jshint())
  .pipe(jshint.reporter('default'));
});

/**
 * Concatenates lib scripts and generates a ready-for-production bundle.
 * Relies on: "gulp-concat".
 */
gulp.task('build-scripts-lib', function () {
  // When you update it, please remember to edit karma.conf.js and index.html
  // TODO: remove this duplicated code
  return gulp.src([
    paths.lib + '/angular/angular.min.js',
    paths.lib + '/angular-route/angular-route.min.js',
    paths.lib + '/angular-sanitize/angular-sanitize.min.js',
    paths.lib + '/angular-translate/angular-translate.min.js',
    paths.lib + '/angular-translate-loader-static-files/angular-translate-loader-static-files.min.js',
    paths.lib + '/c3/c3.min.js',
    paths.lib + '/d3/d3.min.js',
    paths.lib + '/angular-animate/angular-animate.min.js',
    paths.lib + '/angular-jwt/dist/angular-jwt.js',
    paths.lib + '/svgxuse/svgxuse.js',
    paths.lib + '/autofill-directive/autofill-directive.js',
    paths.lib + '/angular-modal-service/dst/angular-modal-service.min.js',
    paths.lib + '/angular-click-outside/clickoutside.directive.js',
    paths.lib + '/angular-scroll/angular-scroll.min.js',
    paths.lib + '/jquery/dist/jquery.min.js',
    paths.lib + '/moment/min/moment.min.js',
    paths.lib + '/angular-moment/angular-moment.js',
    paths.lib + '/bootstrap-daterangepicker/daterangepicker.js',
    paths.lib + '/angular-daterangepicker/js/angular-daterangepicker.min.js',
    paths.lib + '/angular-ui-select/dist/select.min.js',
    paths.lib + '/angular-ui-mask/dist/mask.min.js',
    paths.lib + '/angular-slugify/angular-slugify.js',
    paths.lib + '/angular-tooltips/dist/angular-tooltips.min.js',
    paths.lib + '/clipboard/dist/clipboard.min.js',
    paths.lib + '/angularjs-slider/dist/rzslider.min.js',
    paths.lib + '/angular-recaptcha/release/angular-recaptcha.min.js'
  ])
  .pipe(concat('lib.min.js'))
  .pipe(gulp.dest(paths.tmpPrebuild + '/scripts'));
});

/**
 * Uglify and concatenates app scripts.
 * Relies on: "gulp-uglify", "gulp-concat".
 */
gulp.task('build-scripts-app', function () {
  // When you update it, please remember to edit karma.conf.js and index.html
  // TODO: remove this duplicated code
  return gulp.src([
    '!' + paths.app + '/**/*.spec.js',
    paths.app + '/polyfills/**/*.js',
    paths.app + '/app.js',
    paths.app + '/controllers/**/*.js',
    paths.app + '/interceptors/*.js',
    paths.app + '/directives/*.js',
    paths.app + '/filters/*.js',
    paths.app + '/services/**/*.js',
    paths.app + '/lists/*.js',
    paths.app + '/*.js',
    paths.app + '/env/' + process.env.NODE_ENV + '.js'
  ])
  .pipe(concat('app.min.js'))
  .pipe(uglify({
    mangle: false
  }))
  .pipe(gulp.dest(paths.tmpPrebuild + '/scripts'));
});

/**
 * Uglify and concatenates scripts in building process.
 */
gulp.task('build-scripts', [
  'build-scripts-lib',
  'build-scripts-app'
]);
/**
 * Creates a svg sprite using the .svg files.
 * Relies on: "gulp-svg-sprite" and "gulp-rename".
 */
gulp.task('svg-sprite', function () {
  return gulp.src(paths.app + '/images/svg/*.svg')
    .pipe(svgmin())
    .pipe(svgSprite({
      shape: {
        id: {
          generator: 'doppler-icon-%s'
        },
        dimension: {
          maxWidth: 24,
          maxHeight: 24,
          attributes: true
        }
      },
      mode: {
        symbol: true
      }
    }).on('error', function (error) {
      console.log(error);
    }))
    .pipe(rename('sprite.svg'))
    .pipe(gulp.dest(paths.tmpPrebuild + '/images'));
});

gulp.task('svg-sprite-development', function () {
  return gulp.src(paths.app + '/images/svg/*.svg')
    .pipe(svgmin())
    .pipe(svgSprite({
      shape: {
        id: {
          generator: 'doppler-icon-%s'
        },
        dimension: {
          maxWidth: 24,
          maxHeight: 24,
          attributes: true
        }
      },
      mode: {
        symbol: true
      }
    }).on('error', function (error) {
      console.log(error);
    }))
    .pipe(rename('sprite.svg'))
    .pipe(gulp.dest(paths.app + '/images'));
});

/**
 * Compile sass files to css.
 * Relies on: "gulp-sass".
 */
gulp.task('styles', function () {
  return gulp.src([
    paths.styles + '/styles.scss',
  ])
  .pipe(sass().on('error', sass.logError))
  .pipe(autoprefixer({
    browsers: ['last 2 versions'],
    cascade: false
  }))
  // TODO: add sourcemaps
  .pipe(gulp.dest(paths.tmpStyles));
});


/**
 * Minify, rename and move compiled css to build path.
 * Relies on: "gulp-minify-css" and "gulp-rename".
 */
gulp.task('build-styles', ['styles'], function () {
  return gulp.src([
    paths.tmpStyles + '/styles.css',
    paths.lib + '/c3/c3.css',
    paths.lib + '/angular-ui-select/dist/select.min.css',
    paths.lib + '/selectize/dist/css/selectize.default.css',
    paths.lib + '/angular-tooltips/dist/angular-tooltips.css',
    paths.lib + '/angularjs-slider/dist/rzslider.min.css'
  ])
  .pipe(minifyCss({ compatibility: 'ie8' }))
  .pipe(rename({
    suffix: '.min'
  }))
  .pipe(gulp.dest(paths.tmpPrebuild + '/styles'));
});

/**
 * Builds the index.html injecting several dependencies.
 * Relies on: "gulp-inject".
 */
gulp.task('build-html', ['add-revision-numbers'], function () {
  // Note: wild-cards are there to keep the file order and also to support revision numbers
  var sources = gulp.src([
    paths.build + '/scripts/lib*.js',
    paths.build + '/locales/*.js',
    paths.build + '/scripts/app*.js',
    paths.build + '/scripts/templates*.js',
    paths.build + '/styles/styles*.css',
    paths.build + '/styles/c3*.css',
    paths.build + '/styles/select*.css',
    paths.build + '/styles/selectize*.css',
    paths.build + '/styles/angular-tooltips*.css',
    paths.build + '/styles/rzslider*.css',
  ], {
    read: false // It's not necessary to read the files (will speed up things), we're only after their paths.
  });

  return gulp.src([
    paths.app + '/index.html'
  ])
  .pipe(gulpInject(sources, {
    addRootSlash: false, // ensures proper relative paths
    ignorePath: paths.build + '/' // ensures proper relative paths
  }))
  .pipe(gulp.dest(paths.build));
});

gulp.task('build-mseditor', ['build-scripts-template-editor', 'add-revision-numbers'], function () {
  var sources = gulp.src([
    paths.build + '/template-editor/relay-editor.*.js'
  ]);
  return gulp.src([
    paths.app + '/template-editor/index.html'
  ])
  .pipe(gulpInject(sources, {
    addRootSlash: false, // ensures proper relative paths removing the root slash
    ignorePath: paths.build + '/template-editor' // ensures proper relative paths removing the absolute path
  }))
  .pipe(gulp.dest(paths.build + '/template-editor'));
});

gulp.task('build-scripts-template-editor', function () {
  return gulp.src([
    paths.app + '/template-editor/*.js',
    // TODO: Refactor this config files to json and inject in dopplerRelay and mseditor modules a
    // configuration module with ng-constant
    // Reference: https://github.com/MakingSense/MSEditor/blob/6a2a90d6f442184d93fabdb539540819c82a303f/refactor/gulpfile.js#L481-L488
    paths.app + '/env/' + process.env.NODE_ENV + '.js'
  ])
  .pipe(concat('relay-editor.js'))
  .pipe(uglify({
    mangle: false
  }))
  .pipe(gulp.dest(paths.tmpPrebuild + '/template-editor'));
});

gulp.task('build-partials', function () {
  // TODO: minify partials. It is important for cache/revision
  // TODO: take into account revision here
  return gulp.src([
    paths.app + '/partials/**/*.html'
  ])
  .pipe(templateCache({
    module: 'dopplerRelay',
    root: 'partials',
    filename: 'templates.js'
  }))
  .pipe(gulp.dest(paths.tmpPrebuild + '/scripts'));
});

/**
 * Copy locales folder with json files into build/locales.
 */
gulp.task('locales', function () {
  return gulp.src([
      paths.app + '/locales/*.js'
  ])
  .pipe(gulp.dest(paths.tmpPrebuild + '/locales'));
});

/**
 * Copy web.config file into build.
 */
gulp.task('web.config', function () {
  return gulp.src([
    paths.app + '/web.config'
  ])
  .pipe(gulp.dest(paths.build));
});

/**
 * Copy hcheck.png file into build.
 */
gulp.task('hcheck.png', function () {
  return gulp.src([
    paths.app + '/hcheck.png'
  ])
  .pipe(gulp.dest(paths.build));
});

gulp.task('fonts', function () {
  return gulp.src([
      paths.app + '/fonts/*.otf',
      paths.app + '/fonts/*.ttf',
      paths.app + '/fonts/*.woff',
      paths.app + '/fonts/*.woff2',
      paths.app + '/fonts/*.eot'
  ])
  .pipe(gulp.dest(paths.build + '/fonts'));
});

gulp.task('add-revision-numbers', ['build-scripts-template-editor', 'build-scripts', 'build-styles', 'locales', 'svg-sprite', 'build-partials', 'fonts'], function () {
  var revAll = new RevAll();
  return gulp.src([
    paths.tmpPrebuild + '/**'
  ])
  .pipe(revAll.revision())
  .pipe(gulp.dest(paths.build));
});


/**
 * Ensures the code is tested, valid & beautiful.
 */
gulp.task('validate', [
  //'lint',
  //'test'
]);

/**
 * Starts Karma server and runs the unit tests.
 * Relies on: "karma".
 */
gulp.task('test:unit', function (done) {
  new Server({
    configFile: __dirname + '/karma.conf.js', // Using __dirname because doesn't seems to work without it
    singleRun: true
  }, done).start();
});

/**
 * Starts our node server.
 * Relies on: "gulp-nodemon".
 */
gulp.task('server', function () {
  nodemon({
    script: 'server.js',
    watch: [
      '*.js',
      'server/**/*.js'
    ]
  });
});

/**
 * Reloads the browser's tab.
 * You need a browser extension to got it working (http://livereload.com/extensions).
 * Relies on: "gulp-livereload".
 */
gulp.task('reload', function () {
  livereload.reload();
});

/**
 * Watches for files changes.
 * Watch is a Gulp built-in feature, but not livereload.
 * Relies on: "gulp-livereload".
 */
gulp.task('watch', ['server'], function () {
  // Start livereload in order to refresh the browser
  livereload.listen();

  gulp.watch([
    paths.root + '/*.js',
    paths.server + '/**/*.js',
    paths.app + '/polyfills/**/*.js',
    paths.app + '/*.js',
    paths.app + '/controllers/**/*.js',
    paths.app + '/services/**/*.js'
  ], ['reload', 'validate']);

  gulp.watch([
    paths.app + '/**/*.html',
    paths.tmpStyles + '/*.css'
  ], ['reload']);

  gulp.watch([
    paths.styles + '/**/*.scss'
  ], ['styles']);
});

function getNodeBinary() {
  return /^win/.test(process.platform) ? 'node.exe' : 'node';
}

function getProtractorBinary() {
  var pkgPath = require.resolve('protractor');
  var protractorDir = path.resolve(path.join(path.dirname(pkgPath), '..', 'bin'));
  return path.join(protractorDir, '/' + 'protractor');
}

gulp.task('test:component', function () {
  // TODO: fix it:
  // If the server is already running, it show ugly errors (but works anyway),
  // maybe we should use another port, or do not try to start the server again.
  gulp.start('default');

  var argv = [getProtractorBinary(), 'protractor-conf.js'].concat(process.argv.slice(3));

  child_process
    .spawn(getNodeBinary(), argv, { stdio: 'inherit' })
    .on('error', function (e) {
      throw e;
    })
    .on('close', function (e) {
      process.exit(e);
    });
});
/**
 * Default task, used for development.
 * Starts a server and watches for changes in order to validate it.
 */
gulp.task('default', [
  'server',
  'watch',
  'styles',
  'validate',
  'svg-sprite-development'
]);

gulp.task('test', [
  'test:unit',
  'test:component'
]);

/**
 * Builds the entire application and generates a bundle in "deploy" folder.
 */
gulp.task('build', ['clean'], function () {
  gulp.start(
    'build-mseditor',
    'build-html',
    'web.config',
    'hcheck.png'
  );
});

