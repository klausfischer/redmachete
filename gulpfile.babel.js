import autoprefixer from 'autoprefixer';
import browserSync from 'browser-sync';
import cssnano from 'cssnano';
import del from 'del';
import fs from 'fs';
import gulp from 'gulp';
import imagemin from 'gulp-imagemin';
import nunjucksRender from 'gulp-nunjucks-render';
import php from 'gulp-connect-php';
import pngquant from 'imagemin-pngquant';
import postCSS from 'gulp-postcss';
import pump from 'pump';
import sass from 'gulp-sass';
import sassGlob from 'gulp-sass-glob';
import config from './config.json';
import data from './data';
import pkg from './package.json';

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
  gulp.src(['.htaccess', 'vinyldownload/**/*'], { base: '.' })
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
