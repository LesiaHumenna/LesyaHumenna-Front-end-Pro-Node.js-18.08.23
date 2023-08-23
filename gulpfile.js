const { src, dest, watch, series, parallel } = require("gulp");
const fileinclude = require("gulp-file-include");
const sass = require("gulp-sass")(require("sass"));
const sourcemaps = require('gulp-sourcemaps');
const rename = require('gulp-rename');
const uglify = require('gulp-uglify');
const browserSunc = require('browser-sync').create();
function defaultTask(cb) {
  cb();
}

function HTMLTask() {
  return src("src/**/*.html")
    .pipe(
      fileinclude({
        prefix: "@@",
        basepath: "@file",
      })
    )
    .pipe(dest("dist/"));
};

function stylesTask(){
return src('src/f.sass/**/*.scss')
.pipe(sourcemaps.init())
.pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
.pipe(rename({suffix:'.min'}))
.pipe(sourcemaps.write())
.pipe(dest('dist/css/'));
};

function JSTask(){
return src('src/js/*.js')
.pipe(uglify())
.pipe(rename({suffix: '.min'}))
.pipe(dest('dist/js/'));
};

function watchTasks() {
    watch('src/**/*.html', HTMLTask)
    watch('src/**/*.scss', series(stylesTask, browserSyncReload))
    watch('src/**/*.js', JSTask)
    watch('src/**/*.js', series(JSTask, browserSyncReload))
}

function browserSyncServer() {
browserSunc.init({
    server:{
        baseDir: 'dist'
    }
})
}
function browserSyncReload(cb) {
    browserSunc.reload();
    cb();
}

exports.watchTasks = watchTasks;
exports.browserSyncServer = browserSyncServer;
exports.watchTasks = watchTasks;
exports.JSTask = JSTask;
exports.stylesTask = stylesTask;
exports.HTMLTask = HTMLTask;

exports.default = series(
    HTMLTask,
    stylesTask,
    JSTask,
    parallel(browserSyncServer,watchTasks)
);
