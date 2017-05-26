/**
 * Created by jm on 2017/5/5.
 */
/********* PLUG-IN **********/
/*
 modal

 jm-target-------open
 jm-dismiss------hide
 jm-toggle-----modal
 ---------------------------------
     <button jm-target="aa"></buttnon>
     <div id="aa" class="modal">
         <div class="modal_dialog">
             <div class="modal_content">
                 <div class="modal_header">
                    <button type="button" class="close" jm-dismiss>x</button>
                    <h4 class="modal_title">标题</h4>
                 </div>
                 <div class="modal_body"></div>
                 <div class="modal_footer">
                     <button type="button" class="btn btn_primary" jm-dismiss>关闭</button>
                     <button type="button" class="btn btn_primary" jm-dismiss>保存</button>
                 </div>
             </div>
         </div>
     </div>
 */
(function ($) {
   $.Modal=function (modal) {
        this.modal=modal;
        this.cancelBtn=modal.querySelectorAll('[jm-dismiss]');
        this.openBtn=document.querySelectorAll('[jm-target]');
    };
    $.Modal.prototype={
        'constructor':$.Modal,
        'show':function (modal) {
            // modal.style.left=parseInt((document.documentElement.clientWidth||document.body.clientWidth)/2)+'px';
            // modal.style.heiht=parseInt((document.documentElement.clientHeight||document.body.clientHeight)/2)+'px';
            JM.addClass(modal,'show');
        },
        'hide':function (modal){
            JM.removeClass(modal,'show')
        },
        'openModal':function () {
            var _self=this;
            JM.reverseIterator(this.openBtn,function (i,item) {
                JM.addHandler(item,'click',function (e) {
                    JM.stopPropagation(JM.getEvent(e));
                    var jm_target=item.getAttribute('jm-target');
                    if(_self.modal.id===jm_target)
                        _self.show(_self.modal);
                })
            });

        },
        'closeModal':function () {
            var _self=this;
            JM.reverseIterator(this.cancelBtn,function (i,item) {
                JM.addHandler(item,'click',function (e) {
                    JM.stopPropagation(JM.getEvent(e));
                    _self.hide(_self.modal);
                    _self.moveModal(_self.modal).remove();
                },false);
            });
        },
        'moveModal':function (obj) {
             return DragDrop(obj);
        }
    };
    function DragDrop(obj) {
        var dragging=null,
            dX=0,
            dY=0;
        function handleEvent(e) {
            var ev=JM.getEvent(e);
            switch (ev.type){
                case 'mousedown':
                    if(obj.className.indexOf('jm_drag')>-1){
                        dragging=obj;
                        dX=ev.clientX-obj.offsetLeft;
                        dY=ev.clientY-obj.offsetTop;
                    }
                    break;
                case 'mousemove':
                    if(dragging!==null){
                        dragging.style.left=(ev.clientX-dX)+'px';
                        dragging.style.top=(ev.clientY-dY)+'px';
                    }
                    break;
                case 'mouseup':
                    dragging=null;

            };
        };
        return{
            'add':function () {
                JM.addHandler(obj,'mousedown',handleEvent);
                JM.addHandler(document,'mousemove',handleEvent);
                JM.addHandler(obj,'mouseup',handleEvent);
            },
            'remove':function () {
                JM.removeHandler(obj,'mousedown',handleEvent);
                JM.removeHandler(document,'mousemove',handleEvent);
                JM.removeHandler(obj,'mouseup',handleEvent);
            }
        };
    };

    var fn=$.Modal.prototype;
    fn.init=function (modal) {
        var oModal=new $.Modal(modal);
        oModal.openModal();
        oModal.closeModal();
        oModal.moveModal(modal).add();
    };
    var t_toggle=JM.getEles('[jm-toggle]'),len=t_toggle.length;
    for(;len--;) fn.init(t_toggle[len]);
})(window.JM.component);


/*
    forms validation
 */
(function ($) {
    var strategies={
        'isEmpty':function (value,errorMsg) {
            if(value.length===0||/\s/.test(value)) return errorMsg;
        },
        'minLength':function (value,length,errorMsg) {
            if(value.length<length) return errorMsg;
        },
        'maxLength':function (value,length,errorMsg) {
            if(value.length>length) return errorMsg;
        },
        'isMobile':function (value,errorMsg) {
            if(!/^1[3|5|7|8][0-9]{9}$/.test(value)) return errorMsg;
        },
        'isNumber':function (value,errorMsg) {
            if(!/\d/.test(value)) return errorMsg;
        }
    };
    $.validator=function () {
        this.cache=[];
    };
    var  fn=$.validator.prototype;
    fn.add=function (dom,rules) {
        var _self=this;
        for(var i=0,rule;rule=rules[i++];){
            (function (rule) {
                var strategyAry=rule.strategy.split(':'),
                    errorMsg=rule.errorMsg;
                _self.cache.push(function () {
                    var strategy=strategyAry.shift();
                    strategyAry.unshift(dom.value);
                    strategyAry.push(errorMsg);
                   return {
                       'dom':dom,
                       'getErrMsg':strategies[strategy].apply(dom,strategyAry)
                   };
                })
            })(rule);
        }
    };
    fn.start=function () {
        for(var i=0,validateFunc;validateFunc=this.cache[i++];){
            var data=validateFunc(),
                errMsg=data.getErrMsg;
            if(errMsg) return{
                'dom':data.dom,
                'errMsg':errMsg
            };
        }
    };

})(window.JM.validate);