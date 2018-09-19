import fs from 'fs'
import path from 'path'

function formatParams(comment){
    const {params} = comment;
    const paramsArray = [];
    for (const key in params) {
        const param = params[key];
        paramsArray.push(`${key}: ${param.type}`)
    }
    return paramsArray.length > 0 ? `(${paramsArray.join(', ')}) => {}` : '() => {}';
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
                info.propertys.push(`${comment.desc ? `\t\t/** ${comment.desc} */\r\n` : ''}\t\t${key}: ${formatParams(comment)}`);
            }else if(key !== 'constructor' && type === 'function'){
                info.propertys.push(`\t\t${key}: Function`)
            }
        })
        info.propertys = info.propertys.join(',\r\n');
        return info;
    }
})

services = services.filter((item) => {return item !== undefined})

const data = [];

services.forEach((info) => {
    data.push(`${info.desc ? `\t/** ${info.desc} */\r\n` : ''}\t${info.name}: {\r\n${info.propertys}\r\n\t}`);
})

fs.writeFileSync(
    path.resolve(__dirname, '../type/service.js'), 
    `export type ServiceType = {\r\n${data.join(',\r\n')}\r\n}`
)
