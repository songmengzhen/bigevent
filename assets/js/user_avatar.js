$(function () {
    // 1.1 获取裁剪区域的 DOM 元素
    var $image = $('#image')
    // 1.2 配置选项
    const options = {
        // 纵横比
        aspectRatio: 1,
        // 指定预览区域
        preview: '.img-preview'
    }

    // 1.3 创建裁剪区域
    $image.cropper(options)

    //给上传按钮添加点击事件
    $('.layui-btn').on('click', function () {
        //模拟人为点击上传文件选择框
        $('#file').click();
    })
    //为文件选择绑定change事件
    $('#file').on('change', function (e) {
        //获取用户选择的文件
        var filelist = e.target.files;
        if (filelist.length === 0) {
            return layui.layer.msg('请选择要上传的照片')
        }
        //拿到用户选择上传的文件
        var file = e.target.files[0]
        //将文件转化为路径
        var imgURL = URL.createObjectURL(file);
        //重新初始化裁剪区域
        $image.cropper('destroy').attr('src', imgURL).cropper(options)
    })
    //给确定按钮绑定事件
    $('#btnUpload').on('click', function () {
        //拿到用户裁剪之后的头像
        var dataURL = $image
            .cropper('getCroppedCanvas', {
                // 创建一个 Canvas 画布
                width: 100,
                height: 100
            })
            .toDataURL('image/png') // 将 Canvas 画布上的内容，转化为 base64 格式的字符串
        //调用接口，把头像上传到服务器
        $.ajax({
            type: 'post',
            url: '/my/update/avatar',
            data: {
                avatar: dataURL,
            },
            success: function (res) {
                if (res.status !== 0) {
                    return layui.layer.msg('更新头像失败！')
                }
                layui.layer.msg('更新头像成功！')
                //重新渲染页面 调用父类中的函数
                window.parent.getUserInfo();
            }
        })
    })
})