import fs from 'fs'
import path from 'path'
import logger from '../utils/logger';

const lineBreak = '\r\n';
let extraTypes = [];
const types = [
    'Promise',
    'Object',
    'object',
    'Function',
    'Array',
    'Number',
    'number',
    'String',
    'string',
    'Boolean',
    'boolean',
    'void'
].join(', ');

function checkTypesForType(type = ''){
    const reg = new RegExp('[a-zA-Z]*<[a-zA-Z<>]*?>', 'g')
    const start = type.indexOf('<');
    const end = type.lastIndexOf('>');
    const preType = type.substring(0, start);
    const newType = type.substring(start + 1, end);
    logger.info(type, preType, newType);
    if(types.indexOf(preType) === -1){
        extraTypes.push(preType);
    }

    if(reg.test(newType)){                
        checkTypesForType(newType);
    }else if(types.indexOf(newType) === -1){
        extraTypes.push(newType);
    }
}

function checkExtraTypesForFile(fileString = ''){
    const reg = new RegExp('(:\\s*[a-zA-Z<>]*?[,\\)}])|([a-zA-Z]*<[a-zA-Z<>]*>)', 'g')
    const matchResult = fileString.match(reg);
    if(matchResult){
        let result = matchResult.map((type) => {
            type = type.replace(/[:,\)}\s]/g, '');
            logger.debug(type);
            if(reg.test(type)){                
                checkTypesForType(type);
                return '';
            }else if(types.indexOf(type) === -1){
                return type;
            }else{
                return '';
            }
            
        })
        result = result.filter((type) => { return type})
        extraTypes.push(...result);
    }
}

function formatServicePropertys(filePath) {
    const fileString = fs.readFileSync(filePath, {encoding: 'utf8'});
    const itemReg = new RegExp('\\/\\*\\*[\\s\\S]*?\\*\\/[a-zA-Z()<>:=,\\r\\n\\s]*?{', 'g')
    const commentReg = new RegExp('\\/\\*\\*[\\s\\S]*?\\*\\/', 'g')
    const propertys = [];
    fileString.match(itemReg) && fileString.match(itemReg).forEach((item) => {  
        const comment = item.match(commentReg)[0].replace(/\r\n/g, '\r\n\t');
        let index = item.lastIndexOf('*/');
        let other = item.substring(index + 2);
        
        checkExtraTypesForFile(other);

        index = other.indexOf('(');
        const name = other.substring(0, index).replace(/\r\n/g, '').split(/\s/).filter((item) => {return item && item !== 'async'});
        other = other.substring(index).replace(/\r\n/g, '');
        const params = other.substring(0, other.lastIndexOf(')') + 1);
        const matchResult = other.match(/\)\s*:/);
        const matchString = matchResult ? matchResult[0] : ''; 
        index = matchResult ? matchResult.index : index;
        const returns = matchString ? other.substring(index + matchString.length).replace('{', '').replace(/\s/g, '') : 'void';
        propertys.push(`\t\t${comment}${lineBreak}\t\t${name}: ${params} => ${returns}`)
    })
    return propertys;
}

// 读取services文件夹下的文件
const dirPath = path.resolve(__dirname, '../services');

let services = fs.readdirSync(dirPath).map((fileName) => {
    const service = require(path.join(dirPath, fileName)).default;
    if(service && service._isService){   
        const info = {
            name: service._name,
            desc: service._desc,
            propertys: ''
        }
        info.propertys = formatServicePropertys(path.join(dirPath, fileName)).join(`,${lineBreak}${lineBreak}`);
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
