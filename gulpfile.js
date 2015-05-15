var gulp = require('gulp');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');


//자바스크립트 파일을 하나로 합치고 압축한다.
gulp.task('optimize-js', function () {
	return gulp.src(['src/angular.dragndrop.js'])
		.pipe(uglify())
		.pipe(rename({ suffix: ".min" }))
		.pipe(gulp.dest('dist/'));
});

// 파일 변경 감지
gulp.task('watch', function () {
	gulp.watch('src/angular.dragndrop.js', ['optimize-js']);
});

//기본 task 설정
gulp.task('default', ['optimize-js', 'watch' ]);
