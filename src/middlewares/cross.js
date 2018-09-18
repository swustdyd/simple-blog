import BaseConfig from '../../configs'

/**
 * 设置允许跨域的host
 */
export default (req, res, next) => {
    res.header('Access-Control-Allow-Origin', `${BaseConfig.clientHost}:${BaseConfig.clientPort}`);
    res.header('Access-Control-Allow-Headers', 'Authorization, Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Credentials', 'true');
    next();
}