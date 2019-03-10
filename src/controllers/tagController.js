import { routeFurther, controller } from '../utils/decorator'
import BaseController from './baseController'
import ApiResponse from '../models/apiResponse'
import {OP} from '../db'
import {Authority} from '../middlewares/authority'

const {like} = OP;

 @controller()
export default class TagController extends BaseController{

    @routeFurther({
        path: '/searchTags',
        name: '搜索标签',
        description: '搜索标签',
        middleware: [Authority]
    })
     async searchTags(){
         const {req, res, next, services} = this.ctx;
         try {
             const {offset, pageSize, name} = req.query;
             const where = {};
             if(name){
                 where.name = {
                     [like]: `%${name}%`
                 }
             }
             const result = await services.tagService.searchTags({
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
        middleware: [Authority],
        name: '新增标签',
        description: '新增标签'
    })
    async addTag(){
        const {req, res, next, services} = this.ctx;
        try {
            const { tag } = req.body;
            const {user:{id}} = req.token;
            if(tag.id){
                tag.editer = id;
            }else{                
                tag.creater = tag.editer = id;
            }
            await services.tagService.saveOrUpdateTag(tag);
            const apiRes = new ApiResponse();
            apiRes.setMessage('保存成功')
            res.json(apiRes)            
        } catch (e) {
            next(e)
        }
    }


 }