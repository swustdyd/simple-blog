import { routeFurther, controller } from '../utils/decorator'
import BaseController from './baseController'
import ApiResponse from '../models/apiResponse'
import {OP} from '../db'
import {Admin} from '../utils/authority'

const {like} = OP;

@controller()
export default class TagController extends BaseController{

    @routeFurther({
        path: '/searchTags',
        name: '搜索标签',
        description: '搜索标签'
    })
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

    @routeFurther({
        path: '/saveOrUpdateTag',
        method: 'post',
        middleware: [Admin],
        name: '新增标签',
        description: '新增标签'
    })
    async addTag(req, res, next){
        try {
            const { tag } = req.body;
            const {user:{id}} = req.token;
            if(tag.id){
                tag.editer = id;
            }else{                
                tag.creater = tag.editer = id;
            }
            await req.services.tagService.saveOrUpdateTag(tag);
            const apiRes = new ApiResponse();
            apiRes.setMessage('保存成功')
            res.json(apiRes)            
        } catch (e) {
            next(e)
        }
    }


}