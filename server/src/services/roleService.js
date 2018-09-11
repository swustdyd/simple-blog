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

    async saveOrUpdateRole(role: Role, roleAndMenus = []){
        const {transaction, services} = this.ctx;
        await transaction.startTransaction();
        try {
            //修改
            if(role.id){
                role.updateAt = Date.now();
                const originRole = await this.getRoleById(role.id);
                if(!originRole){
                    throw new BusinessException(`id为'${role.id}'的角色不存在`);
                }
                await this.roleEntity.update(role, {
                    where: {
                        id: role.id
                    }
                });
                // update操作只返回影响的行数，所以需要再次查询
                role = await this.getRoleById(role.id)
                await services.roleAndMenuService.deleteRoleAndMenusByRoleId(role.id)
            }else{
                role = await this.roleEntity.create(role)
            }
            // 新增roleAndMenus
            roleAndMenus = roleAndMenus.map((item) => {
                return {
                    ...item,
                    roleId: role.id,
                    creater: role.editer,
                    editer: role.editer
                };
            });
            await services.roleAndMenuService.saveOrUpdateRoleAndMenus(roleAndMenus)
            await transaction.commit(); 
            return role;
        } catch (error) {
            await transaction.rollback();
            throw error;
        }        
    }

    async saveOrUpdateRoles(roles: Role[]){
        const promiseList = [];
        roles.forEach((role) => {
            promiseList.push(this.saveOrUpdateRole(role));
        });
        return await Promise.all(promiseList);
    }
}