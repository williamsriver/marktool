/**
 * tag category
 * the tags need : values, references, descriptions
 * the tags cannot be modified in coolted because it can't be saved,
 * and the specific rules may vary from different users
 * @type {{values: [string, string], desc: {"ch": [], "en": [string, string]}}}
 */
const tag_category = {
    "name":"ISO 25010",
    "group":[
      {
        "name":"Functional",
        "list":[0]
      },
      {
        "name":"Non Functional",
        "list":[1,2,3,4,5,6,7,8]
      },
      {
        "name":"Others",
        "list":[9,10]
      }
    ],
    "tags":[
      {
        "value": "Functional_requirements",
        "reference":{
          "en":"Functional Requirements",
          "ch":"功能性需求"
        },
        "description":{
          "en":[],
          "ch":[]
        }
      },
      {
        "value": "Functional_Suitability",
        "reference":{
          "en":"Functional Suitability",
          "ch":"适用性"
        },
        "description":{
          "en":[
            "<p>Functional Completeness: degree to which the set of functions covers",
            "all the specified tasks and user objectives.</p>",
            "<p>Functional Correctness: degree to which the functions provides",
            "the correct results with the needed degree of precision.</p>",
            "<p>Functional Appropriateness: degree to which the functions facilitate",
            "the accomplishment of specified tasks and objectives </p>"
          ],
          "ch": [
            "<p>功能完整性：功能集涵盖所有指定任务和用户目标的程度 </p>",
            "<p>功能正确性：功能以所需的精确度提供正确结果的程度。 </p>",
            "<p>功能适当性：功能在多大程度上促进了特定任务和目标的完成。 </p>"
          ]
        }
      },
      {
        "value": "Performance_Efficiency",
        "reference":{
          "en":"Performance Efficiency",
          "ch":"性能"
        },
        "description":{
          "en":[
            "<p>Time-behavior: degree to which the response and processing times and",
            "throughput rates of a product or system, when performing its functions, meet requirements.</p>",
            "<p>Resource utilization: degree to which the amounts and types of resources",
            "used by a product or system, when performing its functions, meet requirements. </p>",
            "<p>Capacity: degree to which the maximum limits of the product or system, parameter meet requirements. </p>"
          ],
          "ch":[
            "<p>时间行为：产品或系统在执行其功能时，其响应和处理时间以及吞吐率达到要求的程度。 </p>",
            "<p>资源利用率：产品或系统在执行其功能时所使用的资源数量和类型满足要求的程度 </p>",
            "<p>容量：产品或系统的最大限制，参数满足要求的程度。 </p>"
          ]
        }
      },
      {
        "value": "Compatibility",
        "reference":{
          "en":"Compatibility",
          "ch":"兼容性"
        },
        "description":{
          "en":[
            "<p>Coexistence: degree to which a product can perform its required functions",
            "efficiently while sharing a common environment and resources with other products,",
            " without detrimental impact on any other product. </p>",
            "<p>Interoperability: degree to which two or more systems,",
            "products or components can exchange information and use the information that has been exchanged. </p>"
          ],
          "ch":[
            "<p>共存：产品可以有效地执行其所需功能的程度，同时与其他产品共享共同的环境和资源，而不会对任何其他产品造成不利影响。 </p>",
            "<p>互操作性：两个或更多系统，产品或组件可以交换信息并使用已交换的信息的程度。 </p>"
          ]
        }
      },
      {
        "value": "Usability",
        "reference": {
          "en": "Usability",
          "ch": "可用性"
        },
        "description": {
          "en":[
            "<p>Appropriateness recognisability: degree to which users can recognize whether a product",
            " or system is appropriate for their needs </p>",
            "<p>Learnability: degree to which a product or system enables the user to learn how to use it",
            " with effectiveness, efficiency in emergency situations. </p>",
            "<p>Operability: degree to which a product or system is easy to operate, control and appropriate to use. </p>",
            "<p>User error protection: degree to which a product or system protects users against making errors. </p>",
            "<p>User interface aesthetics: degree to which a user interface enables pleasing and satisfying interaction for the user. </p>",
            "<p>Accessibility: degree to which a product or system can be used by people with the widest",
            " range of characteristics and capabilities to achieve a specified goal in a specified context of use. </p>"
          ],
          "ch": [
            "<p>适当的可识别性：用户可以识别产品或系统是否适合其需求的程度。 </p>",
            "<p>可学习性：产品或系统使用户能够学习如何在紧急情况下有效，高效地使用产品的程度。 </p>",
            "<p>可操作性：产品或系统易于操作，控制和适当使用的程度。 </p>",
            "<p>用户错误保护：产品或系统保护用户避免错误的程度。 </p>",
            "<p>用户界面美学：用户界面为用户带来令人愉悦和令人满意的交互的程度。 </p>",
            "<p>可访问性：具有最广泛的特征和能力的人员可以在特定的使用上下文中使用产品或系统以达到特定目标的程度。 </p>"
          ]
        }
      },
      {
        "value": "Security",
        "reference": {
          "en": "Security",
          "ch": "安全性"
        },
        "description": {
          "en":[
            "<p>Confidentiality: degree to which the prototype ensures that data are accessible only",
            " to those authorized to have access. </p>",
            "<p>Integrity: degree to which a system, product or component prevents unauthorized",
            " access to, or modification of, computer programs or data </p>",
            "<p>Non-repudiation: degree to which actions or events can be proven to have taken ",
            "place, so that the events or actions cannot be repudiated later </p>",
            "<p>Accountability: degree to which the actions of an entity can be traced uniquely to the entity. </p>",
            "<p>Authenticity: degree to which the identity of a subject or resource can be proved to be the one claimed. </p>"
          ],
          "ch":[
            "<p>机密性：原型确保只有授权访问的人才能访问数据的程度。 </p>",
            "<p>完整性：系统，产品或组件防止未经授权访问或修改计算机程序或数据的程度。 </p>",
            "<p>不可抵赖性：可以证明已发生某种动作或事件的程度，因此以后无法否认这些事件或动作。 </p>",
            "<p>问责制：可以将实体的行为唯一地追溯到实体的程度。 </p>",
            "<p>真实性：主题或资源的身份可被证明是所主张的程度。 </p>"
          ]
        }
      },
      {
        "value": "Reliability",
        "reference": {
          "en": "Reliability",
          "ch": "可靠性"
        },
        "description": {
          "en":[
            "<p>Maturity: degree to which a system, product or component meets needs for reliability under normal operation. </p>",
            "<p>Availability: degree to which a product or system is operational and accessible when required for use. </p>",
            "<p>Fault tolerance: degree to which a system, product or component operates as intended ",
            "despite the presence of hardware or software faults. </p>",
            "<p>Recoverability: degree to which, in the event of an interruption or a failure,",
            " a product or system can recover the data directly affected and re-establish the desired state of the system. </p>"
          ],
          "ch":[
            "<p>成熟度：系统，产品或组件在正常操作下满足可靠性需求的程度。 </p>",
            "<p>可用性：产品或系统在需要使用时可操作和可访问的程度。 </p>",
            "<p>容错能力：尽管存在硬件或软件故障，系统，产品或组件按预期运行的程度。 </p>",
            "<p>可恢复性：在发生中断或故障时，产品或系统可以恢复直接受影响的数据并重新建立系统所需状态的程度。 </p>"
          ]
        }
      },
      {
        "value": "Maintainability",
        "reference": {
          "en": "Maintainability",
          "ch": "可维护性"
        },
        "description": {
          "en":[
            "<p>Modularity: degree to which a system or computer program is composed",
            " of discrete components such that a change to one component has minimal impact on other components. </p>",
            "<p>Reusability: degree to which an asset can be used in more than one system, or in building other assets. </p>",
            "<p>Analyzability: degree of effectiveness and efficiency with which",
            " it is possible to assess the impact on a product or system of an intended change to one or more of its parts",
            "or to diagnose a product for deficiencies or causes of failures, or to identify parts to be modified.</p>",
            "<p>Modifiability: degree to which a product or system can be effectively and efficiently",
            "modified without introducing defects or degrading existing product quality. </p>",
            "<p>Testability: degree of effectiveness and efficiency with which test criteria can",
            "be established for a system product or component and tests can be performed to determine whether those ",
            "criteria have been met. </p>"
          ],
          "ch": [
            "<p>模块化：系统或计算机程序由离散组件组成的程度，以使对一个组件的更改对其他组件的影响最小。</p>",
            "<p>可重用性：资产可在多个系统中或在构建其他资产中使用的程度。</p>",
            "<p>可分析性：有效性和效率的程度，可以用来评估对产品或系统的一个或多个零件的预期更改的影响",
            "，或诊断产品的缺陷或故障原因，或识别零件 被修改.</p>",
            "<p>可修改性：在不引入缺陷或不降低现有产品质量的情况下，可以有效，高效地修改产品或系统的程度。</p>",
            "<p>可测试性：可以为系统，产品或组件建立测试标准并进行测试以确定是否满足这些标准的有效性和效率程度.</p>"
          ]
        }
      },
      {
        "value": "Portability",
        "reference": {
          "en": "Portability",
          "ch": "可移植性"
        },
        "description": {
          "en":[
            "<p>Adaptability: degree to which a product or system can effectively",
            "and efficiently be adapted for different or evolving hardware,",
            "software or other operational or usage environments. </p>",
            "<p>Installability: degree of effectiveness and efficiency in",
            "which a product or system can be successfully installed and/or uninstalled in a specified environment.</p>",
            "<p>Replaceability: degree to which a product can replace",
            "another specified software product for the same purpose in the same environment.</p>"
          ],
          "ch":[
            "<p>适应性：产品或系统可以有效和高效地适应不同或不断发展的硬件，软件或其他操作或使用环境的程度。 </p>",
            "<p>可安装性：在指定环境中可以成功安装和/或卸载产品或系统的有效性和效率。 </p>",
            "<p>可替换性：产品可以在同一环境中出于相同目的替换另一指定软件产品的程度。</p>"
          ]
        }
      },
      {
        "value": "Bug_Fix",
        "reference":{
          "en":"Bug Fix",
          "ch":"Bug修复"
        },
        "description":{
          "en":[],
          "ch":[]
        }
      },
      {
        "value": "Others",
        "reference":{
          "en":"Others",
          "ch":"其他"
        },
        "description":{
          "en":[],
          "ch":[]
        }
      }
    ]
  }
export default tag_category;
