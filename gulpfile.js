'use strict';

const gulp = require('gulp');
const del = require('del');
const runSequence = require('run-sequence');
const replace = require('gulp-replace');
const exec = require('child_process').exec;
const fs = require('fs-extra');
const tsconfig = require('./tsconfig.json');
const outDir = tsconfig.compilerOptions.outDir;
const packageDir = 'package';

gulp.task('clean', () => {
  return del([
    outDir + '/**',
    packageDir + '/**'
  ]);
});

gulp.task('build', cb => {
  exec('tsc', (err, stdout, stderr) => {
    if (stderr.length > 0) {
      console.log(stderr);
    }
    cb(err);
  });
});

gulp.task('packagePreparePackageFile', () => {
  return gulp.src('./package.json')
    .pipe(replace('"private": true,', '"private": false,'))
    .pipe(gulp.dest(packageDir));
});

gulp.task('copyBuildToPackage', () => {
  fs.copySync(outDir, packageDir + '/' + outDir);
});

gulp.task('copyRequiredFiles', () => {
  const files = ['yarn.lock', 'README.md'];
  files.forEach(file => {
    fs.copySync(file, packageDir + '/' + file);
  });
});

gulp.task('npmPublish', cb => {
  process.chdir(packageDir);
  exec('npm publish', (err, stdout, stderr) => {
    if (stderr.length > 0) {
      console.log(stderr);
    }
    cb(err);
  });
});

gulp.task('package', () => {
  runSequence('clean', 'build', 'copyBuildToPackage', 'copyRequiredFiles', 'packagePreparePackageFile');
});

gulp.task('publish', () => {
  runSequence('clean', 'build', 'copyBuildToPackage', 'copyRequiredFiles', 'packagePreparePackageFile', 'npmPublish');
});
