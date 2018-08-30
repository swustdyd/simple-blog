import { routeFurther, controller} from '../utils/decorator'
import BaseController from './baseController'
import ApiResponse from '../models/apiResponse'
import logger from '../utils/logger'
import {DEFAULT_PAGESIZE} from '../utils/setting'
import BusinessException from '../models/businessException';
import {SuperAdmin} from '../utils/authority'

@controller()
export default class RoleController extends BaseController{

    @routeFurther({
        path: '/searchRoles',
        name: '搜索角色',
        middleware: [SuperAdmin],
        description: '搜索角色'
    })
    async searchRoles(req, res, next){
        try {
            const {offset, pageSize} = req.query;
            const result = await req.services.roleService.searchRoles({
                limit: pageSize,
                offset
            });
            const apiRes = new ApiResponse();
            apiRes.setResult(result);
            res.json(apiRes)
        } catch (error) {
            next(error);
        }
    }

    @routeFurther({
        path: '/saveOrUpdateRole',
        method: 'post',
        middleware: [SuperAdmin],
        name: '保存或者修改角色',
        description: '保存或者修改角色'
    })
    async saveOrUpdateRole(req, res, next){
        try {
            const { role } = req.body;
            const {user:{id}} = req.token;
            if(role.id){
                role.editer = id;
            }else{                
                role.creater = role.editer = id;
            }
            await req.services.roleService.saveOrUpdateRole(role)
            const apiRes = new ApiResponse();
            apiRes.setMessage('保存成功');
            res.json(apiRes)          
        } catch (e) {
            next(e)
        }
    }
}