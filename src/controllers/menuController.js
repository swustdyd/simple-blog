import { routeFurther, controller } from '../utils/decorator'
import BaseController from './baseController'
import ApiResponse from '../models/apiResponse'
import {OP} from '../db'
import {Authority} from '../middlewares/authority'

const {like, eq} = OP;

@controller()
export default class MenuController extends BaseController{

    @routeFurther({
        path: '/searchMenus',
        name: '搜索菜单',
        description: '搜索菜单',
        middleware: [Authority],
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
                desc: '菜单名称，模糊查询',
                type: 'string'
            },
            parentMenu: {
                desc: '菜单的父级菜单Id',
                type: 'number'
            },
            roleId: {
                desc: '拥有该菜单的角色Id',
                type: 'number'
            }
        }
    })
    async searchMenus(req, res, next){
        try {
            const {offset, pageSize, name, parentMenu, roleId} = req.query;
            const option = {
                where: {
                    name,
                    parentMenu,
                    roleId
                },
                limit: pageSize,
                offset
            }
            const result = await req.services.menuService.searchMenus(option);
            const apiRes = new ApiResponse();
            apiRes.setResult(result);
            res.json(apiRes)
        } catch (error) {
            next(error);
        }
    }

    @routeFurther({
        path: '/getAllMenus',
        name: '获取所有的菜单信息',
        middleware: [Authority],
        description: '获取所有的菜单信息'
    })
    async getAllMenus(req, res, next){
        try {
            const result = await req.services.menuService.searchMenus({
                limit: Number.MAX_SAFE_INTEGER,
                offset: 0
            });
            const apiRes = new ApiResponse();
            apiRes.setResult(result);
            res.json(apiRes)
        } catch (error) {
            next(error);
        }
    }

    @routeFurther({
        path: '/saveOrUpdateMenu',
        method: 'post',
        middleware: [Authority],
        name: '新增菜单',
        description: '新增菜单',
        params: {
            role: {
                desc: '提交的菜单数据',
                type: 'Object',
                exp: '{id: number, name: string,... }'
            },
            siblingMenus: {
                desc: '其他同级菜单数据',
                type: 'Array[Object]',
                exp: '[{id: number, name: string,... },...]'
            }
        }
    })
    async addMenu(req, res, next){
        try {
            const { menu, siblingMenus} = req.body;
            const {user:{id}} = req.token;
            if(menu.id){
                menu.editer = id;
            }else{                
                menu.creater = menu.editer = id;
            }
            await req.services.menuService.saveOrUpdateMenus(siblingMenus);
            await req.services.menuService.saveOrUpdateMenu(menu);
            const apiRes = new ApiResponse();
            apiRes.setMessage('保存成功')
            res.json(apiRes)            
        } catch (e) {
            next(e)
        }
    }


}