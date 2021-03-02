//因为每次调用$.get()或$.post()或者$.ajax()的时候
//会先调用ajaxPrefilter这个函数
//在这个函数中，可以拿到我们给ajax提供的配置对象 方便了我们的操作
$.ajaxPrefilter(function (options) {
    //在发起真正的请求前 统一拼接请求的根路径
    options.url = 'http://ajax.frontend.itheima.net' + options.url;
    // options.url = 'http://www.liulongbin.top:3007' + options.url;

    //在有权限的地方设置统一的请求头 方便后期使用
    if (options.url.indexOf('/my/') !== -1) {
        options.headers = {
            Authorization: localStorage.getItem('token') || ''
        }
    }
    //全局统一挂载complete函数
    options.complete = function (res) {
        if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
            //4.1强制退出index.html页面
            localStorage.removeItem('token');
            //4.2 强制跳转到login页面
            location.href = 'login.html';
        }
    }
})