import {exceptionCode} from '../utils/exceptionHandle'
import jwt from 'jsonwebtoken'
import { TOKEN_SECRET, SUPERADMIN_ROLE_ID, ADMIN_ROLE_ID, DEFAULT_USER_ID } from './setting';
import BusinessException from '../models/businessException';

/**
 * 需要用户登录
 */
export const Signin = (req, res, next) => {
    const token = req.get('Authorization');
    if(!token){
        next(new BusinessException('无权访问', exceptionCode.NOAUTHROITY));
    }else{
        jwt.verify(token, TOKEN_SECRET, (err, decoded) => {
            if(err){
                next(new BusinessException(err.message, exceptionCode.SIGNIN));
            }else{
                const {user} = decoded.data;   
                if(!user){
                    next(new BusinessException('请登录', exceptionCode.SIGNIN));
                }else{
                    req.token = {user};                   
                    next();
                }
            }
        }); 
    }
}

/**
 * 需要普通管理员权限
 */
export const Admin = (req, res, next) => {
    const token = req.get('Authorization');
    if(!token){
        next(new BusinessException('无权访问', exceptionCode.NOAUTHROITY));
    }else{
        jwt.verify(token, TOKEN_SECRET, (err, decoded) => {
            if(err){
                next(new BusinessException(err.message, exceptionCode.ADMIN));
            }else{
                const {user} = decoded.data;   
                if(user && (user.id === DEFAULT_USER_ID || user.roleId >= ADMIN_ROLE_ID)){
                    req.token = {user};                   
                    next();
                }else{
                    next(new BusinessException('需要管理员权限', exceptionCode.ADMIN));
                }
            }
        }); 
    }
}

/**
 * 需要超级管理员权限
 */
export const SuperAdmin = (req, res, next) => {
    const token = req.get('Authorization');
    if(!token){
        next(new BusinessException('无权访问', exceptionCode.NOAUTHROITY));
    }else{
        jwt.verify(token, TOKEN_SECRET, (err, decoded) => {
            if(err){
                next(new BusinessException(err.message, exceptionCode.SUPERADMIN));
            }else{
                const {user} = decoded.data;   
                if(user && (user.id === DEFAULT_USER_ID || user.roleId >= SUPERADMIN_ROLE_ID)){
                    req.token = {user};                   
                    next();
                }else{
                    next(new BusinessException('需要超级管理员权限', exceptionCode.SUPERADMIN));
                }
            }
        }); 
    }
}