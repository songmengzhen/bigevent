//实现获取文章的列表数据
$(function () {
    //定义美化时间的过滤器
    template.defaults.imports.dateForm = function (date) {
        const dt = new Date(date);
        var y = dt.getFullYear();
        var m = padZero(dt.getMonth() + 1);
        var d = padZero(dt.getDate());
        var hh = padZero(dt.getHours());
        var mm = padZero(dt.getMinutes());
        var ss = padZero(dt.getDay());
        return y + '-' + m + '-' + d + '-' + hh + ':' + mm + ':' + ss
    }
    //定义补零的函数
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }
    //1.定义查询的参数
    var q = {
        pagenum: 1, // 默认请求第一页的数据
        pagesize: 2, // 默认每页显示2条
        cate_id: '', // 文章分类的 Id
        state: '' // 文章的发布状态
    }
    initTable();
    //2.发送请求到服务器 获取发表的文章渲染到页面
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败！')
                }
                // console.log(res);

                // 使用模板引擎渲染页面的数据
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
                //渲染分页的函数
                renderPage(res.total);
            }
        })
    }
    initCate();
    //3.发起请求获取并渲染文章分类的下拉选择框
    function initCate() {
        $.ajax({
            type: 'get',
            url: '/my/article/cates',
            success: function (res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layui.layer.msg('获取文章列表失败！')
                }
                //获取成功 利用模板引擎渲染页面 把form表单中值渲染到所有分类的下拉列表中
                var htmlStr = template('tpl-cate', res);
                $('[name=cate_id]').html(htmlStr);
                //通过layui重新渲染表单区域的UI结构
                layui.form.render();
            }
        })
    }
    //4.为表单绑定提交事件 完成筛选功能
    $('#form-select').on('submit', function (e) {
        e.preventDefault();
        //拿到选中选的值 通过name值
        var cate_id = $('[name=cate_id]').val();
        var state = $('[name=state]').val();
        //为查询中参数对象q中对应的属性赋值
        q.cate_id = cate_id;
        q.state = state;
        //重新渲染页面
        initTable();
    })
    //5.渲染分页的方法 等页面上默认放的两条数据渲染完成后 会去渲染分页部分
    function renderPage(total) {
        // console.log(total);
        //调用laypage.render()方法来渲染分页的结构 在页面中要定义分页的区域<div id="pageBox"></div>
        layui.laypage.render({
            elem: 'pageBox',     //分页的容器 Id
            count: total,        //总数据条数
            limit: q.pagesize,   //每页显示几条数据
            curr: q.pagenum,     //设置默认被选中的分页
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 4, 6, 8, 10],

            //通过jump回调函数拿到当前点击的页码值
            jump: function (obj, first) {
                // console.log(obj.curr);
                //把拿到的页码值赋值给q
                q.pagenum = obj.curr;
                //把最新的条目数 赋值给q这个查询对象的pagesize属性中
                q.pagesize = obj.limit;

                //在这里如果直接调用渲染页面的函数会发生死循环  
                //触发jump回调的方式有两种：1.点击页码的时候,会触发jump回调
                //                        2.调用layui.laypage.render()
                //可以通过first的值判断是哪种方式触发的jump回调
                //如果first的值为true 则证明是第二种方式触发的 否则就是第一种方式
                if (!first) {
                    initTable();
                }
            }
        })
    }
    //实现删除文章的功能 用事件委托
    $('tbody').on('click', '.btn-delete', function () {
        //获取当前页删除按钮的个数
        var btn = $('.btn-delete').length;
        console.log(btn);

        var id = $(this).attr('data-id');
        // console.log(id);
        layer.confirm('确定要删除这条数据么?', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                type: 'get',
                url: '/my/article/delete/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layui.layer.msg('删除失败！')
                    }
                    layui.layer.msg('删除成功！')
                    //解决删除分页时出现的不足  可以根据删除按钮的长度得到此时按钮的个数 然互根据按钮的个数判断此页面还有几条数据
                    //注意：页码值最小必须是1
                    if (btn === 1) {
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1;
                    }
                    initTable();
                    layer.close(index);
                }
            })

        });

    })

})