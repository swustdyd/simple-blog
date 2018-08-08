import { DEFAULT_PAGESIZE } from '../utils/setting'

/**
 * 设置分页
 * @param req
 * @param res
 * @param next
 */
export default (req, res, next) => {
    //初始化url中的分页信息
    if (req.query.pageIndex) {
        req.query.pageIndex = /^[0-9]+$/.test(req.query.pageIndex) ? parseInt(req.query.pageIndex) : 0;
    }else{
        req.query.pageIndex = 0;
    }
    if (req.query.pageSize) {
        req.query.pageSize = /^[1-9][0-9]*$/.test(req.query.pageSize)
            ? Math.min(parseInt(req.query.pageSize), DEFAULT_PAGESIZE) : DEFAULT_PAGESIZE;
    }else{
        req.query.pageSize = DEFAULT_PAGESIZE;
    }
    req.query.offset =  req.query.pageIndex * req.query.pageSize;
    //初始化post请求中的分页信息
    if (req.body.pageIndex) {
        req.body.pageIndex = /^[0-9]+$/.test(req.body.pageIndex) ? parseInt(req.body.pageIndex) : 0;
    }else{
        req.body.pageIndex = 0;
    }
    if (req.body.pageSize) {
        req.body.pageSize = /^[1-9][0-9]*$/.test(req.body.pageSize)
            ? Math.min(parseInt(req.body.pageSize), DEFAULT_PAGESIZE) : DEFAULT_PAGESIZE;
    }else{
        req.body.pageSize = DEFAULT_PAGESIZE;
    }
    req.body.offset =  req.body.pageIndex * req.body.pageSize
    next();
}