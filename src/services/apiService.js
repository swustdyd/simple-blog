import {ApiEntity} from '../models/api'
import { SearchOptions } from '../type';
import {service, serviceComment} from '../utils/decorator'
import BusinessException from '../models/businessException'
import {PageResult} from '../type'
import {db} from '../db'
import {QueryTypes} from '../db/sequelize'

@service('apiService', '后台Api服务')
export default class ApiService {

    constructor(ctx){
        this.ctx = ctx;
        this.apiEntity = new ApiEntity(ctx);
    }

    @serviceComment({
        desc: '搜索后台Api',
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
    async searchApis(options: SearchOptions): Promise<PageResult>{
        const {where = {}, offset, limit} = options;
        const {name, path, roleId} = where;
        const replacements = {offset, limit, name, path, roleId};
        const selectSql = 'select a.* from api a';
        const pageSql = 'limit :offset, :limit';
        let joinSql = [];
        let whereSql = [];
        if(name){
            whereSql.push('name like \'%:name%\'')
        }
        if(path){
            whereSql.push('path like \'%:path%\'')
        }
        if(roleId){
            whereSql.push('rar.roleId = :roleId')
            joinSql.push('inner join roleandapis rar on a.id = rar.apiId')
        }

        joinSql = joinSql.join(' ');
        whereSql = `where 1=1 ${whereSql.length > 0 ? `and ${whereSql.join(' and ')}` : ''}`
        const datas = await Promise.all([
            db.query(`${selectSql} ${joinSql} ${whereSql} ${pageSql}`, {
                type: QueryTypes.SELECT,
                replacements,
                transaction: this.ctx.transaction.getTransaction()
            }),
            db.query(`select count(*) as total from api a ${joinSql} ${whereSql}`, {
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
        desc: '根据api的id获取api信息',
        params: {
            id: {
                desc: 'api的id',
                type: 'number'
            }
        },
        return: {
            type: 'Promise<ApiEntity>'
        }
    })
    async getApiById(id: number){
        if(!id){
            throw new Error('菜单id不能为空');
        }
        return await this.apiEntity.findOne({
            where: {
                id
            }
        });
    }

    async saveOrUpdateApi(api){
        //修改
        if(api.id){
            api.updateAt = Date.now();
            const originApi = await this.getApiById(api.id);
            if(!originApi){
                throw new BusinessException(`id为'${api.id}'的API不存在`);
            }
            await this.apiEntity.update(api, {
                where: {
                    id: api.id
                }
            });
            // update操作只返回影响的行数，所以需要再次查询
            api = await this.getApiById(api.id)
        }else{
            api = await this.apiEntity.create(api)
        }
        return api;
    }

    async saveOrUpdateApis(apis){
        const promiseList = [];
        apis.forEach((api) => {
            promiseList.push(this.saveOrUpdateApi(api));
        });
        return await Promise.all(promiseList);
    }
}