import path from 'path'
import fs from 'fs'
import logger from '../utils/logger'


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

/**
 * 存储所有的路由配置信息
 */
const allRoutes = [];

// 遍历路由配置
controllers.forEach((controller) => {
    if(controller._routes && controller._routes.length > 0){
        controller._routes.forEach((route) => {
            let names = [];
            if(route.middleware && route.middleware.length > 0){
                names = route.middleware.map((item) => {
                    return item.name;
                })
            }            
            allRoutes.push({
                ...route,
                middleware: names.length > 0 ? names : undefined
            });
        })
    }
})

// 将所有的路由配置存储为一个文件
fs.writeFileSync(path.resolve(__dirname, 'routeConfig.json'), JSON.stringify(allRoutes, null, 4))