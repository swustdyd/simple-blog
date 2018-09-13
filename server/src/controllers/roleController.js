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
        description: '搜索角色',
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
            }
        }
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
        description: '保存或者修改角色',
        params: {
            role: {
                desc: '提交的角色数据',
                type: 'Object',
                exp: '{id: number, name: string,... }'
            },
            roleAndMenus: {
                desc: '该角色拥有的的菜单访问权限',
                type: 'Array[Object]',
                exp: '[{roleId?: number, menuId: number}]'
            },
            roleAndApis: {
                desc: '该角色拥有的Server Api访问权限',
                type: 'Array[Obejct]',
                exp: '[{roleId?: number, apiId: number,...},...]'
            }
        }
    })
    async saveOrUpdateRole(req, res, next){
        try {
            const { role, roleAndMenus } = req.body;
            const {user:{id}} = req.token;
            if(role.id){
                role.editer = id;
            }else{                
                role.creater = role.editer = id;
            }
            await req.services.roleService.saveOrUpdateRole(role, roleAndMenus, roleAndApis)
            const apiRes = new ApiResponse();
            apiRes.setMessage('保存成功');
            res.json(apiRes)          
        } catch (e) {
            next(e)
        }
    }
}