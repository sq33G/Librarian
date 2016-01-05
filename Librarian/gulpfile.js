/// <binding BeforeBuild='default' Clean='clean-styles, clean-vendor-scripts' />
/*
This file in the main entry point for defining Gulp tasks and using Gulp plugins.
Click here to learn more. http://go.microsoft.com/fwlink/?LinkId=518007
*/

var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var cssMin = require('gulp-cssmin');
var del = require('del');
var sourcemaps = require('gulp-sourcemaps');
var bower = require('gulp-bower');
var print = require('gulp-print');

var config = {
    //JavaScript files that will be combined into a jquery bundle
    jquerysrc: [
        'bower_components/jquery/dist/jquery.min.js',
        'bower_components/jquery-validation/dist/jquery.validate.min.js',
        'bower_components/jquery-validation-unobtrusive/jquery.validate.unobtrusive.min.js',
        'bower_components/jquery-ui/dist/jquery-ui.min.js'
    ],
    jquerybundle: 'Scripts/jquery-bundle.min.js',

    //JavaScript files that will be combined into a Bootstrap bundle
    bootstrapsrc: [
        'bower_components/bootstrap/dist/js/bootstrap.min.js',
        'bower_components/respond/dest/respond.min.js',
        'bower_components/bootstrap3-typeahead/bootstrap3-typeahead.min.js'
    ],
    bootstrapbundle: 'Scripts/bootstrap-bundle.min.js',

    //Modernizr
    modernizrsrc: ['bower_components/modernizr/modernizr.js'],
    modernizrbundle: 'Scripts/modernizer.min.js',

    //Bootstrap CSS and Fonts
    bootstrapcss: ['bower_components/bootstrap/dist/css/bootstrap.css'],
    boostrapfonts: ['bower_components/bootstrap/dist/fonts/*'],

    //Angular
    angularsrc: ['bower_components/angular/angular.min.js',
                 'bower_components/angular-route/angular-route.min.js',
                 'bower_components/ngInfiniteScroll/build/ng-infinite-scroll.min.js'],
    angularbundle: 'Scripts/angular.min.js',

    appcss: 'Content/Site.css',
    appimages: 'Content/*.gif',

    fontsout: 'Content/dist/fonts',
    cssout: 'Content/dist/css',
    imagesout: 'Content/dist/images'

}

// Synchronously delete the output script file(s)
gulp.task('clean-vendor-scripts', function () {
    return del([config.jquerybundle,
              config.bootstrapbundle,
              config.modernizrbundle,
              config.angularbundle]);
});

//Create a jquery bundled file
gulp.task('jquery-bundle', ['clean-vendor-scripts', 'bower-restore'], function () {
    return gulp.src(config.jquerysrc)
     .pipe(concat('jquery-bundle.min.js'))
     .pipe(gulp.dest('Scripts'));
});

//Create a bootstrap bundled file
gulp.task('bootstrap-bundle', ['clean-vendor-scripts', 'bower-restore'], function () {
    return gulp.src(config.bootstrapsrc)
     .pipe(sourcemaps.init())
     .pipe(concat('bootstrap-bundle.min.js'))
     .pipe(sourcemaps.write('maps'))
     .pipe(gulp.dest('Scripts'));
});

//Create a modernizr bundled file
gulp.task('modernizer', ['clean-vendor-scripts', 'bower-restore'], function () {
    return gulp.src(config.modernizrsrc)
        .pipe(sourcemaps.init())
        .pipe(uglify())
        .pipe(concat('modernizer-min.js'))
        .pipe(sourcemaps.write('maps'))
        .pipe(gulp.dest('Scripts'));
});

//Create an angular bundled file
gulp.task('angular-bundle', ['clean-vendor-scripts', 'bower-restore'], function () {
    return gulp.src(config.angularsrc)
        .pipe(sourcemaps.init())
        .pipe(uglify())
        .pipe(concat('angular-min.js'))
        .pipe(sourcemaps.write('maps'))
        .pipe(gulp.dest('Scripts'));
});

// Combine and the vendor files from bower into bundles (output to the Scripts folder)
gulp.task('vendor-scripts', ['jquery-bundle', 'bootstrap-bundle', 'modernizer', 'angular-bundle'], function () {

});

// Synchronously delete the output style files (css / fonts)
gulp.task('clean-styles', function () {
    return del([config.fontsout,
              config.cssout]);
});

gulp.task('css', ['clean-styles', 'bower-restore'], function () {
    return gulp.src(Array.prototype.concat(config.bootstrapcss, config.appcss))
     .pipe(concat('app.css'))
     .pipe(gulp.dest(config.cssout))
     .pipe(cssMin())
     .pipe(concat('app.min.css'))
     .pipe(gulp.dest(config.cssout));
});

gulp.task('fonts', ['clean-styles', 'bower-restore'], function () {
    return gulp.src(config.boostrapfonts)
        .pipe(gulp.dest(config.fontsout));
});

gulp.task('images', ['clean-styles', 'bower-restore'], function () {
    return gulp.src(config.appimages)
        .pipe(gulp.dest(config.imagesout));
});

// Combine and minify css files and output fonts
gulp.task('styles', ['css', 'fonts', 'images'], function () {

});

//Restore all bower packages
gulp.task('bower-restore', function () {
    return bower();
});

//Set a default tasks 
gulp.task('default', ['vendor-scripts', 'styles'], function () {

});