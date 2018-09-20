import fs from 'fs'
import path from 'path'

const lineBreak = '\r\n';
let extraTypes = [];

function getType(typeString = ''){
    const start = typeString.indexOf('@');
    const end = typeString.lastIndexOf('@');
    if(start !== -1 && end !== -1){
        const extraType = typeString.substring(start + 1, end);
        extraTypes.push(extraType);
    }
    return typeString.replace(/\@/g, '');
}


function formatParams(comment){
    const {params, returns} = comment;
    const paramsArray = [];
    for (const key in params) {
        const param = params[key];
        paramsArray.push(`${key}: ${getType(param.type)}`)
    }
    return `(${paramsArray.join(', ')}) => ${returns && returns.type ? getType(returns.type) : 'void'}`;
}

function formatDesc(comment){
    const {params, desc, returns} = comment;
    const paramsDescArray = [];
    for (const key in params) {
        const param = params[key];
        paramsDescArray.push(`${key} ${param.desc}`)
    }
    return desc ? `\t\t/** ${desc} ${paramsDescArray.length > 0 ? `${lineBreak}\t\t * @param ${paramsDescArray.join(`${lineBreak}\t\t * @param `)}` : ''}${lineBreak}\t\t * @returns ${returns ? returns.desc : ''}${lineBreak}\t\t */${lineBreak}` : '';
}

// 读取services文件夹下的文件
const dirPath = path.resolve(__dirname, '../services');

let services = fs.readdirSync(dirPath).map((fileName) => {
    const service = require(path.join(dirPath, fileName)).default;
    if(service && service._isService){
        const serviceInstance = new service({});        
        const info = {
            name: service._name,
            desc: service._desc,
            propertys: []
        }
        const {_comments = {}} = serviceInstance;
        let propertyKeys = Object.getOwnPropertyNames(serviceInstance.__proto__);
        propertyKeys = propertyKeys.concat(Object.getOwnPropertyNames(serviceInstance));
        propertyKeys.forEach((key) => {
            const property = serviceInstance[key];
            const type = typeof property;
            const comment = _comments[key]
            if(key !== 'constructor' && type === 'function' && comment){                
                info.propertys.push(`${formatDesc(comment)}\t\t${key}: ${formatParams(comment)}`);
            }else if(key !== 'constructor' && type === 'function'){
                info.propertys.push(`\t\t${key}: Function`)
            }
        })
        info.propertys = info.propertys.join(`,${lineBreak}${lineBreak}`);
        return info;
    }
})

services = services.filter((item) => {return item !== undefined})

const data = [];

services.forEach((info) => {
    data.push(`${info.desc ? `\t/** ${info.desc} */${lineBreak}` : ''}\t${info.name}: {${lineBreak}${lineBreak}${info.propertys}${lineBreak}\t}`);
})

extraTypes = [...(new Set(extraTypes))];

function importExtraTypes(importPath = '', extraTypes){
    return `import {${extraTypes.join(', ')}} from '${importPath}'`
}

const isDev = process.env.NODE_ENV !== 'production'; 

if(isDev){
    fs.writeFileSync(
        path.resolve(__dirname, '../type/service.js'), 
        `${extraTypes.length > 0 ? `${importExtraTypes('./index.js', extraTypes)}${lineBreak}${lineBreak}` : ''}export type ServiceType = {${lineBreak}${lineBreak}${data.join(`,${lineBreak}${lineBreak}`)}${lineBreak}}`
    )
}else{
    fs.writeFileSync(
        path.resolve(__dirname, '../type/service.js'), 
        '// do not create type file at production'
    )
}
