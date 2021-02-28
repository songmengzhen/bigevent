//因为每次调用$.get()或$.post()或者$.ajax()的时候
//会先调用ajaxPrefilter这个函数
//在这个函数中，可以拿到我们给ajax提供的配置对象 方便了我们的操作
$.ajavPrefilter(function (options) {
    //在发起真正的请求前 统一拼接请求的根路径
    options.url = 'http://liulongbin.top:3007' + options.url;
})