const lantext={

  headers:{
    ItemListHeader:[
      [
        {text:'App Name',value:'name'},
        {text: 'Time',value: 'datetime_info'},
        {text: 'Comment Number',value: 'comments_id_list.length'},
        {text: '',sortable:false,value: 'buttons'}
      ],
      [
        {text:'应用名称',value:'name'},
        {text: '修改时间',value: 'datetime_info'},
        {text: '评论数',value: 'comments_id_list.length'},
        {text: '',sortable:false,value: 'buttons'}
      ],
    ],


    viewHeaders:[
      [
        {text:'tag ID',value:'tag_id'},
        {text: 'comment ID',value: 'comment_id'},
        {text: 'marker',value: 'tag_user_info'},
        {text:'confidence',value:'confidence'},
        {text: 'mark value',value: 'tag_choose'},
        {text: 'view',value: 'view'},
        {text: 'remarks',value: 'data-table-expand',sortable:false},
      ],
      [
        {text:'标注ID',value:'tag_id'},
        {text: '所属评论ID',value: 'comment_id'},
        {text: '标注者',value: 'tag_user_info'},
        {text:'自信度',value:'confidence'},
        {text: '标记值',value: 'tag_choose'},
        {text: '审阅',value: 'view'},
        {text: '备注',value: 'data-table-expand',sortable:false},
      ],
    ],

    remarkHeader:[
      [
        {text:'content',value:'content'},
        {text: 'reference',value: 'reference'},
      ],
      [
        {text:'备注内容',value:'content'},
        {text: '引用原文',value: 'reference'},
      ]
    ],

    commentHeader:[
      [
        {text:'comment id',value:'comment_id'},
        {text: 'title',value: 'title'},
        {text: 'content',value: 'content'},
        {text: 'rating',value: 'rank_level'},
      ],
      [
        {text:'评论ID',value:'comment_id'},
        {text: '标题',value: 'title'},
        {text: '内容',value: 'content'},
        {text: '评分',value: 'rank_level'},
      ]
    ]


  },

  tagwords:{
    class:[
      ['Nonfunctional','Others','Functional'],
      ['非功能性','其他','功能性'],
    ],
    //不能加非功能，除非改掉标注的循环逻辑
    tags: [
      ['Performance','Compatibility', 'Usability','Security','Maintainability','Portability','Others','Functional_requirements'],
      ['性能', '兼容性', '可用性','安全性', '可维护性', '可移植性','其他','功能类'],
    ],
    taghelpwords:[
      [
        'Speed and efficiency',
        'Adopting ability to various environments during usage',
        'Convenience of using',
        'Capability to protect privacy and data',
        'Convenience of debug and extension',
        'Flexibility to different platforms and environments during developing',
        'Other aspects',
        'Functional parameters',
      ],
      [
        '有关该应用的速度、功能的好坏',
        '对不同运行环境的适应能力',
        '操作是否人性化，是否便捷高效',
        '是否能有效保护用户的个人隐私和数据',
        '是否便于修改维护，以及bug和故障的处理速度',
        '能否和各种平台兼容',
        '其他的方面',
        '功能参数',
      ],
    ]
  },

  words:{
    non_functional:['nonfunctional','非功能性'],
    upload:['upload','上传'],
    download_data:['download data','下载数据'],
    look:['look','查看'],
    content:['content','内容'],
    tag_id:['tag id','标注ID'],
    tag_type:['tag type','标注类型'],
    comment_id:['comment id','评论ID'],
    version_info:['version info','版本信息'],
    date_info:['date','评论时间'],
    confidence:['confidence','自信度'],
    search:['search','搜索'],
    required:['required','必填'],
    confirm:['confirm','确认'],
    back:['back','返回'],
    administrate:['administrate users','管理用户'],
    import_form:['import form','导入表格'],
    export_form:['export form','导出表格'],
    success:['success','成功'],
    fail:['fail','失败'],
    all:['all','所有项'],
    contradictions:['contradictions','矛盾项'],
    non_confident:['not confident','不自信项'],
    start:['start','开始'],
    remark:['remark','备注'],
    home:['home','主菜单'],
    mark:['mark','标注'],
    view:['view','审阅'],
    previous:['previous','上一条'],
    next:['next','下一条'],
    save:['save','保存'],
    Total_Time:['Total Time',],
    Previous:['Previous',],
    Chosen_Tag:['Chosen Tag',],
    title:['title','标题'],
    app_name:['app_name','应用名'],
    rating:['rating','评分'],
    finish:['finish','完成'],
    views_list:['Views List','审阅列表'],
    marks_list:['Marks List','标注列表'],
    total:['total','总'],
    time:['time','时间'],
    login:['login','登入'],
    logout:['logout','注销'],
    register:['register','注册'],
    password:['password','密码'],
    username:['username','用户名'],
    forgetpassword:['forger your password?','忘记密码？'],
    data:['data','数据'],
    language:['english','中文'],
    system_title:['marktool','评价标注系统'],
    no_login:['no login','未登录'],
    welcome:['welcome','欢迎'],
    selection:['selection','选择'],
    area:['area','区'],
    cancel:['cancel','取消'],
    original_reference:['original reference','原文参考'],
    no:['no','无'],
  },

  sentences:{
    reload_data:['reload data','重新加载数据'],
    remark_replicate:['remark areas replicates','选区重复'],
    exit_work:['The mark or view unsaved will be lost, sure to exit now?','未保存的标记或审阅将会丢失，确定现在退出吗？'],
    item_success:[' succeed','成功'],
    item_failed:[' failed','失败'],
    user_duplicated:['user duplicated','用户重复'],
    passwords_different:['passwords different','密码错误'],
    least_eight_words:['at least 8 words','至少8个字符'],
  }
}



export default lantext;
