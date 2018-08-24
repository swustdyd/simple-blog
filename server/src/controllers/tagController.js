import { route, controller, Method, requestAdmin} from '../utils/decorator'
import BaseController from './baseController'
import ApiResponse from '../models/apiResponse'
import {OP} from '../db'

const {like} = OP;

@controller()
export default class TagController extends BaseController{

    /**
     * 搜索标签
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    @route('/searchTags')
    async searchTags(req, res, next){
        try {
            const {offset, pageSize, name} = req.query;
            const where = {};
            if(name){
                where.name = {
                    [like]: `%${name}%`
                }
            }
            const result = await req.services.tagService.searchTags({
                where,
                limit: pageSize,
                offset
            });
            const apiRes = new ApiResponse();
            apiRes.setResult(result);
            res.json(apiRes)
        } catch (error) {
            next(error);
        }
    }

    /**
     * 新增标签
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    @route('/saveOrUpdateTag', Method.POST)
    @requestAdmin()
    async addTag(req, res, next){
        try {
            const { tag } = req.body;
            await req.services.tagService.saveOrUpdateTag(tag);
            const apiRes = new ApiResponse();
            apiRes.setMessage('保存成功')
            res.json(apiRes)            
        } catch (e) {
            next(e)
        }
    }


}