$(function () {
    //1.登录注册页面互相切换 
    //1.1 去登录
    $('.link-login').on('click', function () {
        $('.login-box').show();
        $('.reg-box').hide();
    })
    //1.2 去注册
    $('.link-reg').on('click', function () {
        // alert(123)
        $('.login-box').hide();
        $('.reg-box').show();
    })
    //2.自定义表单验证
    //2.1 先从layui中获取form对象
    var form = layui.form;
    // var layer = layui.layer;
    form.verify({
        pwd: [
            /^[\S]{6,12}$/
            , '密码必须6到12位，且不能出现空格'
        ],
        //2.2 确认密码验证
        //2.3通过形参拿到确认密码的值
        confirm: function (value) {
            //2.4拿到密码框的值
            var pwd = $('.reg-box [name = password]').val();
            if (pwd !== value) {
                return ('两次密码输入不一致，请重新输入')
            }
        }
    })
    //3.监听表单注册的提交事件
    $('#form-reg').on('submit', function (e) {
        //3.1阻止表单默认提交
        e.preventDefault();
        //3.2 获取表单的值
        var data = {
            username: $('.reg-box [name=username]').val(),
            password: $('.reg-box [name=password]').val(),
        }
        //3.3 实现注册功能 发起请求
        $.ajax({
            type: "post",
            url: "/api/reguser",
            data: data,
            success: function (res) {
                if (res.status !== 0) {
                    // return console.log(res.message);
                    return layui.layer.msg(res.message);
                }
                // return console.log('注册成功');
                // layer.msg('注册成功,请登录');
                // console.log(res);

                layui.layer.msg('注册成功,请登录');
                //3.4 模拟人为点击 跳转到登录页面
                $('.link-login').click();
            }
        });
    })
    //4.实现登录功能
    $('#form-login').on('submit', function (e) {
        e.preventDefault();
        var data = $('#form-login').serialize();
        // console.log(data);
        //4.1发起请求
        $.ajax({
            type: 'post',
            url: "/api/login",
            data: data,
            success: function (res) {
                if (res.status !== 0) {
                    return layui.layer.msg(res.message);
                }
                // console.log(res);
                layui.layer.msg('登录成功');
                //4.2将登录成功得到的token字符串保存到localStorage中
                localStorage.setItem('token', res.token);
                //4.3登录成功后跳转到首页
                location.href = 'index/html';
            }
        })
    })
})