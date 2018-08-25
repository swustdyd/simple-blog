import { route, controller, requestSuperAdmin, Method} from '../utils/decorator'
import BaseController from './baseController'
import ApiResponse from '../models/apiResponse'
import logger from '../utils/logger'
import {DEFAULT_PAGESIZE} from '../utils/setting'
import BusinessException from '../models/businessException';

@controller()
export default class RoleController extends BaseController{

    /**
     * 搜索角色
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    @route('/searchRoles')
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

    /**
     * 保存或者修改角色
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    @route('/saveOrUpdateRole', Method.POST)
    @requestSuperAdmin()
    async saveOrUpdateRole(req, res, next){
        try {
            const { role } = req.body;
            const {user:{id}} = req.token;
            if(role.id){
                role.editer = id;
            }else{                
                role.creater = tag.editer = id;
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