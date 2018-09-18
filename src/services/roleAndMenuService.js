import {RoleAndMenusEntity} from '../models/roleAndMenus'
import {service} from '../utils/decorator'
import BusinessException from '../models/businessException'
import {QueryTypes} from '../db/sequelize';
import {db} from '../db'

@service('roleAndMenuService')
export default class TagService {

    constructor(ctx){
        this.ctx = ctx;
        this.roleAndMenusEntity = new RoleAndMenusEntity(ctx);
    }

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

    async saveOrUpdateRoleAndMenus(roleAndMenus){
        const promiseList = [];
        roleAndMenus.forEach((roleAndMenu) => {
            promiseList.push(this.saveOrUpdateRoleAndMenu(roleAndMenu));
        });
        return await Promise.all(promiseList);
    }

    async deleteRoleAndMenusByRoleId(roleId){
        await db.query('delete from roleandmenus where roleId = :roleId', {
            replacements: {
                roleId
            },
            transaction: this.ctx.transaction.getTransaction()
        })
    }
}