import {TagEntity} from '../models/tag'
import { Tag } from '../type';
import {service} from '../utils/decorator'
import BusinessException from '../models/businessException'

@service('tagService')
export default class TagService {

    constructor(ctx){
        this.ctx = ctx;
        this.tagEntity = new TagEntity(ctx);
    }

    async getTagById(id: number){
        if(!id){
            throw new Error('标签id不能为空');
        }
        return await this.tagEntity.findOne({
            where: {
                id
            }
        });
    }

    async saveOrUpdateTag(tag: Tag){
        //修改
        if(tag.id){
            tag.updateAt = Date.now();
            const originTag = await this.getTagById(tag.id);
            if(!originTag){
                throw new BusinessException(`id为'${tag.id}'的标签不存在`);
            }
            tag = await this.tagEntity.update(tag);
        }else{
            tag = await this.tagEntity.create(tag)
        }
        return tag;
    }

    async saveOrUpdateTags(tags: Tag[]){
        const promiseList = [];
        tags.forEach((tag) => {
            promiseList.push(this.saveOrUpdateTag(tag));
        });
        return await Promise.all(promiseList);
    }
}