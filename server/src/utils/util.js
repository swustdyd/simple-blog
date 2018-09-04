import crypto from 'crypto'
import path from 'path'
import fs from 'fs'
import logger from '../utils/logger'

/**
 * 对密码进行md5加密
 * @param {*} password 
 * @param {*} key 
 */
export function md5Password(password: string, key: string){
    const md5 = crypto.createHash('md5');
    if(key){
        password += key;
    }
    return md5.update(password).digest('hex');
}

/**
 * 比较密码
 * @param {*} password 明文密码
 * @param {*} passwordMd5 加密后的密码
 * @param {*} key 使用的加密的key
 */
export function comparePassword(password, passwordMd5, key){
    return passwordMd5 === md5Password(password, key);
}

/**
 * 从项目文件中获取所有的路由
 */
export function getAllRoutes(){
    // 存储所有的路由配置信息
    const allRoutes = [];

    // 读取controller文件夹下的文件
    const dirPath = path.resolve(__dirname, '../controllers');
    const controllersTmp = fs.readdirSync(dirPath).map((fileName) => {
        const controller = require(path.join(dirPath, fileName)).default;
        if(controller && controller._isController){
            return new controller();
        }
    })

    // 过滤掉undefined的项
    const controllers = controllersTmp.filter((controller) => {
        return controller !== undefined;
    })

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
    // fs.writeFileSync(path.resolve(__dirname, 'routeConfig.json'), JSON.stringify(allRoutes, null, 4))
    return allRoutes;
}