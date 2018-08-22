import { route, controller, requestSuperAdmin, Method} from '../utils/decorator'
import BaseController from './baseController'
import {SolrOptionsType} from '../type'
import ApiResponse from '../models/apiResponse'
import logger from '../utils/logger'
import {PASSWORD_MD5_KEY} from '../utils/setting'
import {comparePassword} from '../utils/util'
import BusinessException from '../models/businessException';

@controller()
export default class UserController extends BaseController{

    /**
     * 搜索用户
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    @route('/searchUsers')
    searchUsers(req, res, next){
        try {
            const {offset, pageSize, keyWord} = req.query;
            const options: SolrOptionsType = {
                start: offset,
                rows: pageSize,
                q: keyWord
            }
            throw new Error('开发中...')
            res.send('message')
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
            const result = await req.services.userService.searchUsers({
                where: {
                    name: userName
                }
            })
            if(!result || result.length < 1){
                throw new BusinessException(`用户名“${userName}”不存在`)
            }else{
                const user = result[0];
                const isMatch = comparePassword(password, user.password, PASSWORD_MD5_KEY);
                if(isMatch){
                    apiRes.setMessage('登录成功')
                }else{
                    throw new BusinessException('用户名或密码不正确')
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


}