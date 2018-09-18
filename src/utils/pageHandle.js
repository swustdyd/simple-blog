import { DEFAULT_PAGESIZE } from '../utils/setting'

/**
 * 设置分页
 * @param req
 * @param res
 * @param next
 */
export default (req, res, next) => {
    //初始化get请求中的分页信息
    const {offset, pageSize} = req.query;
    if (offset) {
        req.query.offset = /^[0-9]+$/.test(req.query.offset) ? parseInt(req.query.offset) : 0;
    }else{
        req.query.offset = 0;
    }
    if (pageSize) {
        req.query.pageSize = /^[1-9][0-9]*$/.test(req.query.pageSize)
            ? Math.min(parseInt(req.query.pageSize), DEFAULT_PAGESIZE) : DEFAULT_PAGESIZE;
    }else{
        req.query.pageSize = DEFAULT_PAGESIZE;
    }
    req.query.offset =  req.query.offset * req.query.pageSize;
    // //初始化post请求中的分页信息
    // if (req.body.pageIndex) {
    //     req.body.pageIndex = /^[0-9]+$/.test(req.body.pageIndex) ? parseInt(req.body.pageIndex) : 0;
    // }else{
    //     req.body.pageIndex = 0;
    // }
    // if (req.body.pageSize) {
    //     req.body.pageSize = /^[1-9][0-9]*$/.test(req.body.pageSize)
    //         ? Math.min(parseInt(req.body.pageSize), DEFAULT_PAGESIZE) : DEFAULT_PAGESIZE;
    // }else{
    //     req.body.pageSize = DEFAULT_PAGESIZE;
    // }
    // req.body.offset =  req.body.pageIndex * req.body.pageSize
    next();
}