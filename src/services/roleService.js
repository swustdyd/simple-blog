import {RoleEntity} from '../models/role'
import { Role, SearchOptions } from '../type';
import {service} from '../utils/decorator'
import BusinessException from '../models/businessException'
import {PageResult} from '../type'
import BaseService from './baseService'

@service('roleService')
export default class RoleService extends BaseService{

    constructor(ctx){
        super(ctx);
        this.roleEntity = new RoleEntity(ctx);
    }

    /**
     * 搜索角色信息
     * @param {*} options 搜索条件
     * @returns 搜索的结果
     */
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

    /**
     * 根据id获取角色信息
     * @param {*} id 角色id
     * @returns 角色数据
     */
    async getRoleById(id: number): Promise<Object>{
        if(!id){
            throw new Error('角色id不能为空');
        }
        return await this.roleEntity.findOne({
            where: {
                id
            }
        });
    }

    /**
     * 保存或者修改角色信息
     * @param {*} role 角色信息，有该id则为更新，无该id则新增
     * @param {*} roleAndMenus 该角色拥有的菜单浏览权限
     * @param {*} roleAndApis 该角色拥有的后台Api访问权限
     * @returns 存储后的角色信息
     */
    async saveOrUpdateRole(role: Role, roleAndMenus?: Array<Object> = [], roleAndApis?: Array<Object> = []): Promise<Object>{
        const {transaction, services} = this.ctx;
        await transaction.startTransaction();
        try {
            //修改
            if(role.id > 0){
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
                //先删除原有的数据
                await Promise.all([
                    services.roleAndMenuService.deleteRoleAndMenusByRoleId(role.id),
                    services.roleAndApiService.deleteRoleAndApiByRoleId(role.id)
                ])
                // await services.roleAndMenuService.deleteRoleAndMenusByRoleId(role.id)
                // await services.roleAndApiService.deleteRoleAndApiByRoleId(role.id)
            }else{
                role = await this.roleEntity.create(role)
            }

            roleAndMenus = roleAndMenus.map((item) => {
                return {
                    ...item,
                    roleId: role.id,
                    creater: role.editer,
                    editer: role.editer
                };
            });
            
            roleAndApis = roleAndApis.map((item) => {
                return {
                    ...item,
                    roleId: role.id,
                    creater: role.editer,
                    editer: role.editer
                }
            });

            // 新增roleAndApis与roleAndMenus
            await Promise.all([
                services.roleAndMenuService.saveOrUpdateRoleAndMenus(roleAndMenus),
                services.roleAndApiService.saveOrUpdateRoleAndApis(roleAndApis)
            ])
            // await services.roleAndMenuService.saveOrUpdateRoleAndMenus(roleAndMenus)
            // await services.roleAndApiService.saveOrUpdateRoleAndApis(roleAndApis)
            await transaction.commit(); 
            return role;
        } catch (error) {
            await transaction.rollback();
            throw error;
        }        
    }

    /**
     * 批量保存或者修改角色信息
     * @param {*} role 角色信息，有该id则为更新，无该id则新增
     * @returns 存储后的角色信息
     */
    async saveOrUpdateRoles(roles: Array<Role>): Promise<Array<Object>>{
        const promiseList = [];
        roles.forEach((role) => {
            promiseList.push(this.saveOrUpdateRole(role));
        });
        return await Promise.all(promiseList);
    }
}