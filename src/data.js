/* eslint-disable no-unused-vars */
/* eslint-disable quote-props */
// const jobData = ['学生', '艺术', '金融', '行政', '计算机软件', '计算机硬件', '建筑', '教育', '媒体', '管理',
//     '服务业', '法律', '医疗', '军事', '政府', '销售', '科研', '运输', '自由职业', '失业', '退休', '其他']

const jobData = ['政府机关', '国企', '事业单位', '民营企业', '个体老板', '自由职业', '军警', '其他工作']
    // const jobOptions = [
    //     {
    //         value: '0',
    //         label: jobData[0]
    //     },
    //     {
    //         value: '1',
    //         label: jobData[1]
    //     },
    //     {
    //         value: '2',
    //         label: jobData[2]
    //     },
    //     {
    //         value: '3',
    //         label: jobData[3]
    //     },
    //     {
    //         value: '4',
    //         label: jobData[4]
    //     },
    //     {
    //         value: '6',
    //         label: jobData[6]
    //     },
    //     {
    //         value: '7',
    //         label: jobData[7]
    //     }
    // ]
const jobOptions = [{
    value: '0',
    label: '金融',
    children: [{
        value: '01',
        label: '国有/股份制银行'
    }, {
        value: '02',
        label: '国有政策性银行'
    }, {
        value: '03',
        label: '外资银行'
    }, {
        value: '04',
        label: '证券/基金公司'
    }, {
        value: '05',
        label: '保险/期货公司'
    }, {
        value: '06',
        label: '互金/小贷公司'
    }, {
        value: '07',
        label: '资管/财富公司'
    }, {
        value: '08',
        label: '金融类公司'
    }]
}, {
    value: '1',
    label: '公务员',
    children: [{
        value: '11',
        label: '部级/省级公务员'
    }, {
        value: '12',
        label: '市级公务员'
    }, {
        value: '13',
        label: '区县/街道公务员'
    }, {
        value: '14',
        label: '公检法公务员'
    }, {
        value: '15',
        label: '政府单位雇员'
    }]
}, {
    value: '2',
    label: '事业单位',
    children: [{
        value: '21',
        label: '小学/中学老师'
    }, {
        value: '22',
        label: '大学老师/研究机构'
    }, {
        value: '23',
        label: '公立医院'
    }, {
        value: '24',
        label: '科教文体单位'
    }, {
        value: '25',
        label: '事业单位'
    }]
}, {
    value: '3',
    label: '国有企业',
    children: [{
        value: '31',
        label: '央企总部'
    }, {
        value: '32',
        label: '央企子公司'
    }, {
        value: '33',
        label: '国有企业'
    }, {
        value: '34',
        label: '国企子公司'
    }]
}, {
    value: '4',
    label: '知名企业',
    children: [{
        value: '41',
        label: '世界/中国五百强'
    }, {
        value: '42',
        label: '知名上市公司'
    }, {
        value: '43',
        label: '会计师事务所'
    }, {
        value: '44',
        label: '律师事务所'
    }, {
        value: '45',
        label: '知名地产公司'
    }, {
        value: '46',
        label: '知名快消品牌'
    }, {
        value: '47',
        label: '知名IT互联网'
    }, {
        value: '48',
        label: '大中型集团公司'
    }, {
        value: '49',
        label: '知名企业'
    }]
}, {
    value: '5',
    label: '民企/外企',
    children: [{
        value: '51',
        label: 'IT互联网公司'
    }, {
        value: '52',
        label: '商贸行业公司'
    }, {
        value: '53',
        label: '服务行业公司'
    }, {
        value: '54',
        label: '制造业公司'
    }, {
        value: '55',
        label: '外贸公司'
    }, {
        value: '56',
        label: '民营企业'
    }, {
        value: '57',
        label: '外资企业'
    }, {
        value: '58',
        label: '中外合资企业'
    }, {
        value: '59',
        label: '白领上班族'
    }]
}, {
    value: '6',
    label: '自主创业',
    children: [{
        value: '61',
        label: '创业自有公司'
    }, {
        value: '62',
        label: '创业自由职业'
    }]
}, {
    value: '7',
    label: '在校/离职',
    children: [{
        value: '71',
        label: '本科在读'
    }, {
        value: '72',
        label: '硕士在读'
    }, {
        value: '73',
        label: '博士在读'
    }, {
        value: '74',
        label: '辞职换工作中'
    }]
}]

const salaryData = ['不限', '3000元以下', '3000~6000元', '6000~12000元', '12000~24000元', '24000~50000元', '50000元以上']

const salaryOptions = [{
        value: '',
        label: salaryData[0]
    },
    {
        value: '1',
        label: salaryData[1]
    },
    {
        value: '2',
        label: salaryData[2]
    },
    {
        value: '3',
        label: salaryData[3]
    },
    {
        value: '4',
        label: salaryData[4]
    },
    {
        value: '5',
        label: salaryData[5]
    },
    {
        value: '6',
        label: salaryData[6]
    },
]

