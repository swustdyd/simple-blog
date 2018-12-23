import {RoleAndApisEntity} from '../models/roleAndApis'
import {service} from '../utils/decorator'
import BusinessException from '../models/businessException'
import BaseService from './baseService'

@service('roleAndApiService')
export default class RoleAndApiService extends BaseService{

    constructor(ctx){
        super(ctx);
        this.roleAndApisEntity = new RoleAndApisEntity(ctx);
    }

    /**
     * 根据id获取RoleAndApi
     * @param {*} id RoleAndApi的id
     * @returns RoleAndApi数据
     */
    async getRoleAndApiById(id: number): Promise<Object>{
        if(!id){
            throw new Error('roleAndApi的id不能为空');
        }
        return await this.roleAndApisEntity.findOne({
            where: {
                id
            }
        });
    }

    /**
     * 保存或者修改RoleAndApi，有id则更新，无id则新增
     * @param {*} roleAndApi RoleAndApi的数据
     * @returns 保存后的RoleAndApi数据
     */
    async saveOrUpdateRoleAndApi(roleAndApi: Object): Promise<Object>{
        //修改
        if(roleAndApi.id > 0){
            roleAndApi.updateAt = Date.now();
            const origin = await this.getTagById(roleAndApi.id);
            if(!origin){
                throw new BusinessException(`id为'${roleAndApi.id}'的roleAndApis不存在`);
            }
            await this.roleAndApisEntity.update(roleAndApi, {
                where: {
                    id: roleAndApi.id
                }
            });
            // update操作只返回影响的行数，所以需要再次查询
            roleAndApi = await this.getRoleAndApiById(roleAndApi.id)
        }else{
            roleAndApi = await this.roleAndApisEntity.create(roleAndApi)
        }
        return roleAndApi;
    }

    /**
     * 批量保存或者修改RoleAndApi，有id则更新，无id则新增
     * @param {*} roleAndApis RoleAndApi的数据
     * @returns 保存后的RoleAndApi数据
     */
    async saveOrUpdateRoleAndApis(roleAndApis: Array<Object>): Promise<Array<Object>>{
        const promiseList = [];
        roleAndApis.forEach((roleAndApi) => {
            promiseList.push(this.saveOrUpdateRoleAndApi(roleAndApi));
        });
        return await Promise.all(promiseList);
    }    

    /**
     * 根据角色id删除RoleAndApi
     * @param {*} roleId 角色id
     */
    async deleteRoleAndApiByRoleId(roleId: number): Promise<void>{
        await this.roleAndApisEntity.query('delete from roleAndApis where roleId = :roleId', {
            replacements: {
                roleId
            }
        })
    }
}