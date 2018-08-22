import {UserEntity} from '../models/user'
import { User, SearchOptions } from '../type';
import {service} from '../utils/decorator'
import BusinessException from '../models/businessException'
import {md5Password} from '../utils/util'
import {PASSWORD_MD5_KEY} from '../utils/setting'

@service('userService')
export default class UserService {

    constructor(ctx){
        this.ctx = ctx;
        this.userEntity = new UserEntity(ctx);
    }

    async searchUsers(options: SearchOptions){
        return await this.userEntity.findAll(options)
    }

    async getUserById(id: number){
        if(!id){
            throw new Error('用户id不能为空');
        }
        return await this.userEntity.findOne({
            where: {
                id
            }
        });
    }

    async saveOrUpdateUser(user: User){
        //对密码进行加密
        if(user.password){
            user.password = md5Password(user.password, PASSWORD_MD5_KEY)
        }
        //修改
        if(user.id){
            user.updateAt = Date.now();
            const originTag = await this.getTagById(user.id);
            if(!originTag){
                throw new BusinessException(`id为'${user.id}'的用户不存在`);
            }
            user = await this.userEntity.update(user, {
                where: {
                    id: user.id
                }
            });
        }else{
            user = await this.userEntity.create(user)
        }
        return user;
    }

    async saveOrUpdateUsers(users: User[]){
        const promiseList = [];
        users.forEach((user) => {
            promiseList.push(this.saveOrUpdateUser(user));
        });
        return await Promise.all(promiseList);
    }
}