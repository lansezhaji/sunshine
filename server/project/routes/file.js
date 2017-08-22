var express = require('express');
var router = express.Router();
var query=require("../model/mysql.js");
var fs = require("fs")  
var path = require("path")  
var readline = require('readline'); //按行读取模块
var num = 0;
var fileList = [];
/**
 * 读取dlfronted工程中所有的文件夹及文件
 */
router.get('/dlfronted', function(req, res, next) {
    var path = "/Users/junyitan/Desktop/danlu/dlfrontend/mall"
    readDirSync(path)  
    res.render('file', { fileList: fileList });
});




/**
 * 读取dlmall所有的文件引用
 */
router.get('/mall', function(req, res, next) {
    var path = "/Users/junyitan/Desktop/danlu/dlmall/hd-mall-web/src/main/webapp/WEB-INF/template/dealer"
    var time1 =  new Date();
    var timeStamp1 = time1.getTime();
    // readDirSync(path)  
    var time2 =  new Date();
    var timeStamp2 = time2.getTime();
    console.log("----------------------------");
    var timeReduce = parseInt(timeStamp2) - parseInt(timeStamp1)
    console.log("总共耗时："+ timeReduce);
    
     res.render('file', { fileList: fileList });
});

    /**
     * 读文件
     * @param  {[type]} path [description]
     * @return {[type]}      [description]
     */
    function readDir(path){  
        fs.readdir(path,function(err,menu){   
            if(!menu)   return;  
            menu.forEach(function(ele){   
                fs.stat(path+"/"+ele,function(err,info){  
                    if(info.isDirectory()){  
                        console.log("dir: "+path+"/"+ele) 
                        if(ele != 'node_modules'){
                            readDir(path+"/"+ele);  
                        } 
                    }else{  
                        console.log("file: "+path+ele+"_____file num :"+num++)  

                    }     
                })  
            })            
        })  
    }  
    /**
     * 同步读取文件
     * @param {*} path 
     */
    function readDirSync(path){  
        var pa = fs.readdirSync(path);  
        pa.forEach(function(ele,index){  
            var info = fs.statSync(path+"/"+ele)      
            if(info.isDirectory()){  
                console.log("dir: "+path+"/"+ele) 
                if(ele != 'node_modules'){
                    readDirSync(path+"/"+ele);  
                }
            }else{  
                var file =path+'/'+ele
                fileList.push(file);
                if(ele[0] != '.'){
                    // 读取文件
                    fs.readFile(file, function (err,dataBit) {
                        if (err) throw err;
                        var content = dataBit.toString();
                        if(content.indexOf(".js")>=0 ){
                            var url = content.match(/\/\S+(?=.js)/g)
                            console.log(file+"["+url+']');
                            fileList.push(file+"文件中包含："+url);
                        }
                        //console.log(content.toString());
                    });
                }
                
            }     
        })  
    }  
module.exports = router;
