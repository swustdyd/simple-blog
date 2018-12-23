import { routeFurther, controller} from '../utils/decorator'
import BaseController from './baseController'
import {SolrOptionsType, Article} from '../type'
import ApiResponse from '../models/apiResponse'
import logger from '../utils/logger'
import {Authority} from '../middlewares/authority'

// @controller()
export default class ArticelController extends BaseController{

    @routeFurther({
        path: '/searchArticle',
        name: '文章搜索',
        description: '文章搜索'
    })
    async searchArticel(){
        const {req, res, next, services} = this.ctx;
        try {
            const {offset, pageSize, keyWord} = req.query;
            const apiRes = new ApiResponse()
            const result = await services.articleService.searchArticles({
                limit: pageSize,
                offset
            })
            apiRes.setResult(result);
            res.json(apiRes)
        } catch (error) {
            next(error);
        }
    }

    /**
     * 新增文章
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    @routeFurther({
        method: 'post',
        path: '/saveOrUpdateArticle',
        name: '新增文章',
        description: '新增一篇文章',
        middleware: [Authority]
    })
    async saveOrUpdateArticle(){
        const {req, res, next, services} = this.ctx;
        try {
            const { article } = req.body;            
            const {user:{id}} = req.token;
            if(article.id > 0){
                article.editer = id;
            }else{                
                article.creater = article.editer = id;
            }
            await services.articleService.saveOrUpdateArticle(article);
            const apiRes = new ApiResponse();
            apiRes.setMessage('保存成功')
            res.json(apiRes)            
        } catch (e) {
            next(e)
        }
    }
}