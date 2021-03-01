$(function () {
    getUserInfo();
    //1.获取用户的基本信息
    //3.实现退出功能
    $('#tuichu').on('click', function () {
        layer.confirm('确定退出么？', { icon: 3, title: '提示' }, function (index) {
            localStorage.removeItem('token');
            location.href = 'login.html';
            layer.close(index);
        });
    })
    function getUserInfo() {
        $.ajax({
            type: "get",
            url: "/my/userinfo",
            /* headers: {
                Authorization: localStorage.getItem('token') || ''
            }, */
            success: function (res) {
                console.log(res);
                if (res.status !== 0) {
                    return layui.layer.msg(res.message);
                }
                //获取用户名成功 渲染页面
                rederAvatar(res.data);
            },
            //4.在调用有权限接口的时候 不论成功还是失败 最终都会调用complete回调函数
            /*  complete: function (res) {
                 console.log(res);
                 if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
                     //4.1强制退出index.html页面
                     localStorage.removeItem('token');
                     //4.2 强制跳转到login页面
                     location.href = '/login.html';
                 }
             } */
        })
    }
    //2.渲染用户头像
    function rederAvatar(user) {
        //2.1 获取用户的名称
        var name = user.nickname || user.username;
        //2.3设置欢迎的文本
        $('#welcome').html('欢迎&nbsp;&nbsp;' + name);
        //2.4按需渲染用户头像
        if (user.user_pic !== null) {
            $('.layui-nav-img').attr('src', user.user_pic).show();
            $('.avatar').hide();
        } else {
            //2.5渲染文本头像
            $('.layui-nav-img').hide();
            var first = name[0].toUpperCase();
            $('.avatar').html(first).show();
        }
    }

})

