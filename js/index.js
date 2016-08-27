/**
 * Created by pingbaobei on 2016/7/16.
 */
$(function () {
    //轮播图
    banner();
    //产品页滑动
    productTab();
    //初始化工具提示,将tooltip这个组件初始化
    $('[data-toggle="tooltip"]').tooltip();
})
/*
 * 1.准备数据，JSON格式的数据
 * 2.解析成数据转化为HTML结构，之前的做法是拼接字符串，现在我们使用模板引擎，underscore提供了template方法，通过判断当前是移动端还是PC端，决定我们要渲染的页面
 * 3.渲染到当前页面中
 * 4.监听到屏幕的宽度 HTML结构的切换 渲染
 * */
function banner(){
    /*步骤1.准备数据,是一个数组，有4个对象，一张是PC上的背景图，一张是移动端的图片*/
    var imageList = [
        {
            bgi:'images/slide_01_2000x410.jpg',
            img:'images/slide_01_640x340.jpg'
        },
        {
            bgi:'images/slide_02_2000x410.jpg',
            img:'images/slide_02_640x340.jpg'
        },
        {
            bgi:'images/slide_03_2000x410.jpg',
            img:'images/slide_03_640x340.jpg'
        },
        {
            bgi:'images/slide_04_2000x410.jpg',
            img:'images/slide_04_640x340.jpg'
        }
    ]
    /*步骤二：解析数据转为HTML结构，渲染到页面中*/
    //2.1取一个方法名renderHTML,渲染到页面中
    //2.2去HTML结构书写模板
    var renderHtml = function () {
        /*3.判断*/
        var width = $(window).width();
        /*宽度<768,就是移动端*/
        var isMobile = width<768?true:false;

        //2.4准备好模板
        var pointTemplate = $('#point_template').html();
        var imageTemplate = $('#image_template').html();
        //2.5模板方法
        var pointFuc = _.template(pointTemplate);
        var imageFuc = _.template(imageTemplate);
        //2.6解析数据成HTML结构
        var pointHtml = pointFuc({model:imageList});
        var imageHtml = imageFuc({model:{list:imageList,isM:isMobile}});
        //2.7渲染到页面中
        $('.carousel-indicators').html(pointHtml);
        $('.carousel-inner').html(imageHtml);
    }
    renderHtml();
    /*3.监听到屏幕的宽度 HTML结构的切换 渲染,每次都要监听*/
    /*屏幕尺寸大小不同，改变事件*/
    $(window).on('resize', function () {
        renderHtml();
    }).trigger('resize');
    /*5.移动端滑动切换*/
    var startX = 0;
    var moveX = 0;
    var distanceX = 0;
    var isMove = false;
    /*originalEvent记录的是原生的touch事件的属性，绑定事件*/
    $('.wjs_banner').on('touchstart', function (e) {
        console.log(e);//
        startX= e.originalEvent.touches[0].clientX;
    });
    $('.wjs_banner').on('touchmove', function (e) {
        moveX = e.originalEvent.touches[0].clientX;
        distanceX = moveX - startX;
        isMove = true;
    });
    $('.wjs_banner').on('touchend', function (e) {
        //什么情况才算左滑、右滑 滑动的距离超过50就算滑动
        if(isMove && Math.abs(distanceX)>50){
            if(distanceX>0){
                //上一张,左滑，看bootstrap的轮播图carousel文档
                $('.carousel').carousel('prev');
            }
            else{
                //下一张,next
                $('.carousel').carousel('next');
            }
        }
        //重置数据
        startX = 0;
        moveX = 0;
        distanceX = 0;
        isMove = false;
    });
}
/*4.让产品的标签页可以滑动*/
function productTab(){
    /*
    * 1.有一个大容器
    * 2.子容器的宽度等于所有li的宽度
    * 3.做滑动效果*/
    //1.获取DOM对象,JQ的方法要用JQ获取对象，否则无法使用JQ的方法
    var $parent = $('.nav-tabs-parents');
    var $child = $('.nav-tabs');
    var lis = $child.find('li');
    console.log(lis);
    var width = 0;
    //2.得到每一个li的宽度
    $.each(lis, function (index,dom) {
        /*
        * width 取得是内容的宽度
        * innerWidth 内边距开始计算宽度加上内容的宽度
        * outerWidth 内容加内边距加边框
        * outerWidth(true) 内容加内边距加边框外边距*/
        //dom也可以写this，指的就是li
        width += $(dom).innerWidth();
    });
    /*2.将宽度设置给子容器*/
    $child.width(width);
    /*3.做滑动效果，直接调用京东页面的轮播图滑动效果*/
    itcast.iScroll({
        swipeDom:$parent.get(0),//获得DOM元素
        swipeType:'x',
        swipeDistance:50//假定滑动距离50
    })
}

