/*global require */

"use strict";

// include plug-ins
var gulp = require("gulp"),
  concat = require("gulp-concat"),
  uglify = require("gulp-uglify"),
  rename = require("gulp-rename"),
  sourcemaps = require("gulp-sourcemaps"),
  del = require("del"),
  watch = require("gulp-watch"),
  sass = require("gulp-sass"),
  request = require("request"),
  fs = require("fs"),
  connect = require('gulp-connect');

var project = {
  //Project files
  scriptsSrc: [
    "Source/Scripts/Javascript/**/*.js"
  ],
  sassAllSrc: [
    "Source/Sass/**/*.scss"
  ],
  sassSrc: [
    "Source/Sass/sage.scss",
    "Source/Sass/htmlEditor.scss"
  ],
  htmlSrc: [
    "Source/HTML/**/*.html"
  ],
  imagesSrc: [
    "Source/Images/**/*.{svg,gif,jpg,png,tif}",
    "bower_components/slick-carousel/slick/ajax-loader.gif"
  ],
  scriptsLibSrc: [
    "bower_components/jquery/dist/jquery.js",
    "bower_components/bootstrap/dist/js/bootstrap.js",
    "bower_components/slick-carousel/slick/slick.js",
    "bower_components/ScrollMagic/scrollmagic/uncompressed/ScrollMagic.js",
    "bower_components/bootstrap-validator/js/validator.js",
    "Source/Scripts/Libs/*.js"
  ],
  scriptsAngularSrc: [
    "bower_components/angular/angular.js",
    "bower_components/angular-filter/dist/angular-filter.js",
    "Source/Scripts/Angular/**/*.js"
  ],
  fontSrc: [
    "bower_components/font-awesome/fonts/**/*.{ttf,woff,woff2,eot,svg}",
    "bower_components/bootstrap/dist/fonts/**/*.{ttf,woff,woff2,eot,svg}",
    "bower_components/slick-carousel/slick/fonts/**/*.{ttf,woff,woff2,eot,svg}",
    "Source/Fonts/**/*.{ttf,woff,woff2,eot,svg}"
  ],
  contentDest: "Content/Sage/",
  contentHTMLDest: "Content/Sage/HTML/",
  contentFontsDest: "Content/Sage/Fonts/",
  contentScriptsDest: "Content/Sage/Scripts/",
  contentImagesDest: "Content/Sage/Images/",
  contentStylesDest: "Content/Sage/Styles/",
  contentSrc: "Content/**/*",
  contentIISDest: "C:/Sage/SitecoreSites/Sitecore8.1Imagine/Website/Content"
};

//dev webserver
gulp.task('webServer', function () {
  connect.server({
    port: 8888,
    root: '',
    livereload: true
  });
});

//html reload
gulp.task('refreshBrowser', function () {
  gulp.src('./Content/Sage/HTML/*.html')
    .pipe(connect.reload());
});

//compile all the sass
gulp.task("compileSass", function () {
  return gulp.src(project.sassSrc)
    .pipe(sass().on("error", sass.logError))
    .pipe(gulp.dest(project.contentStylesDest));
});

//delete the Images output file(s)
gulp.task("cleanImages", function () {
  return del(project.contentImagesDest + "*");
});

//delete the Scripts output file(s)
gulp.task("cleanScripts", function () {
  return del(project.contentScriptsDest + "*");
});

//delete the html output file(s)
gulp.task("cleanHTML", function () {
  return del(project.contentHTMLDest + "*");
});

//delete the Fonts output file(s)
gulp.task("cleanFonts", function () {
  return del(project.contentFontsDest + "*");
});

//delete the Styles output file(s)
gulp.task("cleanStyles", function () {
  return del(project.contentStylesDest + "*");
});

//delete the all output file(s)
gulp.task("cleanAll", ["cleanImages", "cleanScripts", "cleanFonts", "cleanStyles", "cleanHTML"], function () {
});

// Combine and minify all lib files
gulp.task("scriptLibs", function () {
  return gulp.src(project.scriptsLibSrc)
    .pipe(concat("sage.libs.js"))
    .pipe(gulp.dest(project.contentScriptsDest))
    .pipe(uglify())
    .pipe(rename({
      suffix: ".min"
    }))
    .pipe(gulp.dest(project.contentScriptsDest));
});

// Combine and minify all sage js files
gulp.task("scriptSage", function () {
  return gulp.src(project.scriptsSrc)
    .pipe(concat("sage.js"))
    .pipe(gulp.dest(project.contentScriptsDest))
    .pipe(uglify())
    .pipe(rename({
      suffix: ".min"
    }))
    .pipe(gulp.dest(project.contentScriptsDest));
});

// Combine and minify all Angular js files
gulp.task("scriptAngular", function () {
  return gulp.src(project.scriptsAngularSrc)
    .pipe(concat("sage.angular.js"))
    .pipe(gulp.dest(project.contentScriptsDest))
    .pipe(uglify())
    .pipe(rename({
      suffix: ".min"
    }))
    .pipe(gulp.dest(project.contentScriptsDest));
});

//copy fonts to content directory
gulp.task("copyFonts", function () {
  gulp.src(project.fontSrc)
    .pipe(gulp.dest(project.contentFontsDest));
});

//copy html to content directory
gulp.task("copyHTML", function () {
  gulp.src(project.htmlSrc)
    .pipe(gulp.dest(project.contentHTMLDest));
  gulp.src("Source/index.html")
    .pipe(gulp.dest("Content/"));
});

//copy images to content directory
gulp.task("copyImages", function () {
  gulp.src(project.imagesSrc)
    .pipe(gulp.dest(project.contentImagesDest));
});

//copy to local IIS
gulp.task("copyToIIS", function () {
  gulp.src(project.contentSrc)
    .pipe(gulp.dest(project.contentIISDest));
});

//watch task
gulp.task("watch", function () {
  gulp.watch([project.scriptsSrc, project.scriptsLibSrc, project.scriptsAngularSrc], ["scriptSage", "scriptLibs", "scriptAngular", "refreshBrowser"]);
  gulp.watch([project.htmlSrc], ["copyHTML", "refreshBrowser"]);
  gulp.watch([project.imagesSrc], ["copyImages", "refreshBrowser"]);
  gulp.watch([project.fontSrc], ["copyFonts", "refreshBrowser"]);
  gulp.watch([project.sassAllSrc], ["compileSass", "refreshBrowser"]);
});

//copy all
gulp.task("copyAndCompileAll", ["compileSass", "copyFonts", "copyHTML", "copyImages", "compileAllScripts"]);

//compile scripts all
gulp.task("compileAllScripts", ["scriptLibs", "scriptSage", "scriptAngular"]);

//Set a default tasks
gulp.task("default", ["copyAndCompileAll", "webServer", "watch"]);