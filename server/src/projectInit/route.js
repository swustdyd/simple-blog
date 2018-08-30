import express from 'express'
import path from 'path'
import fs from 'fs'

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
            router[item.method](url, ...item.middleware, controller[item.function].bind(controller));
        });
    }
})

export default router;