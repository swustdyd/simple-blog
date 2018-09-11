import {ApiEntity} from '../models/api'
import { SearchOptions } from '../type';
import {service} from '../utils/decorator'
import BusinessException from '../models/businessException'
import {PageResult} from '../type'

@service('apiService')
export default class RoleService {

    constructor(ctx){
        this.ctx = ctx;
        this.apiEntity = new ApiEntity(ctx);
    }

    async searchApis(options: SearchOptions): Promise<PageResult>{
        const datas = await Promise.all([
            this.apiEntity.findAll(options), 
            this.apiEntity.count(options)
        ])
        return {
            list: datas[0],
            total: datas[1]
        }
    }

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