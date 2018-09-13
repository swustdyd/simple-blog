import { routeFurther, controller} from '../utils/decorator'
import BaseController from './baseController'
import {SolrOptionsType, Article} from '../type'
import ApiResponse from '../models/apiResponse'
import logger from '../utils/logger'
import {Signin} from '../utils/authority'

// @controller()
export default class ArticelController extends BaseController{

    @routeFurther({
        path: '/searchArticle',
        name: '文章搜索',
        description: '文章搜索'
    })
    async searchArticel(req, res, next){
        try {
            const {offset, pageSize, keyWord} = req.query;
            const apiRes = new ApiResponse()
            const result = await req.services.articleService.searchArticles({
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
        middleware: [Signin]
    })
    async saveOrUpdateArticle(req, res, next){
        try {
            const { article } = req.body;            
            const {user:{id}} = req.token;
            if(article.id){
                article.editer = id;
            }else{                
                article.creater = article.editer = id;
            }
            await req.services.articleService.saveOrUpdateArticle(article);
            const apiRes = new ApiResponse();
            apiRes.setMessage('保存成功')
            res.json(apiRes)            
        } catch (e) {
            next(e)
        }
    }
}