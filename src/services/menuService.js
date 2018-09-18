import {MenuEntity} from '../models/menu'
import {RoleAndMenusModel} from '../models/roleAndMenus'
import { SearchOptions } from '../type';
import {service} from '../utils/decorator'
import BusinessException from '../models/businessException'
import {PageResult} from '../type'
import {db} from '../db'
import {QueryTypes} from '../db/sequelize'

@service('menuService')
export default class RoleService {

    constructor(ctx){
        this.ctx = ctx;
        this.menuEntity = new MenuEntity(ctx);
    }

    async searchMenus(options: SearchOptions): Promise<PageResult>{
        const {where = {}, offset, limit} = options;
        const {name, parentMenu, roleId} = where;
        const replacements = {offset, limit, name, parentMenu, roleId};
        const selectSql = 'select m.* from menu m';
        const pageSql = 'limit :offset, :limit';
        let joinSql = [];
        let whereSql = [];
        if(name){

            whereSql.push('name like \'%:name%\'')
        }
        if(parentMenu === 0 || parentMenu){
            whereSql.push('parentMenu = :parentMenu')
        }
        if(roleId){
            whereSql.push('ram.roleId = :roleId')
            joinSql.push('inner join roleandmenus ram on m.id = ram.menuId')
        }

        joinSql = joinSql.join(' ');
        whereSql = `where 1=1 ${whereSql.length > 0 ? `and ${whereSql.join(' and ')}` : ''}`
        const datas = await Promise.all([
            // this.menuEntity.findAll(options),
            // this.menuEntity.count(options)
            db.query(`${selectSql} ${joinSql} ${whereSql} ${pageSql}`, {
                type: QueryTypes.SELECT,
                replacements,
                transaction: this.ctx.transaction.getTransaction()
            }),
            db.query(`select count(*) as total from menu m ${joinSql} ${whereSql}`, {
                type: QueryTypes.SELECT,
                replacements,
                transaction: this.ctx.transaction.getTransaction()
            })
        ])
        return {
            list: datas[0],
            total: datas[1][0].total
        }
    }

    async getMenuById(id: number){
        if(!id){
            throw new Error('菜单id不能为空');
        }
        return await this.menuEntity.findOne({
            where: {
                id
            }
        });
    }

    async saveOrUpdateMenu(menu){
        //修改
        if(menu.id){
            menu.updateAt = Date.now();
            const originMenu = await this.getMenuById(menu.id);
            if(!originMenu){
                throw new BusinessException(`id为'${menu.id}'的菜单不存在`);
            }
            await this.menuEntity.update(menu, {
                where: {
                    id: menu.id
                }
            });
            // update操作只返回影响的行数，所以需要再次查询
            menu = await this.getMenuById(menu.id)
        }else{
            menu = await this.menuEntity.create(menu)
        }
        return menu;
    }

    async saveOrUpdateMenus(menus){
        const promiseList = [];
        menus.forEach((menu) => {
            promiseList.push(this.saveOrUpdateMenu(menu));
        });
        return await Promise.all(promiseList);
    }
}