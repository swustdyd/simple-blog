import { route, controller, Method, requestSignin} from '../utils/decorator'
import BaseController from './baseController'
import {SolrOptionsType, Article} from '../type'
import ApiResponse from '../models/apiResponse'
import logger from '../utils/logger'

@controller()
export default class ArticelController extends BaseController{

    /**
     * 搜索文章
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    @route('/searchArticle')
    async searchArticel(req, res, next){
        try {
            const {offset, pageSize, keyWord} = req.query;
            const apiRes = new ApiResponse()
            const result = await req.services.articleService.searchArticles({
                limit: pageSize,
                offset,
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
    @route('/saveOrUpdateArticle', Method.POST)
    @requestSignin()
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