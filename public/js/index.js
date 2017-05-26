/**
 * Created by jm on 2017/5/3.
 */
(function () {
   var doc=document,
       s_main_page=JM.getEle('.nav>div'),//mainPage
       form_s=JM.getEles('.form_s'),//nav
       form=JM.getEles('.form'),//form
       sec_menu=JM.getEles('.sec_menu'),//second menu
       sec_menu_ul=JM.getEles('.sec_menu>ul'),
       cancel=JM.getEles('.cancel'),
       sure=JM.getEles('.sure'),
       con_table=JM.getEle('.con_table'),
       con_table_body=JM.getEle('.con_table>tbody'),
       mainPage=JM.getEle('.con_mainPage');


    //show main page
    JM.addHandler(s_main_page,'click',function (e) {
        JM.stopPropagation(JM.getEvent(e));
        var len=sec_menu_ul.length;
        for(;len--;) JM.removeClass(sec_menu_ul[len],'show');
        JM.removeClass(mainPage,'hide');
        JM.removeClass(con_table,'show');
    },false);



    //show second menu
    JM.reverseIterator(sec_menu,function (i,item) {
        JM.addHandler(item,'click',function (e) {
            JM.stopPropagation(JM.getEvent(e));
            var len=sec_menu_ul.length,
                sec_menu_li=JM.getEles('.sec_menu>ul>li');
            //hide all uls
            for(;len--;)JM.removeClass(sec_menu_ul[len],'show');
            JM.addClass(sec_menu_ul[i],'show');

            //while clicking li,hide ul
            JM.reverseIterator(sec_menu_li,function (i,item) {
                JM.addHandler(item,'click',function (e) {
                    JM.stopPropagation(JM.getEvent(e));
                    JM.removeClass(this.parentNode,'show');
                },false);
            })
        },false);
    });

    //click document,hide ul
    JM.addHandler(document,'click',function (e) {
        JM.stopPropagation(JM.getEvent(e));
        var len=sec_menu_ul.length;
        for(;len--;) JM.removeClass(sec_menu_ul[len],'show');
    },false);

    /*
        form validation
     */
    //data structor
    var dictionary=new JM.Dictionary(JSON.parse(localStorage.getItem('infos')));

    // var  local_storage=new JM.Dictionary(localStorage);

    /* add new info */
    var addInfos_btn=doc.getElementById('addInfos');
    JM.addHandler(addInfos_btn,'click',function () {
        var add_form=JM.getEle('#a_info form'),
            a_info=doc.getElementById('a_info'),
            allTips=JM.getEles('#a_info .tips'),
            a_form_input={
                'id':add_form.n_id,
                'name':add_form.n_name,
                'phone':add_form.n_telephoneNum,
                'qq':add_form.n_qq
            },
            newInfo={
                'id':add_form.n_id.value.trim(),
                'name':add_form.n_name.value.trim(),
                'phone':add_form.n_telephoneNum.value.trim(),
                'qq':add_form.n_qq.value.trim()
            };
        validateForm(a_form_input,function (data) {
            dealForms(data,allTips,function () {
                //save data into localStorage
                if(dictionary.has(newInfo.id))
                    alert('此同学已存在！');
                else{
                    //clear input value
                    clearForms(a_form_input);
                    JM.removeClass(a_info,'show');
                    saveInfos(newInfo);
                    getInfos();
                }
            });
        })
    },false);

    /* modify info */
    var modifyInfos_btn=doc.getElementById('modifyInfos');
    JM.addHandler(modifyInfos_btn,'click',function () {
        var modify_form=JM.getEle('#m_info form'),
            m_info=doc.getElementById('m_info'),
            allTips=JM.getEles('#m_info .tips'),
            m_form_input={
                'id':modify_form.m_id,
                'name':modify_form.m_name,
                'phone':modify_form.m_telephoneNum,
                'qq':modify_form.m_qq
            },
            newInfo={
                'id':modify_form.m_id.value.trim(),
                'name':modify_form.m_name.value.trim(),
                'phone':modify_form.m_telephoneNum.value.trim(),
                'qq':modify_form.m_qq.value.trim()
            };
        validateForm(m_form_input,function (data) {
            dealForms(data,allTips,function () {
                //save data into localStorage
                if(dictionary.has(newInfo.id)){
                    dictionary.set(newInfo.id,newInfo);
                    //clear input value
                    clearForms(m_form_input);
                    JM.removeClass(m_info,'show');
                    mDInfo(dictionary.getItems());
                    // getInfos();
                } else alert('此同学不存在！');

            });
        })
    },false);


    /*delete info*/
    var deleteInfo_btn=doc.getElementById('deleteInfo');
    JM.addHandler(deleteInfo_btn,'click',function () {
        var delete_form=JM.getEle('#d_info form'),
            d_info=doc.getElementById('d_info'),
            allTips=JM.getEles('#d_info .tips'),
            d_form_input={
                'id':delete_form.d_id
            },
            newInfo={
                'id':delete_form.d_id.value.trim()
            };
        validateForm(d_form_input,function (data) {
            dealForms(data,allTips,function () {
                //delete info
                if( dictionary.remove(newInfo.id)){
                    clearForms(d_form_input);
                    JM.removeClass(d_info,'show');
                    mDInfo(dictionary.getItems());
                }else alert('此同学信息不存在！');
            });
        })
    },false);

    /* check info by id*/
    var checkInfoById_btn=doc.getElementById('checkInfoById');
    JM.addHandler(checkInfoById_btn,'click',function () {
        var form=JM.getEle('#cInfoById form'),
            modal=doc.getElementById('cInfoById'),
            allTips=JM.getEles('#cInfoById .tips'),
           form_input={
                'id':form.c_id
            },
            newInfo={
                'id':form.c_id.value.trim()
            };
        validateForm(form_input,function (data) {
            dealForms(data,allTips,function () {
                if(dictionary.getOneItem(newInfo.id)){
                    var data=dictionary.getOneItem(newInfo.id);
                    clearForms(form_input);
                    JM.removeClass(modal,'show');
                    con_table_body.innerHTML='<tr>'+
                        '<td>'+data.id+'</td>'+
                        '<td>'+data.name+'</td>'+
                        '<td>'+data.phone+'</td>'+
                        '<td>'+data.qq+'</td>'+
                        '</tr>';
                    JM.addClass(mainPage,'hide');
                    JM.addClass(con_table,'show');
                }else alert('此同学信息不存在！');
            });
        })
    },false);

    var checkInfoByName_btn=doc.getElementById('checkInfoByName');
    JM.addHandler(checkInfoByName_btn,'click',function () {
        var form=JM.getEle('#cInfoByName form'),
            modal=doc.getElementById('cInfoByName'),
            allTips=JM.getEles('#cInfoByName .tips'),
            form_input={
                'name':form.c_name
            },
            newInfo={
                'name':form.c_name.value.trim()
            };
        validateForm(form_input,function (data) {
            dealForms(data,allTips,function () {
                var data=binarySearch(bubbleSort(dictionary.getAllValues(),'name','order','string'),newInfo.name,'name','string');
                if(data){
                    clearForms(form_input);
                    JM.removeClass(modal,'show');
                    con_table_body.innerHTML='<tr>'+
                        '<td>'+data.id+'</td>'+
                        '<td>'+data.name+'</td>'+
                        '<td>'+data.phone+'</td>'+
                        '<td>'+data.qq+'</td>'+
                        '</tr>';
                    JM.addClass(mainPage,'hide');
                    JM.addClass(con_table,'show');
                }else alert('此同学信息不存在！');
            });
        })
    },false);


    //check all info
    var checkAllInfos=doc.getElementById('checkAllInfos');
    JM.addHandler(checkAllInfos,'click',function (e) {
        JM.stopPropagation(JM.getEvent(e));
        JM.addClass(con_table,'show');
        JM.addClass(mainPage,'hide');
        var infos=dictionary.getAllValues(),
            len=infos.length,
            html='';
        console.log(infos);
        if(len)
            for(;len--;){
                var item=infos[len];
                html+= '<tr>'+
                            '<td>'+item.id+'</td>'+
                            '<td>'+item.name+'</td>'+
                            '<td>'+item.phone+'</td>'+
                            '<td>'+item.qq+'</td>'+
                     '</tr>';
            }
            con_table_body.innerHTML=html;
    },false);


    /*
        range data
     */
    //range by id
    var rangeById=doc.getElementById('rangeById');
    JM.addHandler(rangeById,'click',function (e) {
        JM.stopPropagation(JM.getEvent(e));

        var html='',
            data=dictionary.getAllValues();

        JM.inIterator(data,function (i,item) {
            html+= '<tr>'+
                '<td>'+item.id+'</td>'+
                '<td>'+item.name+'</td>'+
                '<td>'+item.phone+'</td>'+
                '<td>'+item.qq+'</td>'+
                '</tr>';
        });
        con_table_body.innerHTML=html;
        JM.addClass(con_table,'show');
        JM.addClass(mainPage,'hide');
    },false);

    //range by name
    var rangeByName=doc.getElementById('rangeByName');
    JM.addHandler(rangeByName,'click',function (e) {
        JM.stopPropagation(JM.getEvent(e));
        console.log(dictionary.getAllValues());
        var html='',
            data=autoShellSort(dictionary.getAllValues(),'name','order','string');
        // console.log(data);
        JM.inIterator(data,function (i,item) {
            html+= '<tr>'+
                '<td>'+item.id+'</td>'+
                '<td>'+item.name+'</td>'+
                '<td>'+item.phone+'</td>'+
                '<td>'+item.qq+'</td>'+
                '</tr>';
        });
        con_table_body.innerHTML=html;
        JM.addClass(con_table,'show');
        JM.addClass(mainPage,'hide');
    },false);




    function dealForms(datas,allTips,callback) {
        if(datas){
            var errMsg=datas.errMsg,
                input_name=datas.dom;
            if(errMsg){
                JM.reverseIterator(allTips,function (i,item) {
                    JM.removeClass(item,'show');
                });
                var tips=JM.getNextChild(input_name);
                tips.innerHTML=errMsg;
                JM.addClass(tips,'show');
            }
        }else{
            JM.reverseIterator(allTips,function (i,item) {
                JM.removeClass(item,'show');
            });
            if(callback) callback();
        }
    }

    function validateForm(form,callback) {
        var validator=new JM.validate.validator();
            if(form.id)
                validator.add(form.id,[{
                    'strategy':'isEmpty',
                    'errorMsg':'学号不能为空'
                },{
                    'strategy':'isNumber',
                    'errorMsg':'学号只能为数字'
                },{
                    'strategy':'minLength:10',
                    'errorMsg':'学号不能小于10位'
                },{
                    'strategy':'maxLength:10',
                    'errorMsg':'学号不能大于10位'
                }]);
            if(form.name)
                validator.add(form.name,[{
                    'strategy':'isEmpty',
                    'errorMsg':'姓名不能为空'
                }]);
            if(form.phone)
                validator.add(form.phone,[{
                    'strategy':'isEmpty',
                    'errorMsg':'手机号码不能为空'
                },{
                    'strategy':'isNumber',
                    'errorMsg':'手机号码只能为数字'
                },{
                    'strategy':'minLength:11',
                    'errorMsg':'手机号码不能小于11位'
                },{
                    'strategy':'maxLength:11',
                    'errorMsg':'手机号码不能大于11位'
                },{
                    'strategy':'isMobile',
                    'errorMsg':'手机号码格式不正确'
                }]);
        if(form.qq)
            validator.add(form.qq,[{
                'strategy':'isEmpty',
                'errorMsg':'qq号码不能为空'
            },{
                'strategy':'isNumber',
                'errorMsg':'qq号只能为数字'
            },{
                'strategy':'minLength:5',
                'errorMsg':'qq号码不能小于5位'
            },{
                'strategy':'maxLength:11',
                'errorMsg':'qq号码不能大于11位'
            }]);
            var data=validator.start();
           if(callback) callback(data);
    }

    function clearForms(obj) {
        for(var i in obj) obj[i].value='';
    }

    function saveInfos(data) {
        JM.ajax('/saveInfo_action','post',true,JSON.stringify(data));
    }

    getInfos();
    function getInfos() {
        JM.ajax('/getInfo_action','get',true,null,function (xhr) {
            var datas=JSON.parse(xhr.responseText);
            if(datas.status){
                var data=datas.data,
                    len=datas.len;
                if(len){
                    localStorage.setItem('infos',JSON.stringify(data));
                }
            }
        });
    }

    function mDInfo(data) {
        JM.ajax('/mDInfo_action','post',true,JSON.stringify(data));
    }

    function bubbleSort(arr,attr,order,type) {
        var i=arr.length-1,pos,j;
        while(i){
            pos=0;
            for(j=0;j<i;j++){
              if(/order/.test(order)){
                  if(/number/.test(type)&&(parseFloat(arr[j][attr])>parseFloat(arr[j+1][attr]))||/string/.test(type)&&(arr[j+1][attr].localeCompare(arr[j][attr])<0)){
                      JM.swap(arr,j,j+1);
                      pos=j;
                  }
              }else{
                  if(/number/.test(type)&&(parseFloat(arr[j][attr])<parseFloat(arr[j+1][attr]))||/string/.test(type)&&(arr[j][attr].localeCompare(arr[j+1][attr])<0)){
                      JM.swap(arr,j,j+1);
                      pos=j;
                  }
              }
            }
            i=pos;
        }
        return arr;
    }

    function selectionSort(arr,attr,order,type) {
        var len=arr.length,
            indexMin;
        for(var i=0;i<len-1;i++){
            indexMin=i;
            for(var j=i+1;j<len;j++){
                if(/order/.test(order)){
                    if(/number/.test(type)&&(parseFloat(arr[j][attr]<parseFloat(arr[indexMin][attr])))||/string/.test(type)&&(arr[j][attr].localeCompare(arr[indexMin][attr])<0)){
                        indexMin=j;
                    }
                }else{
                    if(/number/.test(type)&&(parseFloat(arr[j][attr]>parseFloat(arr[indexMin][attr])))||/string/.test(type)&&(arr[j][attr].localeCompare(arr[indexMin][attr]))){
                        indexMin=j;
                    }
                }
            }
            JM.swap(arr,i,indexMin);
        }
        return arr;
    };

    function insertionSort(arr,attr,order,type) {
        var len=arr.length,
            outer=1,
            inner,
            temp;
        for(;outer<=len-1;++outer){
            temp=arr[outer];
            inner=outer;
            if(/order/.test(order)){
                if(/number/.test(type)){
                    while(inner>0 && (arr[inner-1][attr] >=temp)){
                        arr[inner]=arr[inner-1];
                        --inner;
                    }
                    arr[inner]=temp;
                }else{
                    while(inner && (arr[inner-1][attr].localeCompare(temp[attr])>=0)){
                        arr[inner]=arr[inner-1];
                        --inner;
                    }
                    arr[inner]=temp;
                }
            }else{
                if(/number/.test(type)){
                    while(inner>0 && (arr[inner-1][attr] <=temp)){
                        arr[inner]=arr[inner-1];
                        --inner;
                    }
                    arr[inner]=temp;
                }else{
                    while(inner && (arr[inner-1][attr].localeCompare(temp[attr])<=0)){
                        arr[inner]=arr[inner-1];
                        --inner;
                    }
                    arr[inner]=temp;
                }
            }

        }
        return arr;
    };

    function autoShellSort(arr,attr,order,type) {
        var len=arr.length,
            h=1;
        while (h<len/3) h=3*h+1;
        if(/order/.test(order)){
            if(/number/.test(type)){
                while(h>=1){
                    for(var i=h;i<len;i++){
                        for(var j=i;j>=h&&arr[j][attr]<arr[j-h][attr];j-=h) JM.swap(arr,j,j-h);
                    }
                    h=parseInt((h-1)/3);
                }
            }else{
                while(h>=1){
                    for(var i=h;i<len;i++){
                        for(var j=i;j>=h&&arr[j][attr].localeCompare(arr[j-h][attr])<0;j-=h) JM.swap(arr,j,j-h);
                    }
                    h=parseInt((h-1)/3);
                }
            }
        }else{
            if(/number/.test(type)){
                while(h>=1){
                    for(var i=h;i<len;i++){
                        for(var j=i;j>=h&&arr[j][attr]>arr[j-h][attr];j-=h) JM.swap(arr,j,j-h);
                    }
                    h=parseInt((h-1)/3);
                }
            }else{
                while(h>=1){
                    for(var i=h;i<len;i++){
                        for(var j=i;j>=h&&arr[j][attr].localeCompare(arr[j-h][attr])>0;j-=h) JM.swap(arr,j,j-h);
                    }
                    h=parseInt((h-1)/3);
                }
            }
        }

        return arr;
    };

    function binarySearch(arr,item,attr,type) {
        var low=0,
            high=arr.length-1,
            mid,element;
        if(/number/.test(type))
            while (low<=high){
                mid=Math.floor((low+high)>>1);
                element=arr[mid][attr];
                if(element<item) low=mid+1;
                else if(element>item) high=mid-1;
                else return arr[mid];
            }
        else
            while (low<=high){
                mid=Math.floor((low+high)>>1);
                element=arr[mid][attr];
                if(element.localeCompare(item)<0) low=mid+1;
                else if(element.localeCompare(item)>0) high=mid-1;
                else return arr[mid];
            }
        return -1;
    };
})();
