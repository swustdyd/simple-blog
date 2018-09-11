import { routeFurther, controller } from '../utils/decorator'
import BaseController from './baseController'
import ApiResponse from '../models/apiResponse'
import {OP} from '../db'
import {SuperAdmin} from '../utils/authority'

const {like, eq} = OP;

@controller()
export default class MenuController extends BaseController{

    @routeFurther({
        path: '/searchMenus',
        name: '搜索菜单',
        description: '搜索菜单'
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
        middleware: [SuperAdmin],
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
        middleware: [SuperAdmin],
        name: '新增菜单',
        description: '新增菜单'
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