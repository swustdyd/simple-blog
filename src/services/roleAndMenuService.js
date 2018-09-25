import {RoleAndMenusEntity} from '../models/roleAndMenus'
import {service} from '../utils/decorator'
import BusinessException from '../models/businessException'
import BaseService from './baseService'

@service('roleAndMenuService')
export default class RoleAndMenuService extends BaseService{

    constructor(ctx){
        super(ctx);
        this.roleAndMenusEntity = new RoleAndMenusEntity(ctx);
    }

    /**
     * 根据id获取roleAndMenu
     * @param {*} id roleAndMenu的id
     * @returns roleAndMenu数据
     */
    async getRoleAndMenuById(id: number): Promise<Object>{
        if(!id){
            throw new Error('roleAndMenu的id不能为空');
        }
        return await this.roleAndMenusEntity.findOne({
            where: {
                id
            }
        });
    }

    /**
     * 保存或者修改roleAndMenu，有id则更新，无id则新增
     * @param {*} roleAndMenu roleAndMenu的数据
     * @returns 保存后的roleAndMenu数据
     */
    async saveOrUpdateRoleAndMenu(roleAndMenu: Object): Promise<Object>{
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

    /**
     * 批量保存或者修改roleAndMenu，有id则更新，无id则新增
     * @param {*} roleAndMenus roleAndMenu的数据
     * @returns 保存后的roleAndMenu数据
     */
    async saveOrUpdateRoleAndMenus(roleAndMenus: Array<Object>): Promise<Array<Object>>{
        const promiseList = [];
        roleAndMenus.forEach((roleAndMenu) => {
            promiseList.push(this.saveOrUpdateRoleAndMenu(roleAndMenu));
        });
        return await Promise.all(promiseList);
    }

    /**
     * 根据角色id删除RoleAndMenu
     * @param {*} roleId 角色id
     */
    async deleteRoleAndMenusByRoleId(roleId: number): Promise<void>{
        await this.roleAndMenusEntity.query('delete from roleandmenus where roleId = :roleId', {
            replacements: {
                roleId
            }
        })
    }
}