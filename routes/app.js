var express = require('express');
var router = express.Router();
var url = require("url");
var async = require("async");
var og = require('open-graph');
var Info = require('./../db');

router.get('/', function (req, res, next) {
    var parsedUrl = url.parse(req.url, true);
    var ogurl = parsedUrl.query.q;
    if(ogurl){
        getUrlData(ogurl, function(err, meta){
            /* console.log(meta); */
            if(err){
                return next(err);
            }

            if(meta){
                var type = meta.type ? meta.type : 'article';
                if(type.indexOf('video') > -1){
                    res.render('video', { title: meta.title, description: meta.description, type: type, video: meta.video, url: meta.url, site_name: meta.site_name});
                } else{
                    var imageObj = {};
                    imageObj['url'] =  getParam(meta.image.url);
                    imageObj['width'] =  getParam(meta.image.width);
                    imageObj['height'] =  getParam(meta.image.height);

                    res.render('article', { title: meta.title, description: meta.description, image: imageObj, url: meta.url, site_name: meta.site_name});
                }
            }
        });
    } else{
        res.end();
    }
});

var getUrlData = function(ogurl, callback){
    async.waterfall([
        function(callback){
            og(ogurl, function(err, meta){
                if (err) return callback(err);
                callback(null, meta);
            });
        },
        function(meta, callback){
            if(meta.url){
                Info.findOne({ url: meta.url }, function(err, row) {
                    if (err) return callback(err);
                    callback(null, row, meta);
                });
            } else{
                callback('Data not found.');
            }
        },
        function(row, meta, callback){
            if(row){
                var newRow = new Info({ site_name: meta.site_name, title: meta.title, description: meta.description, url: meta.url, type: meta.type, image: meta.image, video: meta.video });
                newRow.save(function(err) {
                    if (err) return callback(err);
                    callback(null, newRow);
                });
            } else{
                callback(null, meta);
            }
        }], callback);
}

var getParam = function(param){
    return param !== undefined ? (typeof param === "string" ? param : param[0]) : '';
}

module.exports = router;