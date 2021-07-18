const {
  src,
  dest,
  parallel,
  series,
  watch
} = require('gulp');
const sass = require('gulp-sass');
const notify = require('gulp-notify');
const rename = require('gulp-rename');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const sourcemaps = require('gulp-sourcemaps');
const browserSync = require('browser-sync').create();
const fileinclude = require('gulp-file-include');
const svgSprite = require('gulp-svg-sprite');
const fs = require('fs');
const del = require('del');
const webpack = require('webpack');
const webpackStream = require('webpack-stream');
const uglify = require('gulp-uglify-es').default;
const tiny = require('gulp-tinypng-compress');
const gutil = require('gulp-util');
const ftp = require('vinyl-ftp');

const svgSprites = () => {
  return src('./src/assets/icons/**.svg')
    .pipe(svgSprite({
      mode: {
        stack: {
          sprite: "../sprite.svg"
        }
      }
    }))
    .pipe(dest('./dist/assets/img'));
}

const styles = () => {
  return src('./src/sass/**/*.+(scss|sass|css)')
    .pipe(sourcemaps.init())
    .pipe(sass({
      outputStyle: 'expanded'
    }).on('error', notify.onError()))
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(autoprefixer({
      cascade: false,
    }))
    .pipe(cleanCSS({
      level: 2
    }))
    .pipe(sourcemaps.write('.'))
    .pipe(dest('./dist/css/'))
    .pipe(browserSync.stream());
}

const htmlInclude = () => {
  return src(['./src/*.html'])
    .pipe(fileinclude({
      prefix: '@',
      basepath: '@file'
    }))
    .pipe(dest('./dist'))
    .pipe(browserSync.stream());
}

const htmlIncludeZoos = () => {
  return src(['./src/zoos/*.html'])
    .pipe(fileinclude({
      prefix: '@',
      basepath: '@file'
    }))
    .pipe(dest('./dist/zoos'))
    .pipe(browserSync.stream());
}

const fonts = () => {
  return src('./src/assets/fonts/**/*')
    .pipe(dest("./dist/assets/fonts"))
    .pipe(browserSync.stream());
}

const imgTodist = () => {
  return src(['./src/assets/img/**/*.jpg', './src/assets/img/**/*.png', './src/assets/img/**/*.jpeg', './src/assets/img/**/*.svg'])
    .pipe(dest('./dist/assets/img'))
}

const resources = () => {
  return src('./src/assets/resources/**')
    .pipe(dest('./dist'))
}

const clean = () => {
  return del(['dist/*'])
}

const scripts = () => {
  return src('./src/js/index.js')
    .pipe(webpackStream({
      mode: 'development',
      output: {
        filename: 'index.js',
      },
      module: {
        rules: [{
          test: /\.m?js$/,
          exclude: /(node_modules|bower_components)/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env']
            }
          }
        }]
      },
    }))
    .on('error', function (err) {
      console.error('WEBPACK ERROR', err);
      this.emit('end'); // Don't stop the rest of the task
    })

    .pipe(sourcemaps.init())
    .pipe(uglify().on("error", notify.onError()))
    .pipe(sourcemaps.write('.'))
    .pipe(dest('./dist/js'))
    .pipe(browserSync.stream());
}

const watchFiles = () => {
  browserSync.init({
    server: {
      baseDir: "./dist"
    }
  });

  watch('./src/sass/**/*.+(scss|sass|css)', styles);
  watch('./src/pages/*.html', htmlInclude);
  watch('./src/zoos/*.html', htmlIncludeZoos);
  watch('./src/*.html', htmlInclude);
  watch('./src/assets/img/**/*.{jpg,jpeg,png,gif,webp,svg}', imgTodist);
  watch('./src/assets/icons/**.svg', svgSprites);
  watch('./src/assets/resources/**', resources);
  watch('./src/js/**/*.js', scripts);
  watch('./src/assets/fonts/**', fonts);
}

exports.styles = styles;
exports.watchFiles = watchFiles;
exports.scripts = scripts;
exports.fileinclude = htmlInclude;

exports.default = series(clean, parallel(htmlInclude,htmlIncludeZoos, scripts, fonts, resources, imgTodist, svgSprites), styles, watchFiles);


// BUILD

const tinypng = () => {
  return src(['./src/assets/img/**/*.jpg', './src/assets/img/**/*.png', './src/assets/img/**/*.jpeg'])
    .pipe(tiny({
      key: 'xWsCqLVvKDH9SV354RKKrl9sQ963msGt',
      parallel: true,
      parallelMax: 50,
      log: true,
    }))
    .pipe(dest('./dist/assets/img'))
}

const stylesBuild = () => {
  return src('./src/sass/**/*.+(scss|sass|css)')
    .pipe(sass({
      outputStyle: 'expanded'
    }).on('error', notify.onError()))
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(autoprefixer({
      cascade: false,
    }))
    .pipe(cleanCSS({
      level: 2
    }))
    .pipe(dest('./dist/css/'))
}

const scriptsBuild = () => {
  return src('./src/js/index.js')
    .pipe(webpackStream({
      mode: 'development',
      output: {
        filename: 'index.js',
      },
      module: {
        rules: [{
          test: /\.m?js$/,
          exclude: /(node_modules|bower_components)/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env']
            }
          }
        }]
      },
    }))
    .on('error', function (err) {
      console.error('WEBPACK ERROR', err);
      this.emit('end'); // Don't stop the rest of the task
    })
    .pipe(uglify().on("error", notify.onError()))
    .pipe(dest('./dist/js'))
}

exports.build = series(clean, parallel(htmlInclude, htmlIncludeZoos, scriptsBuild, fonts, resources, imgTodist, svgSprites), stylesBuild, tinypng);


// deploy
const deploy = () => {
  let conn = ftp.create({
    host: '',
    user: '',
    password: '',
    parallel: 10,
    log: gutil.log
  });

  let globs = [
    'dist/**',
  ];

  return src(globs, {
      base: './dist',
      buffer: false
    })
    .pipe(conn.newer('')) // only upload newer files
    .pipe(conn.dest(''));
}

exports.deploy = deploy;
