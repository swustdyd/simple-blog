import {RoleAndApisEntity} from '../models/roleAndApis'
import {service} from '../utils/decorator'
import BusinessException from '../models/businessException'
import {QueryTypes} from '../db/sequelize';
import {db} from '../db'

@service('roleAndApiService')
export default class TagService {

    constructor(ctx){
        this.ctx = ctx;
        this.roleAndApisEntity = new RoleAndApisEntity(ctx);
    }

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

    async saveOrUpdateRoleAndApis(roleAndApis){
        const promiseList = [];
        roleAndApis.forEach((roleAndApi) => {
            promiseList.push(this.saveOrUpdateRoleAndApi(roleAndApi));
        });
        return await Promise.all(promiseList);
    }    

    async deleteRoleAndApiByRoleId(roleId){
        await db.query('delete from roleandapis where roleId = :roleId', {
            replacements: {
                roleId
            },
            transaction: this.ctx.transaction.getTransaction()
        })
    }
}