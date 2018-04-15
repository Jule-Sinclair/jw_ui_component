import gulp from 'gulp';
import del from 'del';
import sass from 'gulp-sass';
import webpack from 'webpack';
import gulpWebpack from 'webpack-stream';
import DevConfig from './webpack.config';

const srcPath = {
  js: 'src/js',
  css: 'src/sass',
};

const buildPath = {
  js: 'build/js',
  css: 'build/css',
};

const devConfig = new DevConfig();

// javascripts -----------------------------------------------------------
gulp.task(
  'js_clean',
  () => del.sync([buildPath.js]),
);

gulp.task(
  'webpack:dev',
  () => gulp.src(`${srcPath.js}/!**!/!*.js`)
    .pipe(gulpWebpack(devConfig.config, webpack))
    .pipe(gulp.dest(buildPath.js)),
);


// css -------------------------------------------------------------------
gulp.task(
  'css_clean',
  () => del.sync([buildPath.css]),
);

gulp.task(
  'sass',
  ['css_clean'],
  () => gulp.src([`${srcPath.css}/**/*.scss`, `${srcPath.css}/**/*.sass`])
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest(buildPath.css)),
);


// watch -----------------------------------------------------------------
gulp.task('style_watch', () => {
  gulp.watch([`${srcPath.css}/**/*.scss`, `${srcPath.css}/**/*.sass`], ['sass']);
});

gulp.task('dev_build', ['sass', 'webpack:dev']);
gulp.task('watch', ['style_watch', 'webpack:dev']);
