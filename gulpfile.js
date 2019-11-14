const autoprefixer = require('autoprefixer');
const browserSync = require('browser-sync');
const cssnano = require('cssnano');
const del = require('del');
const fs = require('fs');
const gulp = require('gulp');
const imagemin = require('gulp-imagemin');
const nunjucksRender = require('gulp-nunjucks-render');
const php = require('gulp-connect-php');
const pngquant = require('imagemin-pngquant');
const postCSS = require('gulp-postcss');
const pump = require('pump');
const sass = require('gulp-sass');
const sassGlob = require('gulp-sass-glob');
const config = require('./config.json');
const data = require('./data');
const pkg = require('./package.json');

const svgoPlugins = [
  { cleanupIDs: false },
  { cleanupNumbericValues: false },
  { cleanupListOfValues: false },
  { collapseGroups: false },
  { convertStyleToAttrs: true },
  { mergePaths: false },
  { removeComments: true },
  { removeStyleElement: true },
  { removeDoctype: true },
];

let d = {}; // JSONs from data folder

gulp.task('clean', () => {
  del.sync('dist');
});

gulp.task('copy', () =>
  gulp.src(['.htaccess', 'sitemap.xml', 'vinyldownload/**/*'], { base: '.' })
    .pipe(gulp.dest(config.dest.root)));

gulp.task('loadData', (cb) => {
  data(config.src.data).then((res) => {
    d = res;
    cb();
  });
});

gulp.task('sass', () =>
  gulp.src('./scss/main.scss')
    .pipe(sassGlob())
    .pipe(sass({ outputStyle: 'expanded' }).on('error', sass.logError))
    .pipe(postCSS([
      autoprefixer({ browsers: pkg.browserslist }),
      cssnano(),
    ]))
    .pipe(gulp.dest(config.dest.styles))
    .pipe(browserSync.stream()));

function extendNunjucksEnv(environment) {
  environment.addFilter('includeFile', path => fs.readFileSync(`./${path}`));
}


gulp.task('nunjucks', ['loadData', 'images'], (cb) => {
  pump([
    gulp.src(config.src.pages),
    nunjucksRender({
      data: d,
      path: `./${config.src.templates}/`,
      manageEnv: extendNunjucksEnv,
    }),
    gulp.dest(config.dest.root),
  ], cb);
});

gulp.task('images', () =>
  gulp.src(config.src.images)
    .pipe(imagemin({
      progressive: true,
      svgoPlugins,
      use: [pngquant()],
    }))
    .pipe(gulp.dest(config.dest.images)));

gulp.task('watch', () => {
  gulp.watch(`${config.src.images}/**/*.jpg`, ['images']);
  gulp.watch(`${config.src.styles}/**/*.scss`, ['sass']);
  gulp.watch(['.htaccess', 'vinyldownload/**/*'], ['copy', browserSync.reload]);
  gulp.watch([config.src.pages, 'data/**/*.json', `${config.src.templates}/**/*.html`], ['nunjucks', browserSync.reload]);
});

gulp.task('php', () => {
  php.server({
    hostname: '0.0.0.0',
    base: 'dist',
    port: 4040,
    open: false,
  });
});

gulp.task('browser-sync', ['php'], () => {
  browserSync.init({
    open: true,
    port: 4200,
    proxy: {
      target: 'http://localhost:4040',
      reqHeaders() {
        return {
          'accept-encoding': 'identity',
          agent: false,
        };
      },
    },
    reloadDelay: 1000,
  });
});

gulp.task('default', ['clean', 'copy', 'sass', 'nunjucks', 'images', 'watch', 'browser-sync']);
gulp.task('build',   ['clean', 'copy', 'sass', 'nunjucks', 'images']);