const degreeData = ['不限', '大专以下', '大专', '本科', '硕士', '博士']

const degreeOptions = [{
        value: '0',
        label: degreeData[0]
    },
    {
        value: '1',
        label: degreeData[1]
    },
    {
        value: '2',
        label: degreeData[2]
    },
    {
        value: '3',
        label: degreeData[3]
    },
    {
        value: '4',
        label: degreeData[4]
    },
    {
        value: '5',
        label: degreeData[5]
    }
]

const hobbyData = ['养宠物', '收集', '写作（散文小说诗歌等）', '阅读', '追剧', '逛街', '旅游', '书画棋牌', ' 球类', '冰雪项目 ', ' 登山', '水上项目（游泳潜水冲浪等）',
    '田径项目', '打游戏', '美食烹饪', '歌舞', '朗诵', '听音乐'
]

const genderData = ['男', '女']

const genderOptions = [{
        value: '1',
        label: genderData[0]
    },
    {
        value: '2',
        label: genderData[1]
    }
]

const marriageData = ['未婚', '离异', '丧偶']

const marriageOptions = [{
        value: '1',
        label: marriageData[0]
    },
    {
        value: '2',
        label: marriageData[1]
    },
    {
        value: '3',
        label: marriageData[2]
    }
]

const marriageFavourData = ['不限', '未婚']
const weightData = ['瘦长型', '匀称型', '矮胖型']
const childrenData = ['没有小孩', '小孩不住一起', '小孩住一起']
const childrenDataOptions = [
    { value: "1", label: childrenData[0] },
    { value: "2", label: childrenData[1] },
    { value: "3", label: childrenData[2] },
]
const houseData = ['租房', '住公司', '和家人同住', '已经购房']
const houseDataOptions = [
    { value: "1", label: houseData[0] },
    { value: "2", label: houseData[1] },
    { value: "3", label: houseData[2] },
    { value: "4", label: houseData[3] },
]
const houseFavourData = ['不限', '已购房']
const carData = ['公司配车', '未买车', '已买私人车']
const carDataOptions = [
    { value: "1", label: carData[0] },
    { value: "2", label: carData[1] },
    { value: "3", label: carData[2] }
]
const carFavourData = ['不限', '已购车']
const smokeData = ['不吸烟', '只有应酬才吸烟', '偶尔吸烟', '经常吸烟']
const smokeDataOptions = [
    { value: "1", label: smokeData[0] },
    { value: "2", label: smokeData[1] },
    { value: "3", label: smokeData[2] },
    { value: "4", label: smokeData[3] },
]
const drinkData = ['不喝酒', '只有应酬才喝酒', '偶尔会喝酒', '经常喝酒']
const drinkDataOptions = [
    { value: "1", label: drinkData[0] },
    { value: "2", label: drinkData[1] },
    { value: "3", label: drinkData[2] },
    { value: "4", label: drinkData[3] },
]
const healthData = ['无疾病', '有遗传疾病', '有其他疾病']
const healthDataOptions = [
    { value: "1", label: healthData[0] },
    { value: "2", label: healthData[1] },
    { value: "3", label: healthData[2] }
]
const religionData = ['无宗教信仰', '伊斯兰教', '基督教', '佛教', '其他宗教']
const religionDataOptions = [
    { value: "1", label: religionData[0] },
    { value: "2", label: religionData[1] },
    { value: "3", label: religionData[2] },
    { value: "4", label: religionData[3] },
    { value: "5", label: religionData[4] },
]

const marryData = ['一年内结婚', '1-3年结婚', '3-5年结婚', '5年以后结婚']
const pictureData = ['有照片', '不限']
const gdKey = 'b49f3b0b4e14ffeeef3bf094f66dc669'
const checkStatus = ['审核未通过', '未上传', '未审核', '审核通过']
const checkStatusOptions = [{
        value: -1,
        label: checkStatus[0]
    },
    {
        value: 0,
        label: checkStatus[1]
    },
    {
        value: 1,
        label: checkStatus[2]
    },
    {
        value: 2,
        label: checkStatus[3]
    }
]
export {
    marriageFavourData,
    salaryData,
    salaryOptions,
    degreeData,
    degreeOptions,
    hobbyData,
    jobData,
    jobOptions,
    genderData,
    genderOptions,
    marriageData,
    marriageOptions,
    weightData,
    childrenData,
    houseData,
    carData,
    smokeData,
    drinkData,
    healthData,
    religionData,
    marryData,
    pictureData,
    carFavourData,
    houseFavourData,
    gdKey,
    checkStatusOptions,
    checkStatus,
    childrenDataOptions,
    houseDataOptions,
    carDataOptions,
    smokeDataOptions,
    drinkDataOptions,
    healthDataOptions,
    religionDataOptions
}

const confirmData = ['未通过', '通过']