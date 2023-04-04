const lantext={

  headers:{
    ItemListHeader:[
      [
        {text:'Dataset ID',value:'dataSetId'},
        {text: 'File Name',value: 'fileName'},
        {text: 'Labeled/Total',value: 'tagged'},
        {text: 'Category',value: 'category'},
        {text: '',sortable:false,value: 'buttons'}
      ],
      [
        {text:'数据集编号',value:'dataSetId'},
        {text: '文件名',value: 'fileName'},
        {text: '标注进度',value: 'tagged'},
        {text: '数据集合',value: 'category'},
        {text: '',sortable:false,value: 'buttons'}
      ],
    ],

    ItemListHeaderWithKappa:[
      [
        {text:'Dataset ID',value:'dataSetId'},
        {text: 'File Name',value: 'fileName'},
        {text: 'Labeled/Total',value: 'tagged'},
        {text: 'Kappa Value', value: 'kappa'},
        {text: '',sortable:false,value: 'buttons'}
      ],
      [
        {text:'数据集编号',value:'dataSetId'},
        {text: '文件名',value: 'fileName'},
        {text: '标注进度',value: 'tagged'},
        {text: 'Kappa值', value: 'kappa'},
        {text: '',sortable:false,value: 'buttons'}
      ],
    ],


    /*



     */
    viewHeaders:[
      [

        {text: 'Comment ID',value: `comment_id`},


        {text: 'Suggested Label',value: 'tag_result', sortable: true},
        {text:"View", value: "view"},
        {text: '',value: 'details',sortable:false},
      ],
      [

        {text: '评论编号',value: 'comment_id'},


        {text: '审阅结果',value: 'tag_result', sortable: true},
        {text:"审阅", value: "view"},
        {text: '',value: 'details',sortable:false},
      ],
    ],

    viewTagHeader:[
      [
        {text: 'Coder',value: 'tag_user_info'},
        {text:'Confidence',value:'confidence'},
        {text: 'Tag',value: 'tag_value'},
        {text: 'Rationale',value: 'remarks'},
      ],
      [
        {text: '标注者',value: 'tag_user_info'},
        {text:'自信度',value:'confidence'},
        {text: '标记值',value: 'tag_value'},
        {text: '注释',value: 'remarks'},
      ]
    ],

    remarkHeader:[
      [
        {text:'Rationale Content',value:'content'},
      ],
      [
        {text:'备注内容',value:'content'},
      ]
    ],

    commentHeader:[
      [
        {text:'Comment id',value:'comment_id'},
        {text: 'Title',value: 'title'},
        {text: 'Result',value: 'tag_result'},
        {text: 'Content',value: 'content'},
        {text: 'Rating',value: 'rank_level'},
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
        'Functional_Suitability','Performance_Efficiency','Compatibility', 'Usability',
        'Security','Reliability','Maintainability','Portability',
        'Bug_Fix','Others','Contradictions'],
      ['功能性需求',
        '适用性', '性能','兼容性','可用性','安全性','可靠性', '可维护性','可移植性',
        'Bug修复','其他','矛盾'],

    ],
    showingTags: [
      ['Functional Requirements',
        'Functional Suitability','Performance Efficiency','Compatibility', 'Usability',
        'Security','Reliability','Maintainability','Portability',
        'Bug Fix','Others','Contradictions'],
      ['功能性需求',
        '适用性', '性能','兼容性','可用性','安全性','可靠性', '可维护性','可移植性',
        'Bug修复','其他','矛盾'],

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
              { id: 4, name: '可分析性：有效性和效率的程度，可以用来评估对产品或系统的一个或多个零件的预期更改的影响，' +
                  '或诊断产品的缺陷或故障原因，或识别零件 被修改.' },
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
    unsupported_value:["Unsupported Value", "不被支持的值"],
    category_template:["Category Template", "标签组模板"],
    ch_description:["chinese description", "中文描述"],
    en_description:["english description", "英文描述"],
    ch_reference:["chinese reference", "中文名称"],
    en_reference:["english reference", "英文名称"],
    tag_category_name:["Tag Category Name", "标签组名称"],
    tag_table:["Tag Table", "标签表"],
    group_table:["Group Table", "分组表"],
    support:["Find Support: ", "获取支持： "],
    coder:["coder",'标注者'],
    rationale:['rationale','注释'],
    file_name:["fileName","文件名"],
    choose:["choose", "选择"],
    name:["name", "名称"],
    tag_value:["Tag Value","标签值"],
    tag_reference:["Tag Reference","标签名称"],
    mark_process:["Labeling Process", "标注进度"],
    review_process:["Reviewing process", "审阅进度"],
    review_details:["Reviewing Details","审阅详情"],
    details:["Details", "详情"],
    submit:["Submit","提交"],
    none:["None",'空'],
    present_tag:["Present Tag","当前标签"],
    comment_word:["Comment Content","评论内容"],
    Labeling:["Labeling","标注"],
    dataset:["Dataset","数据集"],
    user:["User","用户"],
    upgrade:["Upgrade","升级"],
    update:["Update","更新"],
    review:["Review", "审阅"],
    share:["Share","分享"],
    upload_file:["Upload File","上传文件"],
    get_file:["Get File","获取数据集"],
    marker:["Coder","标注者"],
    reviewer:["Reviewer","审阅者"],
    datasetID:["Dataset ID","数据集ID"],
    getDataSet:["Get Dataset","获取数据集"],
    tag_description:['Tag Description','标签说明'],
    others:['Others','其他'],
    FR:['FR','功能性需求'],
    NFR:['NFR','非功能需求'],
    value:['Value','值'],
    admin:['Admin','管理员'],
    non_functional:['Nonfunctional','非功能性'],
    upload:['Upload','上传'],
    download_data:['Download data','下载数据'],
    graph:['Graph','查看图'],
    look:['Look','查看'],
    content:['Content','内容'],
    tag_id:['Tag id','标注ID'],
    tag_type:['Tag Type','标注类型'],
    comment_id:['Comment ID','评论ID'],
    version_info:['Version No','版本信息'],
    date_info:['Date','评论时间'],
    confidence:['Confidence','置信度'],
    search:['Search','搜索'],
    required:['Required','必填'],
    confirm:['Confirm','确认'],
    back:['Back','返回'],
    administrate:['Administrate Users','管理用户'],
    import_form:['Import Form','导入表格'],
    export_form:['Export Form','导出表格'],
    success:['Success','成功'],
    fail:['Fail','失败'],
    all:['All','所有项'],
    contradictions:['Contradictions','矛盾项'],
    non_confident:['Lower Confidence Items','不自信项'],
    start:['Start','开始'],
    remark:['Rationale','备注'],
    home:['Home','主菜单'],
    mark:['Labeling','标注'],
    view:['Review','审阅'],
    previous:['Previous','上一条'],
    next:['Next','下一条'],
    save:['Save','保存'],
    Total_Time:['Total Time',],
    Previous:['Previous',],
    Chosen_Tag:['Chosen Tag',],
    title:['Title','标题'],
    app_name:['App Name','应用名'],
    rating:['Rating','评分'],
    finish:['Finish','完成'],
    views_list:['Views List','审阅列表'],
    marks_list:['Marks List','标注列表'],
    total:['Total','总'],
    time:['Time','时间'],
    login:['Login','登入'],
    logout:['Log Out','注销'],
    register:['Register','注册'],
    password:['Password','密码'],
    username:['Username','用户名'],
    forgetpassword:['Forget Your Password?','忘记密码？'],
    data:['Data','数据'],
    language:['English','中文'],
    system_title:['CoolTeD: Collaborative Labeling for Textual Dataset','面向群智化需求分析的数据集标注工具'],
    //Collaborative Labeling Textual Dataset
    no_login:['Not Login','未登录'],
    welcome:['Welcome','欢迎'],
    selection:['Selection','选择'],
    area:['Area','区'],
    cancel:['Cancel','取消'],
    original_reference:['Original Reference','原文参考'],
    no:['No','无'],
    tag_category_list:['Tag Category List','标签组列表'],
    tag_category:['Tag Category','标签组'],
    tagged:['tagged', '已标注'],
    dataset_list:['Dataset List','数据集列表'],
    recommended_value:['recommended value','推荐值'],
    review_value:['review value','审阅值'],
  },

  sentences:{
    tags_contained:['tags contained', '所包含的标签'],
    create_new_tag_category:['Create New Category', '创建新标签组'],
    tag_category_edit:['Tag Category Edit', '标签组操作台'],
    tag_category_upload_error:['Tag Category Upload Error', '标签组上传错误'],
    ready_to_tag:["ready to tag","准备标注"],
    choose_tag_category:["Choose Tag Category","选择一个标签组"],
    current_tag_category:["Current Tag Categories","当前标签组"],
    edit_label_category: ['Edit Label Category','修改标签组'],
    upload_dataset:['Upload Dataset', '上传数据集'],
    password_confirmation:['Password Confirmation', '确认密码'],
    reload_data:['Reload Data','重新加载数据'],
    exit_work:['The labeling or reviewing unsaved will be lost, sure to exit now?','未保存的标记或审阅将会丢失，确定现在退出吗？'],
    item_success:[' succeed','成功'],
    item_failed:[' failed','失败'],
    user_duplicated:['user duplicated','用户重复'],
    passwords_different:['passwords different','密码错误'],
    least_eight_words:['at least 8 words','至少8个字符'],
    get_dataset:["Get Dataset","获取数据集"],
    upload_tag_category:["Upload Tag Category","上传标签组"],
    get_dataset_btn:["Get","获取"],
    tags_distribution_chart1:["Distribution of Dataset by Groups","数据根据组别的分布情况"],
    tags_distribution_chart2:["Distribution of Dataset by Categories","数据根据类别的分布情况"],

  }
}



export default lantext;
