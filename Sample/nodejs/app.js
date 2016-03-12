/**
 * Created by admin on 2016/3/3.
 */
Date.prototype.format = function(fmt) {
    var k, o;
    o = {
        "M+": this.getMonth() + 1,
        "d+": this.getDate(),
        "h+": this.getHours(),
        "m+": this.getMinutes(),
        "s+": this.getSeconds(),
        "q+": Math.floor((this.getMonth() + 3) / 3),
        S: this.getMilliseconds()
    };
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    for (k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length)));
        }
    }
    return fmt;
};


var express = require("express"),
 bodyParser = require('body-parser'),
 formidable =require('formidable'),
 fs=require("fs");
app = express();
//http://localhost:10000/public/pasteArea.html
//
app.use('/public',express.static(__dirname + '/public'));
app.use('/public/upload',express.static(__dirname + '/upload'));
app.use(bodyParser.json());
app.post("/upload", function(req, res) {
    //
        var fileName ="./upload/"+(new Date()).format("yyyyMMddhhmmssS")+".png";
        console.info("req.headers:");
        console.info(req.headers);
        console.info("req.params:");
        console.info(req.params);
        console.info("query:");
        console.info(req.query);
        console.info("body:");
        console.info(req.body);


        var form = new formidable.IncomingForm();
        form.uploadDir = './upload/';    //上传目录
        form.keepExtensions = true;             //保留后缀格式
        form.maxFieldsSize = 2*1024*1024;       //文件大小
        form.parse(req, function(err, fields, files){
            if (err){
                console.log('error', '文件上传失败',err);
             }
           // console.log(fields);
            //process input file
            if(files.AreaImgKey)
            {
                res.send(files.AreaImgKey.path);
                res.end();
                return;
            }
            //process base64
            else if(fields.AreaImgKey)
            {
                var base64Data = fields.AreaImgKey.replace(/^data:image\/\w+;base64,/, "");
                var dataBuffer = new Buffer(base64Data, 'base64');
                fs.writeFile(fileName, dataBuffer, function(err) {
                    if(err){
                       // res.send(err);
                        console.log(err);
                    }else{
                        res.send(fileName);
                        res.end();
                        return;
                    }
                });
            }
        });
    
});


app.listen(10000,function(){
            console.log("server is listening on "+10000)
        });