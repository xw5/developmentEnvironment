//var CommonsChunkPlugin=require("webpack/lib/optimize/CommonChunkPlugin");
var webpack=require('webpack');
var path=require('path');
var fs=require('fs');
var uglifyJsPlugin = webpack.optimize.UglifyJsPlugin;
var srcDir=process.cwd();

//动态获取入口文件
function getEntry() {
    var jsPath = path.resolve(srcDir, 'js');
    var dirs = fs.readdirSync(jsPath);
    var matchs = [], files = {};
    dirs.forEach(function (item) {
        matchs = item.match(/(.+)\.js$/);
        if (matchs) {
            files[matchs[1]] = path.resolve(srcDir, 'js', item);
        }
    });
    //console.log(JSON.stringify(files));
    return files;
}
//webpack配件文件
module.exports={
    entry:getEntry(),
    devtool:"source-map",
    output:{
        path:path.join(__dirname,"dist/js/"),
        //publicPath:"dist/js/",
        filename:'[name].js'
        //chunkFilename: "[chunkhash].js"
    },
    resolve:{
        //简化调用
        alias:{
            jquery:srcDir+"/js/lib/jquery-1.11.3.min.js",
            core:srcDir+"/js/core"
        },
        //自动识别后缀
        extensions:['','.js']
    },
    plugins:[
        new webpack.ProvidePlugin({
            jQuery:'jquery',
            $:"jquery"
        }),
        //new CommonChunkPlugin('common.js'),
        new uglifyJsPlugin({
            compress:{
                warnings:false
            }
        })
    ]

};