"use strict";

const { src, dest } = require("gulp");
const gulp = require("gulp");
const autoprefixer = require("gulp-autoprefixer");
const cssbeautify = require("gulp-cssbeautify");
const removeComments = require("gulp-strip-css-comments");
const rename = require("gulp-rename");
const sass = require("gulp-sass")(require("sass"));
const cssnano = require("gulp-cssnano");
const rigger = require("gulp-rigger");
const plumber = require("gulp-plumber");
const panini = require("panini");
const imagemin = require("gulp-imagemin");
const del = require("del");
const browserSync = require("browser-sync").create();
const purgecss = require("gulp-purgecss"); 
const tailwindcss = require("tailwindcss");
const postcss = require('gulp-postcss');
const fileInclude = require('gulp-file-include');
const pug = require('gulp-pug');

/* Paths */
const srcPath = "src/";
const distPath = "build/dist/";
const path = {
  build: {
    html: distPath,
    js: distPath + "assets/js/",
    css: distPath + "assets/css/",
    images: distPath + "assets/images/",
    fonts: distPath + "assets/fonts/",
    vendorcss: distPath + "assets/css/vendor/"
  },
  src: {
    html: srcPath + "*.html",
    js: srcPath + "assets/js/*.js",
    css: srcPath + "assets/scss/*.scss",
    vendorcss: srcPath + "assets/js/components/*.css",
    pug: srcPath + "*.pug",
    images:
      srcPath +
      "assets/images/**/*.{jpg,png,svg,gif,ico,webp,webmanifest,xml,json}",
    fonts: srcPath + "assets/fonts/**/*.{eot,woff,woff2,ttf,svg}",
  },
  watch: {
    html: srcPath + "**/*.html",
    js: srcPath + "assets/js/**/*.js",
    css: srcPath + "assets/scss/**/*.scss",
    vendorcss: srcPath + "assets/js/components/*.css",
    pug: srcPath + "*.pug",
    images:
      srcPath +
      "assets/images/**/*.{jpg,png,svg,gif,ico,webp,webmanifest,xml,json}",
    fonts: srcPath + "assets/fonts/**/*.{eot,woff,woff2,ttf,svg}",
  },
  clean: "./" + distPath,
};

/* Tasks */

function serve() {
  browserSync.init({
    server: {
      baseDir: "./" + distPath,
    },
  });
}

function html(cb) {
  panini.refresh();
  return src(path.src.html, { base: srcPath })
    .pipe(plumber())
    .pipe(
      panini({
        root: srcPath,
        layouts: srcPath + "layouts/",
        partials: srcPath + "partials/",
        helpers: srcPath + "helpers/",
        data: srcPath + "data/",
      })
    )
    .pipe(fileInclude())
    .pipe(dest(path.build.html))
    .pipe(browserSync.reload({ stream: true }));

  cb();
}

function pugs(cb) {
  return src(path.src.pug, {base: srcPath})
  .pipe(pug())
  .pipe(dest(path.build.html))
  .pipe(browserSync.reload({stream: true}))

  cb()
}

function css(cb) {
  return src(path.src.css, { base: srcPath + "assets/scss/" })
    .pipe(
      sass({
        includePaths: "./node_modules/",
      })
    )
    .pipe(postcss([tailwindcss("./tailwind.config.js")]))
    .pipe(
      autoprefixer({
        cascade: true,
      })
    )
    .pipe(cssbeautify())
    // .pipe(
    //   cssnano({
    //     zindex: false,
    //     discardComments: {
    //       removeAll: true,
    //     },
    //   })
    // )
    .pipe(removeComments())
    .pipe(dest(path.build.css))
    // .pipe(
    //   rename({
    //     suffix: ".min",
    //     extname: ".css",
    //   })
    // )
    .pipe(dest(path.build.css))
    .pipe(browserSync.reload({ stream: true }));

  cb();
}

function vendorcss(cb) {
  return src(path.src.vendorcss, {base: srcPath + "assets/js/components/"})
  .pipe(dest(path.build.vendorcss))
}

