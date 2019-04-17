import {chartNames, getWheres} from './chartSetting'
import {scriptForChart} from './script'
import EachGroupFinishData from  './eachGroupFinishData'
import EachGroupWorkData from './eachGroupWorkData'


function renderTemplate(num, template, callback) {
    const tags = [];
    for (let i = 0; i < num; i += 1) {
        tags.push(callback(template, i));
    }
    return tags;
}

export const getChartDatas = {
    [chartNames[0]]: EachGroupWorkData,
    [chartNames[1]]: EachGroupFinishData,
    [chartNames[2]]: []
}

const scripts = {
    [chartNames[0]]: scriptForChart[chartNames[0]],
    [chartNames[1]]: scriptForChart[chartNames[1]],
    [chartNames[2]]: scriptForChart[chartNames[2]]
};

export const getCharts = renderTemplate(chartNames.length, {}, (template, index) => {
    const id = index + 1;
    const name = chartNames[index];
    const script = scripts[name];
    return {
        ...template,
        id,
        sql: name,
        script,
        name,
        where: getWheres[name]
    }
});