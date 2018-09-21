import {RoleAndApisEntity} from '../models/roleAndApis'
import {service, serviceComment} from '../utils/decorator'
import BusinessException from '../models/businessException'
import {QueryTypes} from '../db/sequelize';
import {db} from '../db'
import BaseService from './baseService'

@service('roleAndApiService')
export default class RoleAndApiService extends BaseService{

    constructor(ctx){
        super(ctx);
        this.roleAndApisEntity = new RoleAndApisEntity(ctx);
    }

    @serviceComment({
        desc: '根据id获取RoleAndApi',
        params: {
            id: {
                desc: 'RoleAndApi的id',
                type: 'number'
            }
        },
        returns: {
            desc: 'RoleAndApi数据',
            type: 'Promise<Object>'
        }
    })
    async getRoleAndApiById(id: number){
        if(!id){
            throw new Error('roleAndApi的id不能为空');
        }
        return await this.roleAndApisEntity.findOne({
            where: {
                id
            }
        });
    }

    @serviceComment({
        desc: '保存或者修改RoleAndApi，有id则更新，无id则新增',
        params: {
            roleAndApi: {
                desc: 'RoleAndApi的数据',
                type: 'Object'
            }
        },
        returns: {
            desc: '保存后的RoleAndApi数据',
            type: 'Promise<Object>'
        }
    })
    async saveOrUpdateRoleAndApi(roleAndApi){
        //修改
        if(roleAndApi.id){
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

    @serviceComment({
        desc: '批量保存或者修改RoleAndApi，有id则更新，无id则新增',
        params: {
            roleAndApis: {
                desc: 'RoleAndApi的数据',
                type: '[Object]'
            }
        },
        returns: {
            desc: '保存后的RoleAndApi数据',
            type: 'Promise<Object>'
        }
    })
    async saveOrUpdateRoleAndApis(roleAndApis){
        const promiseList = [];
        roleAndApis.forEach((roleAndApi) => {
            promiseList.push(this.saveOrUpdateRoleAndApi(roleAndApi));
        });
        return await Promise.all(promiseList);
    }    

    @serviceComment({
        desc: '根据角色id删除RoleAndApi',
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
    async deleteRoleAndApiByRoleId(roleId){
        await this.roleAndApisEntity.query('delete from roleandapis where roleId = :roleId', {
            replacements: {
                roleId
            }
        })
    }
}