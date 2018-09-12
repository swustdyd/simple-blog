import { routeFurther, controller } from '../utils/decorator'
import BaseController from './baseController'
import ApiResponse from '../models/apiResponse'
import {SuperAdmin} from '../utils/authority'
import {getAllRoutes} from '../utils/util'
import logger from '../utils/logger';

@controller()
export default class ApiController extends BaseController{

    @routeFurther({
        path: '/getAllRoutes',
        name: '获取所有后台API接口',
        middleware: [SuperAdmin],
        description: '获取所有后台API接口'
    })
    searchApis(req, res, next){
        try {
            if(!global.allRoutes){
                global.allRoutes = getAllRoutes();
                logger.info('获取Url配置')
            }
            const list = global.allRoutes;
            const result = {
                list,
                total: list.length
            };
            const apiRes = new ApiResponse();
            apiRes.setResult(result);
            res.json(apiRes)
        } catch (error) {
            next(error);
        }
    }
}