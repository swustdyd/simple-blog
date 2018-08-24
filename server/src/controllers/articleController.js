import { route, controller, Method} from '../utils/decorator'
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
    searchArticel(req, res, next){
        try {
            const {offset, pageSize, keyWord} = req.query;
            const options: SolrOptionsType = {
                start: offset,
                rows: pageSize,
                q: keyWord
            }
            throw new Error('搜索文章功能开发中...')
            res.send('message')
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
    async addArticel(req, res, next){
        try {
            const { article } = req.body;
            await req.services.articelService.saveOrUpdateArticle(article);
            const apiRes = new ApiResponse();
            apiRes.setMessage('保存成功')
            res.json(apiRes)            
        } catch (e) {
            next(e)
        }
    }
}