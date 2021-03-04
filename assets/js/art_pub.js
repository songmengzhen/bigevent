$(function () {
    //获取文章列表数据 利用模板引擎
    initCate();
    //3.初始化富文本编辑器
    initEditor();
    function initCate() {
        $.ajax({
            type: 'get',
            url: '/my/article/cates',
            success: function (res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layui.layer.msg('获取文章分类失败！')
                }
                //利用模板引擎渲染数据
                var htmlStr = template('tpl-pub', res);
                $('[name=cate_id]').html(htmlStr);
                //一定要记得 form.render()方法
                layui.form.render();
            }
        })
    }
    //1.初始化图片裁剪器
    var $image = $('#image')
    //2.裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview',
    }
    //3.初始化裁剪区域
    $image.cropper(options);

    //为选择封面的按钮 绑定点击事件
    $('#xuanze').on('click', function () {
        $('#coverFile').click();
    })
    //将选择的图片设置到裁剪区
    //监听coverFile的change事件 获取用户选择的文件列表
    $('#coverFile').on('change', function (e) {
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
    //实现发布文章的功能
    //1.为存为草稿的按钮添加id属性
    //2.定义文章的发布状态
    var art_state = '已发布'
    //3.为存为草稿按钮绑定点击处理函数 如果点击了存为草稿按钮则状态为存为草稿 若不点击这个按钮则为发布状态
    $('#btnSave').on('click', function () {
        art_state = '草稿';
    })
    //给表单注册提交事件
    $('#form-pub').on('submit', function (e) {
        e.preventDefault();
        var fd = new FormData($(this)[0]);
        //将文章的发布状态 存储到fd
        fd.append('state', art_state);
        // 4. 将封面裁剪过后的图片，输出为一个文件对象
        $image
            .cropper('getCroppedCanvas', {
                // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {
                // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                // 5. 将文件对象，存储到 fd 中
                fd.append('cover_img', blob)
                //发起ajax  请求
                publishArticle(fd);
            })
        //发布文章的请求
        function publishArticle(fd) {
            $.ajax({
                type: 'post',
                url: '/my/article/add',
                data: fd,
                //如果向服务器提交的是formdata格式的数据 必须配置一下两个选项
                contentType: false,
                processData: false,
                success: function (res) {
                    if (res.status !== 0) {
                        return layui.layer.msg('发布文章失败！')
                    }
                    console.log('发布文章成功！');
                    //跳转到文章列表页面
                    location.href = '/article/art_list.html'

                }
            })
        }
    })
})
