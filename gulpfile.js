var gulp=require("gulp"),
	gutil=require("gulp-util"),
	clean=require("gulp-clean"),
	sass=require("gulp-sass"),
	sourcemaps=require("gulp-sourcemaps"),
	imagemin=require("gulp-imagemin"),
	fileinclude = require("gulp-file-include"),
	pngquant=require("imagemin-pngquant"),
	minifycss=require("gulp-minify-css"),
	autoprefixer=require("gulp-autoprefixer"),
	uglify=require("gulp-uglify"),
	concat=require("gulp-concat"),
	notify=require("gulp-notify"),
	htmlmin=require("gulp-htmlmin"),
	rename=require("gulp-rename"),
	webpack=require('webpack'),
	changed=require("gulp-changed"),
	browserSync=require("browser-sync");
	webpackConfig=require("./webpack.config.js");

//解析SASS
gulp.task("sassmin",function(){
	return gulp.src("./sass/page/*.scss")
		//.pipe(sourcemaps.init())
		.pipe(sass({outputStyle:"compressed"}).on("error",sass.logError))
		//.pipe(sourcemaps.write("./maps"))
		.pipe(minifycss({compatibility:"ie8"}))
		.pipe(gulp.dest("./dist/css"));
})

//图片压缩
gulp.task("imagesmin",function(){
	gulp.src(["images/**/*.{png,jpg,gif,ico}","images/*.{png,jpg,gif,ico}"])
		.pipe(imagemin({
			progressive:true,
			use:[pngquant({quality:"65-80"})]
		}))
		.pipe(gulp.dest("dist/images/"))
})


//用于在html文件中直接include文件
gulp.task("fileinclude", function (done) {
	gulp.src(["*.html"])
		.pipe(fileinclude({
			prefix: "@@",
			basepath: "@file"
		}))
		.pipe(gulp.dest("dist/"))
		.on("end", done);
});
//用于在html文件中直接include文件
gulp.task("fontmove", function (done) {
	gulp.src(["fonts/**/*"])
		.pipe(gulp.dest("dist/fonts/"))
		.on("end", done);
});

//使用webpack对js进行操作
var myDevConfig=Object.create(webpackConfig);
var devCompiler=webpack(myDevConfig);
gulp.task("build-js",[],function(callback){
	devCompiler.run(function(err,stats){
		if(err) throw new gutil.PluginError("webpack:build-js", err);
		gutil.log("[webpack:build-js]", stats.toString({
			colors: true
		}));
		callback();
	})
})
//删除操作
gulp.task("clean",function(){
	return gulp.src('dist')
		.pipe(clean());
})
var paths={
	'js':['js/core/*.js','js/lib/*.js','js/*.js'],
	'css':['sass/*.scss','sass/*.css'],
	'images':['images/**/*.*','images/**'],
	'html':['include/*.html','*.html'],
	'font':['fonts/font/*','fonts/iconfont/*']
}
//监听任务
gulp.task("watch",function(){
	gulp.watch(paths['js'],["build-js"]);
	gulp.watch(paths['css'],["sassmin"]);
	gulp.watch(paths['images'],["imagesmin"]);
	gulp.watch(paths['html'],["fileinclude"]);
	gulp.watch(paths['font'],["fontmove"]);
})

//自动刷新
gulp.task("f5",["sassmin","build-js","fileinclude","imagesmin","fontmove","watch"],function(){
	browserSync({
		files:[
			"dist/css/*.css",
			"dist/js/*.js",
			"dist/fonts/**/*",
			"dist/images/**/*",
			"dist/images/**",
			"dist/*.html"
		],
		server:{
			baseDir:"dist/"
		}
	})
})

//监听scss变化
gulp.task("sasswh",function(){
	gulp.watch("sass/*.scss",["sass"]);
})

//默认开始开发事件
gulp.task("default",['f5']);

//构建打包
gulp.task("build",['clean'],function(){
	gulp.start("sassmin","build-js","fileinclude","imagesmin","fontmove");
});