function cleanCss(cb) {
  return src(path.src.css, { base: srcPath + "assets/scss/" })
    .pipe(
      sass({
        includePaths: "./node_modules/",
      })
    )
    .pipe(postcss([tailwindcss("./tailwind.config.js")]))
    .pipe(
      purgecss({
        content: ["src/**/*.{html,js,php}"],
        safelist: ['hello'],
        defaultExtractor: (content) => {
          const broadMatches = content.match(/[^<>"'`\s]*[^<>"'`\s:]/g) || [];
          const innerMatches =
            content.match(/[^<>"'`\s.()]*[^<>"'`\s.():]/g) || [];
          return broadMatches.concat(innerMatches);
        },
      })
    )
    // .pipe(
    //   autoprefixer({
    //     cascade: true,
    //   })
    // )
    .pipe(cssbeautify())
    .pipe(dest(path.build.css))
    .pipe(
      cssnano({
        zindex: false,
        discardComments: {
          removeAll: true,
        },
      })
    )
    .pipe(removeComments())
    .pipe(dest(path.build.css))
    .pipe(browserSync.reload({ stream: true }));

  cb();
}

function cssWatch(cb) {
  return src(path.src.css, { base: srcPath + "assets/scss/" })
    .pipe(
      sass({
        includePaths: "./node_modules/",
      })
    )
    .pipe(postcss([tailwindcss("./tailwind.config.js")]))
    .pipe(cssbeautify())
    .pipe(removeComments())
    .pipe(
      autoprefixer({
        cascade: true,
      })
    )
    .pipe(
      rename({
        suffix: ".min",
        extname: ".css",
      })
    )
    .pipe(dest(path.build.css))
    .pipe(browserSync.reload({ stream: true }));

  cb();
}

function js(cb) {
  return src(path.src.js, { base: srcPath + "assets/js/" })
    .pipe(rigger())
    .pipe(dest(path.build.js))
    .pipe(browserSync.reload({ stream: true }));

  cb();
}

function jsWatch(cb) {
  return src(path.src.js, { base: srcPath + "assets/js/" })
    .pipe(rigger())
    .pipe(dest(path.build.js))
    .pipe(browserSync.reload({ stream: true }));

  cb();
}

function images(cb) {
  return src(path.src.images)
    .pipe(
      imagemin([
        imagemin.gifsicle({ interlaced: true }),
        imagemin.mozjpeg({ quality: 95, progressive: true }),
        imagemin.optipng({ optimizationLevel: 5 }),
        imagemin.svgo({
          plugins: [{ removeViewBox: true }, { cleanupIDs: false }],
        }),
      ])
    )
    .pipe(dest(path.build.images))
    .pipe(browserSync.reload({ stream: true }));

  cb();
}

function imagesWatch(cb) {
  return src(path.src.images)
    .pipe(dest(path.build.images))
    .pipe(browserSync.reload({ stream: true }));

  cb();
}

function fonts(cb) {
  return src(path.src.fonts)
    .pipe(dest(path.build.fonts))
    .pipe(browserSync.reload({ stream: true }));

  cb();
}

function clean(cb) {
  return del(path.clean);

  cb();
}

function cleanWithoutImg(cb) {
  return del([`!dist/**/images/**`, 'dist/**/fonts/**', 'dist/**/css/**', 'dist/**/js/**', 'dist/index.html'])
}

function watchFiles() {
  gulp.watch([path.watch.html], gulp.series(html, cssWatch));
  // gulp.watch([path.watch.pug], pugs)
  gulp.watch([path.watch.css], vendorcss);
  gulp.watch([path.watch.css], cssWatch);
  gulp.watch([path.watch.js], jsWatch);
  gulp.watch([path.watch.images], imagesWatch);
  // gulp.watch([path.watch.images], images);
  gulp.watch([path.watch.fonts], fonts);
  gulp.watch(['./tailwind.config.js'], gulp.series(html, cssWatch))
}

const buildOld = gulp.series(clean, gulp.parallel(html, css, vendorcss, js, images, fonts));
const start = gulp.series(cleanWithoutImg, gulp.parallel(html, css, js, fonts, vendorcss));
const watch = gulp.parallel(start, watchFiles, serve);
const build = gulp.parallel(buildOld, watchFiles, serve);
const buildCleanCSS = gulp.series(clean, gulp.parallel(html, cleanCss, js, images, fonts));

/* Exports Tasks */
exports.html = html;
exports.css = css;
exports.js = js;
exports.images = images;
exports.fonts = fonts;
exports.clean = clean;
exports.build = build;
exports.watch = watch;
exports.default = watch;
exports.cleanWithoutImg = cleanWithoutImg
exports.start = start
exports.buildCleanCSS = buildCleanCSS
