import { route, controller, requestSuperAdmin, Method, requestSignin} from '../utils/decorator'
import BaseController from './baseController'
import {SolrOptionsType} from '../type'
import ApiResponse from '../models/apiResponse'
import logger from '../utils/logger'
import {PASSWORD_MD5_KEY, DEFAULT_USER_NAME, DEFAULT_USER_PASSWORD, DEFAULT_MENUS, TOKEN_SECRET, DEFAULT_USER_ID} from '../utils/setting'
import {comparePassword} from '../utils/util'
import BusinessException from '../models/businessException';
import jwt from 'jsonwebtoken'
import {OP} from '../db'

const {ne} = OP;

@controller()
export default class UserController extends BaseController{

    /**
     * 搜索用户
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    @route('/searchUsers')
    async searchUsers(req, res, next){
        try {
            const {offset, pageSize} = req.query;
            const result = await req.services.userService.searchUsers({
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
     * 用户登录
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    @route('/login', Method.POST)
    async login(req, res, next){
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
                const {list} = await req.services.userService.searchUsers({
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
                            token,
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

    /**
     * 用户注册
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    @route('/register', Method.POST)
    async register(req, res, next){
        try {
            const { user } = req.body;
            const apiRes = new ApiResponse();
            const result = await req.services.userService.searchUsers({
                where: {
                    name: user.name
                }
            })
            if(result && result.length > 0){
                throw new BusinessException(`用户名“${user.name}”已存在`)
            }else if(user.password !== user.confirm){
                throw new BusinessException('密码不一致')
            }else{
                await req.services.userService.saveOrUpdateUser(user);
            }
            res.json(apiRes)            
        } catch (e) {
            next(e)
        }
    }

    /**
     * 保存或者修改用户
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    @route('/saveOrUpdateUser', Method.POST)
    async saveOrUpdateUser(req, res, next){
        try {
            const { user } = req.body;
            const apiRes = new ApiResponse();
            let result = [];
            if(user.id){
                result = await req.services.userService.searchUsers({
                    where: {
                        name: user.name,
                        id: {
                            [ne]: user.id
                        }
                    }
                })
            }else{
                result = await req.services.userService.searchUsers({
                    where: {
                        name: user.name
                    }
                })
            }
            
            if(result && result.length > 0){
                throw new BusinessException(`用户名“${user.name}”已存在`)
            }else{
                await req.services.userService.saveOrUpdateUser(user);
                apiRes.setMessage('保存成功')
            }
            res.json(apiRes)            
        } catch (e) {
            next(e)
        }
    }

    /**
     * 获取当前用户
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    @route('/fetchCurrent')
    @requestSignin()
    async fetchCurrent(req, res, next){
        try {
            const {token: {user}} = req;
            const resApi = new ApiResponse();
            let menus = [];
            if(user.id === DEFAULT_USER_ID){
                menus = JSON.stringify(DEFAULT_MENUS);
            }else{
                const role = await req.services.roleService.getRoleById(user.roleId);
                menus = role.menus;
            } 
            resApi.setResult({user, menus})
            res.json(resApi)
        } catch (e) {
            next(e);
        }
    }
}