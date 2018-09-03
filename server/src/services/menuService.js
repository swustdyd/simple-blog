import {MenuEntity} from '../models/menu'
import { SearchOptions } from '../type';
import {service} from '../utils/decorator'
import BusinessException from '../models/businessException'
import {PageResult} from '../type'

@service('menuService')
export default class RoleService {

    constructor(ctx){
        this.ctx = ctx;
        this.menuEntity = new MenuEntity(ctx);
    }

    async searchMenus(options: SearchOptions): Promise<PageResult>{
        const datas = await Promise.all([
            this.menuEntity.findAll(options), 
            this.menuEntity.count(options)
        ])
        return {
            list: datas[0],
            total: datas[1]
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
            const originRole = await this.getMenuById(menu.id);
            if(!originRole){
                throw new BusinessException(`id为'${menu.id}'的菜单不存在`);
            }
            menu = await this.menuEntity.update(menu, {
                where: {
                    id: menu.id
                }
            });
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