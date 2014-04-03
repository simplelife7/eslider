/**
 * eslider
 * author: reeqiwu
 * version: 1.0
 * use : $('#element').eslider()
 */

(function ($) {

    var Eslider;

    function Eslider(element, options) {
        this.ver = 1.0;
        this.$element = $(element);
        this.options = $.extend({}, $.fn.eslider.defaults,options);
        this.init();
    }

    Eslider.prototype = {
        index : null ,
        _index : null,
        curIdx : 0,
        timer : null,

        /**
         * 分解元素，并赋到this上
         */ 
        setElemsData : function(){
            var options = this.options,
                $imgList,
                $imgItems,
                $tiggerList,
                $tiggerItems,
                $preBtn,
                $nextBtn;

            if(this.options.imgWrap == ''){
                $imgList = this.$element.find('ul').eq(0);
                $imgItems = $imgList.find('li');
            }else{
                $imgList = this.$element.find(this.options.imgWrap).eq(0);
                $imgItems = $imgList.find('li');
            }

            if(this.options.tiggerWrap == ''){
                $tiggerList = this.$element.find('ul').eq(1);
                $tiggerItems = $tiggerList.find('li');
            }else{
                $tiggerList = this.$element.find(this.options.tiggerWrap).eq(0);
                $tiggerItems = $tiggerList.find('li');
            }

            if(this.options.preBtn !== '' ){
                $preBtn = this.$element.find(this.options.preBtn).eq(0);
                $nextBtn = this.$element.find(this.options.nextBtn).eq(0);
            }else{
                $preBtn = '';
                $nextBtn = '';
            }

            this.imgList = $imgList,
            this.imgItems = $imgItems,
            this.tiggerList = $tiggerList,
            this.tiggerItems = $tiggerItems,
            this.imgWidth = $imgItems.eq(0).width(),
            this.imgHeight = $imgItems.eq(0).height(),
            this.preBtn = $preBtn,
            this.nextBtn = $nextBtn,
            this.imgsNum = $imgItems.length
            
        },

        /**
         * 设置第一幕随机
         */
        setIdxRandom : function(){
            if(this.options.indexRandom){
                this.index = Math.floor(Math.random() * this.imgsNum );
            }
        },

        /**
         * 预加载
         */
        lazyLoad : function(){
            var _this = this;
            if(_this.options.lazyLoad){
                var lazyLoadAttr = _this.options.lazyLoadAttr;
                var imgSrc1 = _this.imgItems.eq(_this.index).find('img').eq(0).attr(lazyLoadAttr);
                _this.imgItems.eq(_this.index).find('img').eq(0).attr('src',imgSrc1);
                _this.loadNextImg();
            }                 
        },

        /**
         * 下一张
         */
        loadNextImg : function(){
            if(this.options.lazyLoad){
                var _this = this;
                var elemsData = this;                
                var nextIdx = (_this.curIdx == _this.index) ? _this.curIdx + 1 : 0;
                var img = _this.imgItems.eq(_this.curIdx).find('img');
                var imgNext = _this.imgItems.eq(nextIdx).find('img');
                if(img.attr('src') == undefined){
                    var src = img.attr(_this.options.lazyLoadAttr);
                    img.attr('src',src);
                }
                if(imgNext.attr('src') == undefined){
                    var src = imgNext.attr(_this.options.lazyLoadAttr);
                    imgNext.attr('src',src);
                }
            }
        },

        /**
         * 初始化方向效果
         */        
        initDirection : function(){
            var _this = this;
            var elemsData = this;
            switch (_this.options.direction){
                case 'none':
                    _this.imgList.css({'top':- _this.imgHeight * _this.index + 'px'});
                    this.switchNoEffect();
                    break;
                case 'h':
                    _this.imgList.css({'width':_this.imgWidth * _this.imgsNum + 'px','left': - _this.index * _this.imgWidth + 'px'});
                    _this.imgItems.css({'float':'left'});

                    this.switchHorizontal();
                    break;
                case 'v' :
                    _this.imgList.css({'top': - _this.index * _this.imgHeight + 'px'});
                    this.switchVertical()
                    break;
                case 'fade' :
                    _this.imgList.css({width:_this.imgWidth + 'px',height:_this.imgHeight + 'px'})
                    _this.imgItems.css({'position':'absolute','left':0,'top':0})
                    _this.imgItems.eq(_this.index).css({'z-index':2})
                    this.switchFade()
                    break;
            }

        },

        /**
         * 前后翻页
         */ 
        turn : function(func1,func2){
            var _this = this;
            var elemsData = this;
            var options = this.options;
            if(_this.preBtn !== ''){
               _this.preBtn.hover(function(){
                    clearInterval(_this.timer);
                },function(){
                    _this.intervalFunc(function(){
                        func1();
                    })
                });

               _this.nextBtn.hover(function(){
                    clearInterval(_this.timer);
                },function(){
                    _this.intervalFunc(function(){
                        func1();
                    })
                });

                _this.preBtn.on('click', function(e) {
                    e.preventDefault();
                    if(_this.curIdx == 0){
                        _this.curIdx = _this.imgsNum - 1;
                    }else{
                        _this.curIdx -= 1;
                    }
                    func2();                  
                    _this.index = _this.curIdx;
                    _this._index = _this.index;
                    
                });

                _this.nextBtn.on('click', function(e) {
                    e.preventDefault();
                    if(_this.curIdx == _this.imgsNum - 1){
                        _this.curIdx = 0;
                    }else{
                        _this.curIdx += 1;
                    }
                    func2();
                    _this.index = _this.curIdx;
                    _this._index = _this.index;
                    
                });

            }
        },

        /**
         * 循环函数
         */         
        intervalFunc : function(func){
            var _this = this;
            var elemsData = this;
            var options = this.options;
            var  intervalFunc = function(){
                if(_this.index == _this.imgsNum - 1){
                    func();
                    _this._index = _this.index;
                    _this.index = 0;
                }else{
                    func();
                    _this._index = _this.index;
                    _this.index++;
                }               
            } 
            this.timer = setInterval(intervalFunc,_this.options.delay);
        },

        /**
         * 自动播放
         */ 
        autoPlay : function(func){
            var _this = this;
            var options = this.options;
            var elemsData = this;
            if(_this.options.autoPlay){
                _this.index = (_this.index < _this.imgsNum - 1) ? _this.index + 1 : 0;
                _this.intervalFunc(function(){
                    func();

                })

                _this.imgList.hover(function(e){
                    clearInterval(_this.timer);
                },function(e){
                    _this.intervalFunc(function(){
                        func();

                    })
                })
                
            }
        },

        /**
         * tigger的切换事件
         */ 
        switchEvent : function(func){
            var _this = this;

            _this.tiggerItems.on(_this.options.switchMode,function(e) {
                _this.index = $(e.target).index();
                if(e.type == 'click'){
                    clearInterval(_this.timer);
                    func();      
                    _this._index = _this.index;
                }else if(e.type == 'mouseenter'){
                    clearInterval(_this.timer);
                    func();     
                }else if(e.type == 'mouseleave'){
                    _this._index = _this.index; 
                    _this.index =  (_this.index < _this.imgsNum - 1) ? _this.index + 1 : 0;          
                }

            });

        },

        /**
         * 无效果切换
         */         
        switchNoEffect : function(){
            var _this = this;
            var options = this.options;
            var elemsData = this;

            _this.autoPlay(function(){
                _this.noEffect(_this.index);
            })

            _this.turn(function(){
                _this.noEffect(_this.index);
            },function(){
                _this.noEffect(_this.curIdx);
            })

            _this.switchEvent(function(){
                _this.noEffect(_this.index); 
            })

        },

        /**
         * 渐变切换
         */ 
        switchFade : function(){
            var _this = this;
            var elemsData = this;
            var options = this.options;
            _this._index  = _this.index;

            _this.autoPlay(function(){
                _this.fade(_this.index,_this._index);
            })

            _this.turn(function(){
                _this.fade(_this.index,_this._index);
                
            },function(){
                _this.fade(_this.curIdx,_this._index);
            })

            _this.switchEvent(function(){
                _this.fade(_this.index,_this._index); 
            })

        },

        /**
         * 水平切换
         */ 
        switchHorizontal  : function(){
            var _this = this;
            var elemsData = this;
            var options = this.options;

            _this.autoPlay(function(){

                _this.horizontal(_this.index);
            })

            _this.turn(function(){
                _this.horizontal(_this.index);
                
            },function(){
                _this.horizontal(_this.curIdx);
            })

            _this.switchEvent(function(){
                _this.horizontal(_this.index); 
            })

        },

        /**
         * 垂直切换
         */
        switchVertical : function () {
            var _this = this;
            var options = this.options;
            var elemsData = this;

            _this.autoPlay(function(){
                _this.vertical(_this.index);
            })

            _this.turn(function(){
                _this.vertical(_this.index);
                
            },function(){
                _this.vertical(_this.curIdx);
            })


            _this.switchEvent(function(){
                _this.vertical(_this.index); 
            })
         
        },

        /**
         * 无效果切换的样式
         */        
        noEffect : function(index){
            var _this = this;
            var options = this.options;
            var elemsData = this;
            _this.curIdx = index;
            _this.loadNextImg();
            _this.imgList.css({'top':- _this.imgHeight * index + 'px'});
            _this.tiggerItems.removeClass(_this.options.tiggerCurClass).eq(index).addClass(_this.options.tiggerCurClass);

        },

        /**
         * 渐变切换的样式
         */ 
        fade : function(index,_index){
            var _this = this;
            var options = this.options;
            var elemsData = this;
            if(index !== _index){
                _this.curIdx = index;
                _this.loadNextImg();
                _this.imgItems.eq(index).css({'z-index':3,'opacity':0}).fadeTo(_this.options.speed,1);
                _this.imgItems.eq(_index).css({'z-index':2,'opacity':1}).fadeTo(_this.options.speed,0);
                _this.tiggerItems.removeClass(_this.options.tiggerCurClass).eq(index).addClass(_this.options.tiggerCurClass);
            }

        },

        /**
         * 水平切换的样式
         */ 
        horizontal : function(index){
            var _this = this;
            var options = this.options;
            var elemsData = this;
            _this.curIdx = index;
            _this.loadNextImg();
            _this.imgList.animate({'left': - index * _this.imgWidth + 'px'},_this.options.speed);
            _this.tiggerItems.removeClass(_this.options.tiggerCurClass).eq(index).addClass(_this.options.tiggerCurClass);
        },

        /**
         * 垂直切换的样式
         */         
        vertical : function(index,node){
            var _this = this;
            var options = this.options;
            var elemsData = this;
            _this.curIdx = index;
            _this.loadNextImg();
            _this.imgList.animate({'top': - index * _this.imgHeight + 'px'},_this.options.speed);
            _this.tiggerItems.removeClass(_this.options.tiggerCurClass).eq(index).addClass(_this.options.tiggerCurClass);
        },

        /**
         * 初始化样式
         */ 
        initStyle : function(){
            var _this = this;
            this.imgList.css({'position':'relative'});
            this.tiggerItems.eq(this.index).addClass(_this.options.tiggerCurClass);
        },

        /**
         * 初始化
         */ 
        init:function(){
            this.index = this.options.index;
            this.setElemsData();
            this.setIdxRandom();
            this.initStyle();
            this.lazyLoad();
            this.initDirection();
        },

    };

    $.fn.eslider = function (options) {
        return this.each(function () {
            var $me = $(this),
                instance = $me.data('eslider');
            if(!instance){
                $me.data('eslider', new Eslider(this, options));
            }
            if ($.type(options) === 'string') instance[options]();
        });
    };

    /**
     * 插件的默认值
     */
    $.fn.eslider.defaults = {
        imgWrap : '',  //图片容器，默认第一个ul
        tiggerWrap :'', //切换点容器，默认第二个ul
        autoPlay : true, //自动播放
        delay : 2000, //每张图片切换的间隔事件
        speed : 300, //切换动画的速度
        index : 0, //首次加载第几张图，默认第一张
        switchMode : 'hover', //切换模式：hover、click
        lazyLoad : false, //是否预加载下一张图
        lazyLoadAttr : 'data-lazy', //预加载图所在的属性
        indexRandom : false, //首次是否随机加载
        direction : 'none', //方向或效果:  none(无动画)、v(垂直方向滚动)、h(水平方向滚动)、fade(渐变)
        tiggerCurClass :'cur', //切换按钮当前台的class
        preBtn : '', //切换至前一张图的按钮
        nextBtn : ''//切换至后一张图的按钮
    };

    $(function () {
        $('[data-eslider]').eslider();
    });
})(jQuery);