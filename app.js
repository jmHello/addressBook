/**
 * Created by jm on 2017/5/6.
 */
var express=require('express'),
    app=new express(),
    router=require('./router/router.js');
app.use(express.static('./public'));
app.post('/saveInfo_action',router.saveInfo);
app.get('/getInfo_action',router.getInfo);
app.post('/mDInfo_action',router.mDInfo);
app.listen(80);