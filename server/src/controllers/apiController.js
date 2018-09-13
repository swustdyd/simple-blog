import { routeFurther, controller } from '../utils/decorator'
import BaseController from './baseController'
import ApiResponse from '../models/apiResponse'
import {SuperAdmin} from '../utils/authority'
import {getAllRoutes} from '../utils/util'
import logger from '../utils/logger';

@controller()
export default class ApiController extends BaseController{

    @routeFurther({
        path: '/getAllApis',
        name: '获取所有后台API接口',
        middleware: [SuperAdmin],
        description: '获取所有后台API接口'
    })
    async getAllApis(req, res, next){
        try {
            const result = await req.services.apiService.searchApis({
                offset: 0,
                limit: Number.MAX_SAFE_INTEGER
            })
            const apiRes = new ApiResponse();
            apiRes.setResult(result);
            res.json(apiRes)
        } catch (error) {
            next(error);
        }
    }

    @routeFurther({
        path: '/searchRoutes',
        name: '搜索API接口',
        middleware: [SuperAdmin],
        description: '搜索API接口',
        params: {
            offset: {
                desc: '分页起始位置',
                type: 'number',
                exp: 0
            },
            pageSize: {
                desc: '分页大小',
                type: 'number',
                exp: 10
            },
            name: {
                desc: 'api名称',
                type: 'string'
            },
            roleId: {
                desc: '拥有Api的角色Id',
                type: 'string'
            },
            path: {
                desc: 'api路径',
                type: 'string'
            }
        }
    })
    async searchApis(req, res, next){
        try {
            const {offset, pageSize, name, roleId, path} = req.query;
            const result = await req.services.apiService.searchApis({
                where: {
                    name,
                    roleId,
                    path
                },
                offset: 0,
                limit: pageSize
            })
            const apiRes = new ApiResponse();
            apiRes.setResult(result);
            res.json(apiRes)
        } catch (error) {
            next(error);
        }
    }
}