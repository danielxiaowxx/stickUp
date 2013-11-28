(function() {

    /**
     * 修改者：Daniel
     * 修复地方：
     * 1.元素居顶固定时的宽度保持不变
     * 2.增加fixTopVal option：元素居顶固定时与顶部的距离
     * 3.精简了滚动时变化的代码
     * 4.支持同一个页面多个
     *
     */
    $.fn.stickUp = function( options ) {

        var contentTop = [];
        var content = [];
        var lastScrollTop = 0;
        var scrollDir = '';
        var itemClass = '';
        var itemHover = '';
        var menuSize = null;
        var stickyWidth = 0;
        var topMargin = 0;
        var fixTopVal = 0;
        var element = null;

        $(window).scroll(function(){
            var st = element.scrollTop();
            if (st > lastScrollTop){
                scrollDir = 'down';
            } else {
                scrollDir = 'up';
            }
            lastScrollTop = st;
        });

        // 初始化组件
        element = $(this);
        // adding a class to users div
        element.addClass('stuckMenu');
        //getting options
        var objn = 0;
        if(options != null) {
            for(var o in options.parts) {
                if (options.parts.hasOwnProperty(o)){
                    content[objn] = options.parts[objn];
                    objn++;
                }
            }

            itemClass = options.itemClass;
            itemHover = options.itemHover;
            fixTopVal = options.fixTopVal ? options.fixTopVal.replace('px', '') : 0;
            if(options.topMargin != null) {
                if(options.topMargin == 'auto') {
                    topMargin = parseInt(element.css('margin-top'));
                } else {
                    if(isNaN(options.topMargin) && options.topMargin.search("px") > 0){
                        topMargin = parseInt(options.topMargin.replace("px",""));
                    } else if(!isNaN(parseInt(options.topMargin))) {
                        topMargin = parseInt(options.topMargin);
                    } else {
                        console.log("incorrect argument, ignored.");
                        topMargin = 0;
                    }
                }
            } else {
                topMargin = 0;
            }
            menuSize = $('.'+itemClass).size();
        }
        stickyWidth = parseInt(element.width());
        vartop = parseInt(element.offset().top);


        $(document).on('scroll', function() {
            varscroll = parseInt($(document).scrollTop());
            if(menuSize != null){
                for(var i=0;i < menuSize;i++)
                {
                    contentTop[i] = $('#'+content[i]+'').offset().top;
                    function bottomView(i) {
                        contentView = $('#'+content[i]+'').height()*.4;
                        testView = contentTop[i] - contentView;
                        //console.log(varscroll);
                        if(varscroll > testView){
                            $('.'+itemClass).removeClass(itemHover);
                            $('.'+itemClass+':eq('+i+')').addClass(itemHover);
                        } else if(varscroll < 50){
                            $('.'+itemClass).removeClass(itemHover);
                            $('.'+itemClass+':eq(0)').addClass(itemHover);
                        }
                    }
                    if(scrollDir == 'down' && varscroll > contentTop[i]-50 && varscroll < contentTop[i]+50) {
                        $('.'+itemClass).removeClass(itemHover);
                        $('.'+itemClass+':eq('+i+')').addClass(itemHover);
                    }
                    if(scrollDir == 'up') {
                        bottomView(i);
                    }
                }
            }

            // 向下滚动超过一定距离，元素开始固定
            if(vartop < varscroll + topMargin){

                if (stickyWidth != element.width()) {
                    stickyWidth = element.width();
                }

                element.css("position","fixed").width(stickyWidth).css({
                    top: fixTopVal + 'px'
                }, 10);
            };

            // 向上滚动超过一定距离，元素开始恢复原来的位置
            if(varscroll + topMargin < vartop){
                element.css({"position":"relative", width:'', top:''});
            };
        });
    }
})($);

