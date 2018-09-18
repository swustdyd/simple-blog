import path from 'path'
import fs from 'fs'
import Transaction from './transaction'


export const services = {};

// 读取services文件夹下的文件
const dirPath = path.resolve(__dirname, '../services');
const serviceArray = [];

fs.readdirSync(dirPath).forEach((fileName) => {
    const service = require(path.join(dirPath, fileName)).default;
    if(service && service._isService){      
        serviceArray.push(service);
    }
})

export default (req, res, next) => {
    const services = {};
    req.transaction = new Transaction();
    serviceArray.forEach((service) => {
        const instance = new service(req);
        services[service._name] = instance;
    });
    req.services = services;
    next();
};