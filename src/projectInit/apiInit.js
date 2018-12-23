import {ApiModel} from '../models/api'
import {db} from '../db'
import logger from '../utils/logger'
import { ALL_ROUTES } from './route'

const allRoutes = ALL_ROUTES;

// 初始化数据库的api
logger.info('开始初始化数据库的api')
db.query('update api set status = 0').then(async () => {
    for (let index = 0; index < allRoutes.length; index++) {
        const route = allRoutes[index];
        const result = await ApiModel.findAll({
            where: {
                path: route.path,
                method: route.method
            }
        })
        if(result.length > 0){
            const origin = result[0];
            await origin.update({
                ...origin,
                ...route,
                params: JSON.stringify(route.params),
                updateAt: Date.now(),
                status: true
            })
        }else{
            await ApiModel.create({
                ...route,
                params: JSON.stringify(route.params)
            })
        }
    }       
    logger.info('成功初始化数据库的api')
    process.exit(0)
}).catch((e) => {
    logger.error('初始化api出错', e);
})