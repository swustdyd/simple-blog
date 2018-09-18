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
        const datas = await Promise.all([
            this.userEntity.findAll(options), 
            this.userEntity.count(options)
        ])
        return {
            list: datas[0],
            total: datas[1]
        }
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

    async saveOrUpdateUsers(users: User[]){
        const promiseList = [];
        users.forEach((user) => {
            promiseList.push(this.saveOrUpdateUser(user));
        });
        return await Promise.all(promiseList);
    }
}