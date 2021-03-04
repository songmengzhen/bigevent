$(function () {
    initArtCateList();
    function initArtCateList() {
        $.ajax({
            type: "get",
            url: "/my/article/cates",
            success: function (res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layui.layer.msg('获取文章列表失败！')
                }
                //利用模板引擎 渲染页面
                var htmlStr = template('tpl-article', res);
                $('tbody').html(htmlStr);
            }
        })
    }
    //给添加类别按钮绑定事件
    //1.关闭弹出层
    var indexAdd = null;
    $('#addCate').on('click', function () {
        //2.开启一个弹出层
        indexAdd = layui.layer.open({
            type: 1,
            title: '添加文章分类'
            , content: '可以填写任意的layer代码',
            area: ['500px', '260px'],
            content: $('#tankuang').html(),
        });
    })
    //给弹出框的form表单绑定表单提交事件 要用事件委托
    $('body').on('submit', '#form-add', function (e) {
        e.preventDefault();
        $.ajax({
            type: 'post',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layui.layer.msg('新增文章分类失败！')
                }
                layui.layer.msg('新增文章分类成功！')
                //重新渲染页面
                initArtCateList();
                //清空原表单内容
                // $('#form-add').reset();
                //3.关闭弹出层
                layui.layer.close(indexAdd);
            }
        })
    })
    var indexEdit = null;
    //为编辑按钮添加点击事件 要用事件委托
    $('tbody').on('click', '#edit', function () {
        indexEdit = layui.layer.open({
            type: 1,
            title: '添加文章分类'
            , content: '可以填写任意的layer代码',
            area: ['500px', '260px'],
            content: $('#tan-edit').html(),
        });
        //实现表单的编辑功能 
        //1.先为编辑表单添加自定义data-id={{$value.ID}}属性 拿到当前点击文件的id值
        var id = $(this).attr('data-id');
        // console.log(id);
        //2.在弹出层弹出后 根据id发起请求获取文章分类的数据 并填入表单中
        $.ajax({
            type: 'get',
            url: '/my/article/cates/' + id,
            success: function (res) {
                // console.log(res);
                //快速获取表单的值 通过给表单添加lay-filter类名
                layui.form.val('form-Edit', res.data);
            }
        })
    })
    //为编辑表单绑定提交事件 要用事件委托
    $('body').on('submit', '#form-edit', function (e) {
        e.preventDefault();
        $.ajax({
            type: 'post',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layui.layer.msg('更新分类信息失败！')
                }
                layui.layer.msg('更新分类信息成功！')
                layui.layer.close(indexEdit);
                initArtCateList();
            }
        })
    })
    //点击删除按钮 完成删除功能 用事件委托
    $('tbody').on('click', '#delete', function () {
        // console.log('ok');
        //获取点击当前文件的自定义属性
        var id = $(this).attr('data-id');
        // console.log(id);
        layer.confirm('确定要删除么?', { icon: 3, title: '提示' }, function (index) {
            //发起请求
            $.ajax({
                type: 'get',
                url: '/my/article/deletecate/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layui.layer.msg('删除失败！')
                    }
                    layui.layer.msg('删除成功！')
                    layer.close(index);
                    initArtCateList();
                }
            })
        })
    })
})