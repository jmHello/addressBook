/**
 * Created by jm on 2017/5/6.
 */
var fs=require('fs'),
    path=require('path');
exports.saveInfo=function (req,res) {
    req.on('data',function (data) {
        var datas=JSON.parse(data.toString()),
            str='\r\nid:'+datas.id+',name:'+datas.name+',phone:'+datas.phone+',qq:'+datas.qq+';';
        console.log(datas);
        fs.writeFile(path.normalize(__dirname+'/../infos/info.txt'),str,{'flag':'a'},function (err) {
            if(err) {
                console.log('保存信息失败！'+err);
                res.send({
                    'status':false
                })
            }
            else res.send({
                'status':true
            })
        })
    })
};

exports.mDInfo=function (req,res) {
    req.on('data',function (data) {
        var datas=JSON.parse(data.toString()),
            str='';
        for(var i in datas){
            var infos=datas[i];
            console.log(infos);
            str+='id:'+infos.id+',name:'+infos.name+',phone:'+infos.phone+',qq:'+infos.phone+';\r\n';
        }
        fs.writeFile(path.normalize(__dirname+'/../infos/info.txt'),str,function (err) {
            if(err) {
                console.log('保存信息失败！'+err);
                res.send({
                    'status':false
                })
            }
            else res.send({
                'status':true
            })
        })
    })
};

exports.getInfo=function (req,res) {
  fs.readFile(path.normalize(__dirname+'/../infos/info.txt'),function (err,data) {
      if(err) {
          console.log('读取信息错误！'+err);
          res.send({
              'status':false
          })
      }else{
          var d=data.toString(),
              datas=d.split(';'||';\r\n'),
              infos={};
          if(/^\s+$/.test(d))
              res.send({
                  'data':{},
                  'len':0,
                  'status':true
              });
          else{
              for(var i=0,len=datas.length-1;i<len;i++){

                  infos[datas[i].slice(datas[i].indexOf('id:')+3,datas[i].indexOf(',name:'))]={
                      'id':datas[i].slice(datas[i].indexOf('id:')+3,datas[i].indexOf(',name:')),
                      'name':datas[i].slice(datas[i].indexOf('name:')+5,datas[i].indexOf(',phone:')),
                      'phone':datas[i].slice(datas[i].indexOf('phone:')+6,datas[i].indexOf('phone:')+17),
                      'qq':datas[i].slice(datas[i].indexOf('qq:')+3)
                  };
              }
              res.send({
                  'data':infos,
                  'len':len,
                  'status':true
              });
          }


      }
  })
};