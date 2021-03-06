import { routeFurther, controller } from '../utils/decorator'
import BaseController from './baseController'
import {SolrOptionsType} from '../type'
import ApiResponse from '../models/apiResponse'
import logger from '../utils/logger'
import {PASSWORD_MD5_KEY, DEFAULT_USER_NAME, DEFAULT_USER_PASSWORD, DEFAULT_MENUS, TOKEN_SECRET, DEFAULT_USER_ID} from '../utils/setting'
import {comparePassword} from '../utils/util'
import BusinessException from '../models/businessException';
import jwt from 'jsonwebtoken'
import {OP} from '../db'
import {Authority} from '../middlewares/authority'

const {ne} = OP;

@controller()
export default class UserController extends BaseController{

    @routeFurther({
        path: '/searchUsers',
        middleware: [Authority],
        name: '搜索用户',
        description: '搜索用户',
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
    async searchUsers(){
        const {req, res, next, services} = this.ctx;
        try {
            const {offset, pageSize} = req.query;
            const result = await services.userService.searchUsers({
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
        path: '/login',
        method: 'post',
        name: '用户登录',
        description: '用户登录',
        params: {
            userName: {
                desc: '用户名',
                type: 'string'
            },
            password: {
                desc: '登录密码',
                type: 'string'
            }
        }
    })
    async login(){
        const {req, res, next, services} = this.ctx;
        try {
            const { password, userName, type } = req.body;
            const apiRes = new ApiResponse();
            if(userName === DEFAULT_USER_NAME && password === DEFAULT_USER_PASSWORD){
                const token = jwt.sign({
                    data: {user:{
                        name: DEFAULT_USER_NAME,
                        id: DEFAULT_USER_ID
                    }}
                }, TOKEN_SECRET);
                apiRes.setResult({
                    // menus: JSON.stringify(DEFAULT_MENUS),
                    token
                })
            }else{
                const {list} = await services.userService.searchUsers({
                    where: {
                        name: userName
                    }
                })
                if(!list || list.length < 1){
                    throw new BusinessException(`用户名“${userName}”不存在`)
                }else{
                    const user = list[0];
                    const isMatch = comparePassword(password, user.password, PASSWORD_MD5_KEY);
                    if(isMatch){
                        user.password = '';
                        const token = jwt.sign({
                            data: {user}
                        }, TOKEN_SECRET);
                        // const role = await req.services.roleService.getRoleById(user.roleId);
                        apiRes.setMessage('登录成功');
                        apiRes.setResult({
                            token
                            // menus: role.menus
                        })
                    }else{
                        throw new BusinessException('用户名或密码不正确')
                    }
                }
            }
            res.json(apiRes)          
        } catch (e) {
            next(e)
        }
    }

    @routeFurther({
        path: '/register',
        method: 'post',
        name: '用户注册',
        description: '用户注册',        
        params: {
            user: {
                desc: '提交的用户数据',
                type: 'Object',
                exp: '{name: string, password: string, email: string,...}'
            }
        }
    })
    async register(){
        const {req, res, next, services} = this.ctx;
        try {
            const { user } = req.body;
            const apiRes = new ApiResponse();
            const result = await services.userService.searchUsers({
                where: {
                    name: user.name
                }
            })
            if(result && result.length > 0){
                throw new BusinessException(`用户名“${user.name}”已存在`)
            }else if(user.password !== user.confirm){
                throw new BusinessException('密码不一致')
            }else{
                await services.userService.saveOrUpdateUser(user);
            }
            res.json(apiRes)            
        } catch (e) {
            next(e)
        }
    }

    @routeFurther({
        path: '/saveOrUpdateUser',
        method: 'post',
        middleware: [Authority],
        name: '保存或者修改用户',
        description: '保存或者修改用户',    
        params: {
            user: {
                desc: '提交的用户数据',
                type: 'Object',
                exp: '{name: string, email: string,...}'
            }
        }
    })
    async saveOrUpdateUser(){
        const {req, res, next, services} = this.ctx;
        try {
            const { user } = req.body;
            const apiRes = new ApiResponse();
            let result = [];
            if(user.id){
                result = await services.userService.searchUsers({
                    where: {
                        name: user.name,
                        id: {
                            [ne]: user.id
                        }
                    }
                })
            }else{
                result = await services.userService.searchUsers({
                    where: {
                        name: user.name
                    }
                })
            }
            
            if(result && result.length > 0){
                throw new BusinessException(`用户名“${user.name}”已存在`)
            }else{
                await services.userService.saveOrUpdateUser(user);
                apiRes.setMessage('保存成功')
            }
            res.json(apiRes)            
        } catch (e) {
            next(e)
        }
    }

    @routeFurther({
        path: '/fetchCurrent',
        middleware: [Authority],
        name: '获取当前用户',
        description: '获取当前用户'
    })
    async fetchCurrent(){
        const {req, res, next, services} = this.ctx;
        try {
            const {token: {user}} = req;
            const resApi = new ApiResponse();
            let returnMenus = [];
            if(user.id === DEFAULT_USER_ID){
                returnMenus = DEFAULT_MENUS;
            }else{
                const role = await services.roleService.getRoleById(user.roleId);
                const option = {
                    where: {
                        roleId: user.roleId
                    },
                    limit: Number.MAX_SAFE_INTEGER,
                    offset: 0
                }
                const {list} = await services.menuService.searchMenus(option);
                returnMenus = list;
            } 
            resApi.setResult({
                user, 
                menus: returnMenus
            })
            res.json(resApi)
        } catch (e) {
            next(e);
        }
    }
}