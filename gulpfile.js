const { src, dest, watch, series, parallel } = require("gulp"); 
const concat = require("gulp-concat");
const babel = require("gulp-babel"); 
const uglify = require("terser"); 
const imagemin = require("gulp-imagemin"); 
const browserSync = require("browser-sync").create();    
const sass = require('gulp-sass'); 
sass.compiler = require('node-sass'); 
const sourcemaps = require('gulp-sourcemaps');

// Paths
const files = {
    htmlPath: "src/**/*.html",
    jsPath: "src/**/*.js",
    imagePath: "src/images/*",
    sassPath: "src/**/*.scss"
}

//Tasks

// Copy HTML-files to pub-catalog
function htmlTask() {
    return src(files.htmlPath)
        .pipe(dest('pub'))
}

// Merge (concat), minify JS-files, move
function jsTask() {
    return src(files.jsPath)
        .pipe(sourcemaps.init())
        .pipe(babel())
        .pipe(concat('main.js'))
        .pipe(sourcemaps.write("."))
        .pipe(dest('pub/js'))
        .pipe(browserSync.stream()); 
} 

// Sass-task including sourcemaps
function sassTask() {
    return src(files.sassPath)
        .pipe(sourcemaps.init())
        .pipe(sass({ outputStyle: 'compressed'}).on("error", sass.logError))
        .pipe(sourcemaps.write('./maps'))
        .pipe(dest("pub/css"))
        .pipe(browserSync.stream());          
}

// Minify images and copy image-files to pub-catalog
function imageTask() {
    return src(files.imagePath)
        .pipe(imagemin())
        .pipe(dest('pub/images'))
};


// Watch 
function watchTask() {
    watch([files.htmlPath, files.jsPath, files.sassPath ], 
        parallel(htmlTask, jsTask, sassTask )          
        );
}

// Browser Sync
function syncTask() {
    browserSync.init({
        injectChanges: false,
        server: {
            baseDir: "./pub"
        },
        port: 3000
    });
    watch([files.htmlPath, files.jsPath, files.sassPath  ], 
        parallel(htmlTask, jsTask, sassTask )).on('change', browserSync.reload);
}

// Export (to reach from elsewhere)
exports.default = series(
    parallel(htmlTask, jsTask, sassTask ),          
    parallel(watchTask,syncTask)
);   

// Export imagetask - not as default (takes to long to have it as default)
exports.imgexpo = imageTask;