import {RoleAndMenusEntity} from '../models/roleAndMenus'
import {service, serviceComment} from '../utils/decorator'
import BusinessException from '../models/businessException'
import {QueryTypes} from '../db/sequelize';
import {db} from '../db'
import BaseService from './baseService'

@service('roleAndMenuService')
export default class RoleAndMenuService extends BaseService{

    constructor(ctx){
        super(ctx);
        this.roleAndMenusEntity = new RoleAndMenusEntity(ctx);
    }

    @serviceComment({
        desc: '根据id获取roleAndMenu',
        params: {
            roleAndMenus: {
                desc: 'roleAndMenu的id',
                type: 'number'
            }
        },
        returns: {
            desc: 'roleAndMenu数据',
            type: 'Promise<Object>'
        }
    })
    async getRoleAndMenuById(id: number){
        if(!id){
            throw new Error('roleAndMenu的id不能为空');
        }
        return await this.roleAndMenusEntity.findOne({
            where: {
                id
            }
        });
    }

    @serviceComment({
        desc: '保存或者修改roleAndMenu，有id则更新，无id则新增',
        params: {
            roleAndMenu: {
                desc: 'roleAndMenu的数据',
                type: 'Object'
            }
        },
        returns: {
            desc: '保存后的roleAndMenu数据',
            type: 'Promise<Object>'
        }
    })
    async saveOrUpdateRoleAndMenu(roleAndMenu){
        //修改
        if(roleAndMenu.id){
            roleAndMenu.updateAt = Date.now();
            const originTag = await this.getTagById(roleAndMenu.id);
            if(!originTag){
                throw new BusinessException(`id为'${roleAndMenu.id}'的roleAndMenu不存在`);
            }
            await this.roleAndMenusEntity.update(roleAndMenu, {
                where: {
                    id: roleAndMenu.id
                }
            });
            // update操作只返回影响的行数，所以需要再次查询
            roleAndMenu = await this.getRoleAndMenuById(roleAndMenu.id)
        }else{
            roleAndMenu = await this.roleAndMenusEntity.create(roleAndMenu)
        }
        return roleAndMenu;
    }

    @serviceComment({
        desc: '批量保存或者修改roleAndMenu，有id则更新，无id则新增',
        params: {
            roleAndMenus: {
                desc: 'roleAndMenu的数据',
                type: '[Object]'
            }
        },
        returns: {
            desc: '保存后的roleAndMenu数据',
            type: 'Promise<[Object]>'
        }
    })
    async saveOrUpdateRoleAndMenus(roleAndMenus){
        const promiseList = [];
        roleAndMenus.forEach((roleAndMenu) => {
            promiseList.push(this.saveOrUpdateRoleAndMenu(roleAndMenu));
        });
        return await Promise.all(promiseList);
    }

    @serviceComment({
        desc: '根据角色id删除RoleAndMenu',
        params: {
            roleId: {
                desc: '角色id',
                type: 'number'
            }
        },
        returns: {
            type: 'Promise<void>'
        }
    })
    async deleteRoleAndMenusByRoleId(roleId){
        await this.roleAndMenusEntity.query('delete from roleandmenus where roleId = :roleId', {
            replacements: {
                roleId
            }
        })
    }
}