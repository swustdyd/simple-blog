import {RoleEntity} from '../models/role'
import { Role, SearchOptions } from '../type';
import {service} from '../utils/decorator'
import BusinessException from '../models/businessException'
import {md5Password} from '../utils/util'
import {PASSWORD_MD5_KEY} from '../utils/setting'
import {PageResult} from '../type'

@service('roleService')
export default class RoleService {

    constructor(ctx){
        this.ctx = ctx;
        this.roleEntity = new RoleEntity(ctx);
    }

    async searchRoles(options: SearchOptions): Promise<PageResult>{
        const datas = await Promise.all([
            this.roleEntity.findAll(options), 
            this.roleEntity.count(options)
        ])
        return {
            list: datas[0],
            total: datas[1]
        }
    }

    async getRoleById(id: number){
        if(!id){
            throw new Error('角色id不能为空');
        }
        return await this.roleEntity.findOne({
            where: {
                id
            }
        });
    }

    async saveOrUpdateRole(role: Role){
        if(role.menus){
            role.menus = JSON.stringify(role.menus);
        }
        //修改
        if(role.id){
            role.updateAt = Date.now();
            role.editer = this.ctx.token.user.id;
            const originRole = await this.getRoleById(role.id);
            if(!originRole){
                throw new BusinessException(`id为'${role.id}'的角色不存在`);
            }
            role = await this.roleEntity.update(role, {
                where: {
                    id: role.id
                }
            });
        }else{
            role.creater = role.editer = this.ctx.token.user.id;
            role = await this.roleEntity.create(role)
        }
        return role;
    }

    async saveOrUpdateRoles(roles: Role[]){
        const promiseList = [];
        roles.forEach((role) => {
            promiseList.push(this.saveOrUpdateRole(role));
        });
        return await Promise.all(promiseList);
    }
}