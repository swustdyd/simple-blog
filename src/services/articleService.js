import {ArticleEntity} from '../models/article'
import BusinessException from '../models/businessException'
import { Article, SolrOptionsType, ArticleTag, Transaction } from '../type';
import { service } from '../utils/decorator'
import BaseService from './BaseService'
import {db} from '../db'
import logger from '../utils/logger'

// @service('articleService')
export default class ArticleService{
    
    constructor(ctx){
        this.ctx = ctx;
        this.articleEntity = new ArticleEntity(ctx);

    }

    async searchArticles(options: SearchOptions){
        const datas = await Promise.all([
            this.articleEntity.findAll(options), 
            this.articleEntity.count(options)
        ])
        return {
            list: datas[0],
            total: datas[1]
        }
    }

    async getArticleById(id: number){
        if(!id){
            throw new Error('文章的id不能为空');
        }
        return await this.articleEntity.findOne({
            where: {
                id
            }
        });
    }

    async saveOrUpdateArticle(article: Article){
        if(!article.tags && article.tags.length < 1){
            throw new BusinessException('文章的所属标签不能为空')
        }
        let newArticle = null;
        const {transaction, services} = this.ctx;
        await transaction.startTransaction();
        try {
            // 修改
            if(article.id){
                article.updateAt = Date.now();
                await this.articleEntity.update(article, {
                    where: {
                        id: article.id
                    }
                });
                // update操作只返回影响的行数，所以需要再次查询
                newArticle = await this.getArticleById(article.id)
                //先删除，再插入articleTag
                await services.articleTagService.deleteArticleTagByArticleId(newArticle.id);
            }else{
                // 新增
                newArticle = await this.articleEntity.create(article);
            }
            //throw 'abort transaction'
            // 新增articleTag
            const articleTags = [];
            article.tags.forEach((tagId) => {
                const articleTag: ArticleTag = {
                    articleId: newArticle.id,
                    tagId: tagId,
                    creater: newArticle.creater,
                    editer: newArticle.creater
                };
                articleTags.push(articleTag);
            });
            await services.articleTagService.saveOrUpdateArticleTags(articleTags);
            await transaction.commit();
            return newArticle;
        } catch (e) {
            await transaction.rollback();
            throw e;
        }               
    }

    async deleteArticleById(id: number, t: Transaction){
        if(!id){
            throw new BusinessException('文章的id不能为空');
        }
        const result = await db.transaction().then(async (t) => {
            try {                
                await db.query('delete from article where id = :id', {
                    replacements: {
                        id: parseInt(id)
                    },
                    transaction: t
                })

                await this.services.articleTagService.deleteArticleTagByArticleId(id, t);
                t.commit();
                return true;
            } catch (e) {
                t.rollback();
                logger.error('删除文章失败', e);
                return false;
            }
        })
        return result;
    }

}