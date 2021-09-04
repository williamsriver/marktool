const lantext={

  headers:{
    ItemListHeader:[
      [
        {text:'App Dataset',value:'dataSetId'},
        {text: 'Name',value: 'fileName'},
        {text: 'tagged',value: 'tagged'},
        {text: 'reviewed',value: 'reviewed'},
        {text: '',sortable:false,value: 'buttons'}
      ],
      [
        {text:'数据集编号',value:'dataSetId'},
        {text: '文件名',value: 'fileName'},
        {text: '标注进度',value: 'tagged'},
        {text: '审阅进度',value: 'reviewed'},
        {text: '',sortable:false,value: 'buttons'}
      ],
    ],


    /*



     */
    viewHeaders:[
      [

        {text: 'comment ID',value: `comment_id`},
        {text: 'comment title',value: 'title'},


        {text: 'Suggested Label',value: 'viewValue'},
        {text: 'view',value: 'view'},
        {text: 'details',value: 'data-table-expand',sortable:false},
      ],
      [

        {text: '评论编号',value: 'comment_id'},
        {text: '评论标题',value: 'title'},


        {text: '审阅结果',value: 'viewValue'},
        {text: '审阅',value: 'view'},
        {text: '详情',value: 'data-table-expand',sortable:false},
      ],
    ],

    viewTagHeader:[
      [
        {text: 'marker',value: 'tag_user_info'},
        {text:'confidence',value:'confidence'},
        {text: 'mark value',value: 'tag_value'},
      ],
      [
        {text: '标注者',value: 'tag_user_info'},
        {text:'自信度',value:'confidence'},
        {text: '标记值',value: 'tag_value'},
      ]
    ],

    remarkHeader:[
      [
        {text:'content',value:'content'},
      ],
      [
        {text:'备注内容',value:'content'},
      ]
    ],

    commentHeader:[
      [
        {text:'comment id',value:'comment_id'},
        {text: 'title',value: 'title'},
        {text: 'result',value: 'tag_result'},

        {text: 'content',value: 'content'},
        {text: 'rating',value: 'rank_level'},
      ],
      [
        {text:'评论ID',value:'comment_id'},
        {text: '标题',value: 'title'},
        {text: '审阅结果',value: 'tag_result'},
        {text: '内容',value: 'content'},
        {text: '评分',value: 'rank_level'},
      ]
    ]


  },

  tagwords:{
    class:[
      ['Functional','Nonfunctional','Others'],
      ['功能性','非功能性','其他'],
    ],
    //不能加非功能，除非改掉标注的循环逻辑
    tags: [
      ['Functional_requirements',
        'Functional Suitability','Performance Efficiency','Compatibility', 'Usability',
        'Security','Reliability','Maintainability','Portability',
        'Bug_Fix','Others',],
      ['功能性需求',
        '适用性', '性能','兼容性','可用性','安全性','可靠性', '可维护性','可移植性',
        'Bug修复','其他'],
    ],
    taghelpwords:[
      [
        [],
        [
              { id: 2, name: 'Functional Completeness: degree to which the set of functions covers all the specified tasks and user objectives.' },
              { id: 3, name: 'Functional Correctness: degree to which the functions provides the correct results with the needed degree of precision.' },
              { id: 4, name: 'Functional Appropriateness: degree to which the functions facilitate the accomplishment of specified tasks and objectives.' },
        ],

        [
              { id: 2, name: 'Time-behavior: degree to which the response and processing times and ' +
                  'throughput rates of a product or system, when performing its functions, meet requirements.' },
              { id: 3, name: 'Resource utilization: degree to which the amounts and types of resources' +
                  ' used by a product or system, when performing its functions, meet requirements.' },
              { id: 4, name: 'Capacity: degree to which the maximum limits of the product or system, parameter meet requirements.' },
        ],

        [
              { id: 2, name: 'Appropriateness recognisability: degree to which users can recognize whether a product or system is appropriate for their needs.' },
              { id: 3, name: 'Learnability: degree to which a product or system enables the user to' +
                  ' learn how to use it with effectiveness, efficiency in emergency situations.' },
              { id: 4, name: 'Operability: degree to which a product or system is easy to operate, control and appropriate to use.' },
              { id: 5, name: 'User error protection: degree to which a product or system protects users against making errors.' },
              { id: 6, name: 'User interface aesthetics: degree to which a user interface enables pleasing and satisfying interaction for the user.' },
              { id: 7, name: 'Accessibility: degree to which a product or system can be used by people with the widest' +
                  ' range of characteristics and capabilities to achieve a specified goal in a specified context of use.' },
        ],

        [
              { id: 2, name: 'Coexistence: degree to which a product can perform its required functions ' +
                  'efficiently while sharing a common environment and resources with other products, without detrimental impact on any other product.' },
              { id: 3, name: 'Interoperability: degree to which two or more systems, ' +
                  'products or components can exchange information and use the information that has been exchanged.' },

        ],


        [
              { id: 2, name: 'Maturity: degree to which a system, product or component meets needs for reliability under normal operation.' },
              { id: 3, name: 'Availability: degree to which a product or system is operational and accessible when required for use.' },
              { id: 4, name: 'Fault tolerance: degree to which a system, product or component operates as intended despite the presence of hardware or software faults.' },
              { id: 5, name: 'Recoverability: degree to which, in the event of an interruption or a failure,' +
                  ' a product or system can recover the data directly affected and re-establish the desired state of the system.' },
        ],

        [
              { id: 2, name: 'Confidentiality: degree to which the prototype ensures that data are accessible only to those authorized to have access.' },
              { id: 3, name: 'Integrity: degree to which a system, product or component prevents unauthorized access to, or modification of, computer programs or data.' },
              { id: 4, name: 'Non-repudiation: degree to which actions or events can be proven to have taken place, so that the events or actions cannot be repudiated later.' },
              { id: 5, name: 'Accountability: degree to which the actions of an entity can be traced uniquely to the entity.' },
              { id: 6, name: 'Authenticity: degree to which the identity of a subject or resource can be proved to be the one claimed.' },
        ],

        [
              { id: 2, name: 'Modularity: degree to which a system or computer program is composed of discrete components such that a change to one component has minimal impact on other components.' },
              { id: 3, name: 'Reusability: degree to which an asset can be used in more than one system, or in building other assets.' },
              { id: 4, name: 'Analyzability: degree of effectiveness and efficiency with which it is possible to assess the impact on a product or system of an intended change to one or more of its parts,' +
                  ' or to diagnose a product for deficiencies or causes of failures, or to identify parts to be modified.' },
              { id: 5, name: 'Modifiability: degree to which a product or system can be effectively and efficiently modified without introducing defects or degrading existing product quality.' },
              { id: 6, name: 'Testability: degree of effectiveness and efficiency with which test criteria can be established for a system,' +
                  ' product or component and tests can be performed to determine whether those criteria have been met.' },
        ],

        [
              { id: 2, name: 'Adaptability: degree to which a product or system can effectively and efficiently be adapted for different or evolving hardware, software or other operational or usage environments.' },
              { id: 3, name: 'Installability: degree of effectiveness and efficiency in which a product or system can be successfully installed and/or uninstalled in a specified environment.' },
              { id: 4, name: 'Replaceability: degree to which a product can replace another specified software product for the same purpose in the same environment.' },
        ],
      ],
      [
        [],
        [
              { id: 2, name: '功能完整性：功能集涵盖所有指定任务和用户目标的程度。' },
              { id: 3, name: '功能正确性：功能以所需的精确度提供正确结果的程度。' },
              { id: 4, name: '功能适当性：功能在多大程度上促进了特定任务和目标的完成。' },
        ],

        [
              { id: 2, name: '时间行为：产品或系统在执行其功能时，其响应和处理时间以及吞吐率达到要求的程度。' },
              { id: 3, name: '资源利用率：产品或系统在执行其功能时所使用的资源数量和类型满足要求的程度' },
              { id: 4, name: '容量：产品或系统的最大限制，参数满足要求的程度。' },
        ],

        [
              { id: 2, name: '适当的可识别性：用户可以识别产品或系统是否适合其需求的程度。' },
              { id: 3, name: '可学习性：产品或系统使用户能够学习如何在紧急情况下有效，高效地使用产品的程度。' },
              { id: 4, name: '可操作性：产品或系统易于操作，控制和适当使用的程度。' },
              { id: 5, name: '用户错误保护：产品或系统保护用户避免错误的程度。' },
              { id: 6, name: '用户界面美学：用户界面为用户带来令人愉悦和令人满意的交互的程度。' },
              { id: 7, name: '可访问性：具有最广泛的特征和能力的人员可以在特定的使用上下文中使用产品或系统以达到特定目标的程度。' },
        ],


        [
              { id: 2, name: '共存：产品可以有效地执行其所需功能的程度，同时与其他产品共享共同的环境和资源，而不会对任何其他产品造成不利影响。' },
              { id: 3, name: '互操作性：两个或更多系统，产品或组件可以交换信息并使用已交换的信息的程度。' },
        ],



        [
              { id: 2, name: '成熟度：系统，产品或组件在正常操作下满足可靠性需求的程度。' },
              { id: 3, name: '可用性：产品或系统在需要使用时可操作和可访问的程度。' },
              { id: 4, name: '容错能力：尽管存在硬件或软件故障，系统，产品或组件按预期运行的程度。' },
              { id: 5, name: '可恢复性：在发生中断或故障时，产品或系统可以恢复直接受影响的数据并重新建立系统所需状态的程度。' },
        ],

        [
              { id: 2, name: '机密性：原型确保只有授权访问的人才能访问数据的程度。' },
              { id: 3, name: '完整性：系统，产品或组件防止未经授权访问或修改计算机程序或数据的程度。' },
              { id: 4, name: '不可抵赖性：可以证明已发生某种动作或事件的程度，因此以后无法否认这些事件或动作。' },
              { id: 5, name: '问责制：可以将实体的行为唯一地追溯到实体的程度。' },
              { id: 6, name: '真实性：主题或资源的身份可被证明是所主张的程度。' },
        ],

        [
              { id: 2, name: '模块化：系统或计算机程序由离散组件组成的程度，以使对一个组件的更改对其他组件的影响最小。' },
              { id: 3, name: '可重用性：资产可在多个系统中或在构建其他资产中使用的程度。' },
              { id: 4, name: '可分析性：有效性和效率的程度，可以用来评估对产品或系统的一个或多个零件的预期更改的影响，或诊断产品的缺陷或故障原因，或识别零件 被修改.' },
              { id: 5, name: '可修改性：在不引入缺陷或不降低现有产品质量的情况下，可以有效，高效地修改产品或系统的程度。' },
              { id: 6, name: '可测试性：可以为系统，产品或组件建立测试标准并进行测试以确定是否满足这些标准的有效性和效率程度.' },
        ],

       [
              { id: 2, name: '适应性：产品或系统可以有效和高效地适应不同或不断发展的硬件，软件或其他操作或使用环境的程度。' },
              { id: 3, name: '可安装性：在指定环境中可以成功安装和/或卸载产品或系统的有效性和效率。' },
              { id: 4, name: '可替换性：产品可以在同一环境中出于相同目的替换另一指定软件产品的程度。' },
       ],
      ],
    ]
  },

  words:{
    submit:["submit","提交"],
    none:["none",'空'],
    present_tag:["present tag","当前标签"],
    comment_word:["comment content","评论内容"],
    Labeling:["Labeling","标注"],
    dataset:["dataset","数据集"],
    user:["user","用户"],
    upgrade:["upgrade","升级"],
    review:["review", "审阅"],
    share:["share","分享"],
    upload_file:["upload file","上传文件"],
    get_file:["get file","获取数据集"],
    marker:["marker","标注者"],
    reviewer:["reviewer","审阅者"],
    datasetID:["dataset ID","数据集ID"],
    getDataSet:["get dataset","获取数据集"],
    tag_description:['tag description','标签说明'],
    others:['others','其他需求'],
    FR:['FR','功能性需求'],
    NFR:['NFR','非功能需求'],
    value:['value','值'],
    admin:['admin','管理员'],
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
    system_title:['marktool','移动应用数据标注系统'],
    no_login:['no login','未登录'],
    welcome:['welcome','欢迎'],
    selection:['selection','选择'],
    area:['area','区'],
    cancel:['cancel','取消'],
    original_reference:['original reference','原文参考'],
    no:['no','无'],
  },

  sentences:{
    password_confirmation:['password confirmation', '确认密码'],
    reload_data:['reload data','重新加载数据'],
    remark_replicate:['remark areas replicates','选区重复'],
    exit_work:['The mark or view unsaved will be lost, sure to exit now?','未保存的标记或审阅将会丢失，确定现在退出吗？'],
    item_success:[' succeed','成功'],
    item_failed:[' failed','失败'],
    user_duplicated:['user duplicated','用户重复'],
    passwords_different:['passwords different','密码错误'],
    least_eight_words:['at least 8 words','至少8个字符'],
    get_dataset:["get dataset","获取数据集"],
    tags_distribution_chart1:["Distribution of Dataset over FR/NFR/Others","移动应用数据在需求类型中的分布情况（功能/非功能/其他）"],
    tags_distribution_chart2:["Distribution of Dataset over NFR Types","移动应用数据在需求类型中的分布情况（8种非功能需求类型）"],

  }
}



export default lantext;
