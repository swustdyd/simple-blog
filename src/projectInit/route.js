import express from 'express'
import path from 'path'
import fs from 'fs'
import { getAllRoutes } from '../utils/util'
import {ApiModel} from '../models/api'
import {db} from '../db'
import logger from '../utils/logger'

/**
 * 路由
 */
const router = express.Router();

/**
 * 根目录重定向到index.html
 */
router.get('/', (req, res) => {
    res.redirect('/dist/index.html');
});

// 读取controller文件夹下的文件
const dirPath = path.resolve(__dirname, '../controllers');
const controllersTmp = fs.readdirSync(dirPath).map((fileName) => {
    const controller = require(path.join(dirPath, fileName)).default;
    if(controller && controller._isController){
        return new controller();
    }
})

/**
 * 过滤掉undefined的项
 */
export const controllers = controllersTmp.filter((controller) => {
    return controller !== undefined;
})

// 遍历路由配置，绑定到express的路由上
controllers.forEach((controller) => {
    if(controller._routes && controller._routes.length > 0){
        controller._routes.forEach((item) => {
            const url = controller._basePath + item.path;
            item.middleware = item.middleware || [];
            router[item.method](url, ...item.middleware, (req, res, next) => {
                const instance = new controller.__proto__.constructor();
                instance.ctx = {
                    services: req.services
                };
                instance[item.functionName].call(instance, req, res, next);
            })
        });
    }
})

// 将有效api挂载到全局变量
const allRoutes = getAllRoutes();
global.allRoutes = allRoutes;

// 初始化数据库的api
// logger.info('开始初始化数据库的api')
// db.query('update api set status = 0').then(async () => {
//     for (let index = 0; index < allRoutes.length; index++) {
//         const route = allRoutes[index];
//         const result = await ApiModel.findAll({
//             where: {
//                 path: route.path,
//                 method: route.method
//             }
//         })
//         if(result.length > 0){
//             const origin = result[0];
//             await origin.update({
//                 ...origin,
//                 ...route,
//                 params: JSON.stringify(route.params),
//                 updateAt: Date.now(),
//                 status: true
//             })
//         }else{
//             await ApiModel.create({
//                 ...route,
//                 params: JSON.stringify(route.params)
//             })
//         }
//     }       
//     logger.info('成功初始化数据库的api')
// }).catch((e) => {
//     logger.error('初始化api出错', e);
// })

 

export default router;