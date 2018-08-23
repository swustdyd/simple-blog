/**
 * Created by Aaron on 2018/1/5.
 */
//日志打印
import logger from './logger'
import BusinessException from '../models/businessException'

export const exceptionCode = {
    DEFAULT: 100,
    SERVER_ERROR: 500,
    NOAUTHROITY: 401,
    SIGNIN: 401.1,
    ADMIN: 401.2,
    SUPERADMIN: 401.3
}

/**
 * 统一自定义异常处理
 */
export default (err, req, res, next) => {
    let message = err.message || err.toString();
    if(err instanceof BusinessException){
        res.json({
            ok: false,
            message: message,
            errorCode: err.errorCode,
            extra: err.extra
        });
    }else{
        if(res.app.get('env') !== 'dev'){
            message =  '系统错误，请联系管理员';
        }
        /** 将错误信息存储 **/
        logger.error(err);
        // res.status(err.status || 500);
        res.json({
            ok: false, 
            message: message, 
            errorCode: err.status || exceptionCode.SERVER_ERROR
        });
    }
    res.end();
}