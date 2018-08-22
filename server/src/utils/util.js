import crypto from 'crypto'

/**
 * 对密码进行md5加密
 * @param {*} password 
 * @param {*} key 
 */
export function md5Password(password: string, key: string){
    const md5 = crypto.createHash('md5');
    if(key){
        password += key;
    }
    return md5.update(password).digest('hex');
}

/**
 * 比较密码
 * @param {*} password 明文密码
 * @param {*} passwordMd5 加密后的密码
 * @param {*} key 使用的加密的key
 */
export function comparePassword(password, passwordMd5, key){
    return passwordMd5 === md5Password(password, key);
}