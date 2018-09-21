import {MenuEntity} from '../models/menu'
import {RoleAndMenusModel} from '../models/roleAndMenus'
import { SearchOptions } from '../type';
import {service, serviceComment} from '../utils/decorator'
import BusinessException from '../models/businessException'
import {PageResult} from '../type'
import {db} from '../db'
import {QueryTypes} from '../db/sequelize'
import BaseService from './baseService'

@service('menuService', '菜单service')
export default class MenuService extends BaseService{

    constructor(ctx){
        super(ctx);
        this.menuEntity = new MenuEntity(ctx);
    }
    @serviceComment({
        desc: '搜索菜单, 目前支持的搜索条件为 name：菜单名，roleId：角色名称，parentMenu：父级菜单的id',
        params: {
            options: {
                desc: '搜索条件',
                type: '@SearchOptions@'
            }
        },
        returns: {
            desc: '搜索结果',
            type: 'Promise<@PageResult@>'
        }
    })
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

    @serviceComment({
        desc: '根据id获取菜单信息',
        params: {
            id: {
                desc: '菜单id',
                type: 'number'
            }
        },
        returns: {
            desc: '菜单数据',
            type: 'Promise<Object>'
        }
    })
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

    @serviceComment({
        desc: '新增或者修改菜单信息，有id则更新，无id则新增',
        params: {
            menu: {
                desc: '菜单数据',
                type: 'Object'
            }
        },
        returns: {
            desc: '更新或者修改后的菜单数据',
            type: 'Promise<Object>'
        }
    })
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

    @serviceComment({
        desc: '批量新增或者修改菜单信息，有id则更新，无id则新增',
        params: {
            menus: {
                desc: '菜单信息的数组',
                type: '[Object]'
            }
        },
        returns: {
            desc: '更新或者修改后的菜单数据',
            type: 'Promise<[Object]>'
        }
    })
    async saveOrUpdateMenus(menus){
        const promiseList = [];
        menus.forEach((menu) => {
            promiseList.push(this.saveOrUpdateMenu(menu));
        });
        return await Promise.all(promiseList);
    }
}