$(function () {
    var form = layui.form;
    form.verify({
        nickname: function (value) {
            if (value.length > 6) {
                return '昵称长度必须在1~6个字符之间'
            }
        }
    })

    initUserInfo()

    // 初始化用户的基本信息
    function initUserInfo() {
        $.ajax({
            method: 'GET',
            url: '/my/userinfo',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取用户信息失败！')
                }
                // console.log(res)
                //快速给表单赋值
                form.val('formUserInfo', res.data);
            }
        })
    }
    //重置表单中的数据
    $('#reset').on('click', function (e) {
        //阻止表单默认重置
        e.preventDefault();
        initUserInfo();
    })
    //发起请求更新用户信息 监听表单的提交事件
    $('.layui-form').on('submit', function (e) {
        e.preventDefault();
        $.ajax({
            type: 'post',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: function (res) {
                console.log(res);

                if (res.status !== 0) {
                    return layui.layer.msg('更新用户信息失败！')
                }
                // console.log('ok');
                layui.layer.msg('更新用户成功')
                //调用父页面中的方法，重新渲染用户的头像和用户的信息
                window.parent.getUserInfo();
            }
        })
    })
})
