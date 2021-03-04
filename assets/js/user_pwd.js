$(function () {
    var form = layui.form;
    form.verify({
        pwd: [
            /^[\S]{6,12}$/
            , '密码必须6到12位，且不能出现空格'
        ],
        //判断原密码和新密码是否不同
        samepwd: function (value) {
            if (value === $('[name = oldPwd]').val()) {
                return '新密码和原密码不能相同'
            }
        },
        //判断确认密码和新密码是否相同
        repwd: function (value) {
            if (value !== $('[name=newPwd]').val()) {
                return '两次密码不一致，请重新输入'
            }
        }
    })
    //发起请求实现重新修改密码的功能
    $('.layui-form').on('submit', function (e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/updatepwd',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layui.layer.msg('更新密码失败！')
                }
                layui.layer.msg('更新密码成功！')
                // 重置表单
                $('.layui-form')[0].reset();
                localStorage.removeItem('token');
                location.href = '/login.html'
            }
        })
    })
})