import { routeFurther, controller } from '../utils/decorator'
import BaseController from './baseController'
import ApiResponse from '../models/apiResponse'
import {Authority} from '../middlewares/authority'

@controller()
export default class ApiController extends BaseController{

    @routeFurther({
        path: '/getAllApis',
        name: '获取所有后台API接口',
        middleware: [Authority],
        description: '获取所有后台API接口'
    })
    async getAllApis(){
        const { res, next, services} = this.ctx;
        try {
            const result = await services.apiService.searchApis({
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
        middleware: [Authority],
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
    async searchApis(){
        const {req, res, next, services} = this.ctx;
        try {
            const {offset = 0, pageSize, name, roleId, path} = req.query;
            const result = await services.apiService.searchApis({
                where: {
                    name,
                    roleId,
                    path
                },
                offset,
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