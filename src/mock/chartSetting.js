import EachGroupFinishData from './eachGroupFinishData'
import EachGroupWorkData from './eachGroupWorkData'

const getAllGroup = () => {
    return EachGroupWorkData.map((item, index) => {
        return {
            value: index,
            label: item['次集团']
        }
    })
};

const allGroup = getAllGroup();

const getAllDepartment = () => {
    return EachGroupFinishData.map((item, index) => {
        return {
            value: index,
            label: item['部门']
        }
    })
};

const allDepartment = getAllDepartment();

export const chartNames = [
    '各班次上班及時報表',
    '各班次結束及時報表',
    '日報表'
];

export const types = ['input', 'select', 'radio', 'checkbox', 'datePicker', 'rangePicker'];

export const getWheres = {
    [chartNames[0]]: [
        {
            type: 'rangePicker',
            key: 'rangePick',
            label: '选择时间'
        },
        {
            type: 'select',
            key: 'groupSelect',
            label: '选择次集团',
            datas: allGroup
            // datas: [
            //   {
            //     value: 1,
            //     label: 'A次集团',
            //   },
            //   {
            //     value: 2,
            //     label: 'B次集团',
            //   },
            //   {
            //     value: 3,
            //     label: 'C次集团',
            //   },
            // ],
        }
    ],
    [chartNames[1]]: [
        {
            type: 'rangePicker',
            key: 'rangePick',
            label: '选择时间'
        },
        {
            type: 'select',
            key: 'groupSelect',
            label: '选择次集团',
            datas: allGroup
        },
        {
            type: 'select',
            key: 'departmentSelect',
            label: '选择部门',
            datas: allDepartment
        }
    ],
    [chartNames[2]]: []
}