import {ArticleTagEntity} from '../models/articleTag'
import {service} from '../utils/decorator'
import { ArticleTag } from '../type';
import BusinessException from '../models/businessException'
import {db} from '../db'

@service('articleTagService')
export default class ArticelTagService {

    constructor(ctx){
        this.ctx = ctx;
        this.articleTagEntity = new ArticleTagEntity(ctx);
    }

    async getArticleTagById(id: number){
        if(!id){
            throw new Error('articleTag的id不能为空')
        }
        return await this.articleTagEntity.findOne({
            where: {
                id
            }
        })
    }

    async getArticleTagByArticleId(articleId: number){
        if(!articleId){
            throw new Error('articleTag的articleId不能为空')
        }
        return await this.articleTagEntity.findAll({
            where: {
                articleId
            }
        })
    }

    async deleteArticleTagByArticleId(articleId: number){
        if(!articleId){
            throw new Error('articleTag的id不能为空')
        }
        await db.query('delete from articletag where articleId = :articleId', {
            replacements: {
                articleId: parseInt(articleId)
            },
            transaction: this.ctx.transaction.getTransaction()
        })
        return true;
    }

    async saveOrUpdateArticleTag(articleTag: ArticleTag){
        //修改
        if(articleTag.id){
            articleTag.updateAt = Date.now();
            const originArticleTag = await this.getTagById(articleTag.id);
            if(!originArticleTag){
                throw new BusinessException(`id为'${articleTag.id}'的articleTag不存在`);
            }
            await this.articleTagEntity.update(articleTag);
            articleTag = await this.getArticleTagById(articleTag.id);
        }else{
            articleTag = await this.articleTagEntity.create(articleTag)
        }
        return articleTag;
    }

    async saveOrUpdateArticleTags(articleTags: ArticleTag[]){
        const promiseList = [];
        articleTags.forEach((articleTag) => {
            promiseList.push(this.saveOrUpdateArticleTag(articleTag));
        });
        return await Promise.all(promiseList);
    }
}