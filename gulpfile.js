var gulp = require('gulp');
var uglify = require('gulp-uglify');
var gulpif = require('gulp-if');
var concat = require('gulp-concat');
var fs = require('fs');
var cwd = "src/",task="",customizeList = [];
var argv = require('minimist')(process.argv.slice(2));
if(argv._&&argv._.length>0&&argv._[0]=='build'){
    task=argv.s?"src":"min";
    customizeList = argv.c?argv.c.split(","):[];
}
var replace = require('gulp-replace');
var json = JSON.parse(fs.readFileSync('./package.json'));
var feature = JSON.parse(fs.readFileSync('./'+cwd+'feature.json'));
var getPackageList = function(featureList){
    var temp  = ["intro","util"],push = Array.prototype.push,customize=[];
    var getDepencies = function(featureItem,check){
        var featureInfo = feature[featureItem],tempFeatureList=[];
        if(featureInfo) {
            if (featureInfo.dependencies) {
                featureInfo.dependencies.forEach(function (feature) {
                    push.apply(tempFeatureList,getDepencies(feature,false));
                })
            }
            if(featureItem.length>0&&tempFeatureList.indexOf(featureItem)==-1) {
                tempFeatureList.push(featureItem);
            }
        }else if(!check){
            if(featureItem.length>0&&tempFeatureList.indexOf(featureItem)==-1) {
                tempFeatureList.push(featureItem);
            }
        }
        return tempFeatureList;
    };
    if(featureList&&featureList.length>0){
        featureList.forEach(function(item){
            var list = getDepencies(item);
            push.apply(temp,getDepencies(item));
        });
    }else{
        for(var item in feature){
            push.apply(temp,getDepencies(item));
        }
    }
    temp.push("outro","comro");
    temp.forEach(function(tempFeature,index){
        tempFeature = tempFeature + ".js";
        if(customize.indexOf(tempFeature)==-1) {
            customize.push(tempFeature);
        }
    });
    if(customize.length>4) {
        return customize;
    }else{
        return getPackageList();
    }
};
var srcList = getPackageList(customizeList);
gulp.task('build',function() {
    gulp.src(srcList,{cwd:cwd}).
        pipe(replace("@VERSION", json.version)).
        pipe(replace("@Alias", argv.r||json.shim)).
        pipe(concat(json.main)).
        pipe(gulpif(task=="min",uglify())).
        pipe(gulp.dest('./'));
});