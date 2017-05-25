import { Gulpclass, MergedTask, SequenceTask, Task } from 'gulpclass';

const gulp = require('gulp');
const del = require('del');
const shell = require('gulp-shell');
const replace = require('gulp-replace');
const ts = require('gulp-typescript');
const sourcemaps = require('gulp-sourcemaps');

@Gulpclass()
export class Gulpfile {

    @Task()
    public clean(cb: Function) {
        return del([
            'build/**'
        ], cb);
    }

    @Task()
    public compile() {
        return gulp.src('*.ts', { read: false })
            .pipe(shell(['tsc']));
    }

    /**
     * Copies all sources to the package directory.
     */
    @MergedTask()
    public packageCompile() {
        const tsProject = ts.createProject('tsconfig.json');
        const tsResult = gulp.src(['./src/**/*.ts', './typings/**/*.ts'])
            .pipe(sourcemaps.init())
            .pipe(tsProject());

        return [
            tsResult.dts.pipe(gulp.dest('./build/package')),
            tsResult.js
                .pipe(sourcemaps.write('.', { sourceRoot: '', includeContent: true }))
                .pipe(gulp.dest('./build/package'))
        ];
    }

    /**
     * Moves all compiled files to the final package directory.
     */
    @Task()
    public packageMoveCompiledFiles() {
        return gulp.src('./build/package/src/**/*')
            .pipe(gulp.dest('./build/package'));
    }

    /**
     * Moves all compiled files to the final package directory.
     */
    @Task()
    public packageClearCompileDirectory(cb: Function) {
        return del([
            './build/package/src/**'
        ], cb);
    }

    /**
     * Change the 'private' state of the packaged package.json file to public.
     */
    @Task()
    public packagePreparePackageFile() {
        return gulp.src('./package.json')
            .pipe(replace('"private": true,', '"private": false,'))
            .pipe(gulp.dest('./build/package'));
    }

    /**
     * This task will replace all typescript code blocks in the README (since npm does not support typescript syntax
     * highlighting) and copy this README file into the package folder.
     */
    @Task()
    public packageReadmeFile() {
        return gulp.src('./README.md')
            .pipe(replace(/```typescript([\s\S]*?)```/g, '```javascript$1```'))
            .pipe(gulp.dest('./build/package'));
    }

    @SequenceTask()
    public package() {
        return [
            'clean',
            'packageCompile',
            'packageMoveCompiledFiles',
            'packageClearCompileDirectory',
            ['packagePreparePackageFile', 'packageReadmeFile']
        ];
    }
}
