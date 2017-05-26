/**
 * Created by jm on 2017/5/6.
 */
var file=require('./../modules/file.js');
exports.saveInfo=function (req,res) {
    file.saveInfo(req,res);
};

exports.getInfo=function (req,res) {
    file.getInfo(req,res);
};

exports.mDInfo=function (req,res) {
    file.mDInfo(req,res);
};