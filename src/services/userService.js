import {UserEntity} from '../models/user'
import { User, SearchOptions, PageResult} from '../type';
import {service, serviceComment} from '../utils/decorator'
import BusinessException from '../models/businessException'
import {md5Password} from '../utils/util'
import {PASSWORD_MD5_KEY} from '../utils/setting'
import BaseService from './baseService'

@service('userService')
export default class UserService extends BaseService{

    constructor(ctx){
        super(ctx);
        this.userEntity = new UserEntity(ctx);
    }

    /**
     * 搜索用户信息
     * @param {*} options 搜索条件
     * @returns 搜索的结果
     */
    async searchUsers(options: SearchOptions): Promise<PageResult>{
        const datas = await Promise.all([
            this.userEntity.findAll(options), 
            this.userEntity.count(options)
        ])
        return {
            list: datas[0],
            total: datas[1]
        }
    }

    /**
     * 根据id获取用户信息
     * @param {*} id 用户id
     * @returns 用户数据
     */
    async getUserById(id: number): Promise<User>{
        if(!id){
            throw new Error('用户id不能为空');
        }
        return await this.userEntity.findOne({
            where: {
                id
            }
        });
    }

    /**
     * 保存或者修改用户信息
     * @param {*} user 用户信息
     * @returns 存储后的用户信息
     */
    async saveOrUpdateUser(user: User): Promise<User>{
        //对密码进行加密
        if(user.password){
            user.password = md5Password(user.password, PASSWORD_MD5_KEY)
        }
        //修改
        if(user.id){
            user.updateAt = Date.now();
            const originUser = await this.getUserById(user.id);
            if(!originUser){
                throw new BusinessException(`id为'${user.id}'的用户不存在`);
            }
            await this.userEntity.update(user, {
                where: {
                    id: user.id
                }
            });
            // update操作只返回影响的行数，所以需要再次查询
            user = await this.getUserById(user.id)
        }else{
            user = await this.userEntity.create(user)
        }
        return user;
    }

    @serviceComment({
        desc: '批量保存或者修改用户信息',
        params: {
            users: {
                desc: '用户信息数组',
                type: '[Object]'
            }
        },
        returns: {
            desc: '存储后的用户信息',
            type: 'Promise<[Object]>'
        }
    })
    /**
     * 批量保存或者修改用户信息
     * @param {*} users 用户信息数组
     * @returns 存储后的用户信息
     */
    async saveOrUpdateUsers(users: Array<User>): Promise<Array<User>>{
        const promiseList = [];
        users.forEach((user) => {
            promiseList.push(this.saveOrUpdateUser(user));
        });
        return await Promise.all(promiseList);
    }
}