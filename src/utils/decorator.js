import BusinessException from '../models/businessException'
import {exceptionCode} from '../utils/exceptionHandle'
import Path from 'path'
import jwt from 'jsonwebtoken'
import { TOKEN_SECRET, SUPERADMIN_ROLE_ID, ADMIN_ROLE_ID, DEFAULT_USER_ID } from './setting';

export const log = () => {
    return (target, name, descriptor) => {
        const oldValue = descriptor.value;
        descriptor.value = function() {
            console.log('*********\n', '日志打印', target.constructor.name, name, '\n*********');
            oldValue.apply(this, arguments);
        };

        return descriptor;
    }
}

/**
 * controller方法执行之前
 * @param {*} action 执行的方法
 */
export const before = (action: (req, res) => {}) => {
    return (target, name, descriptor) => {
        const oldValue = descriptor.value;
    
        descriptor.value = function() {
            if(action){
                const [req, res] = arguments;
                action(req, res);
            }
            oldValue.apply(this, arguments);
        };
    
        return descriptor;
    }
}

/**
 * controller方法执行之后
 * @param {*} action 执行的方法
 */
export const after = (action: (req, res) => {}) => {
    return (target, name, descriptor) => {
        const oldValue = descriptor.value;
        descriptor.value = function() {
            oldValue.apply(this, arguments);
            if(action){
                const [req, res] = arguments;
                action(req, res);
            }
        };
    
        return descriptor;
    }
}

/**
 * 需要用户登录
 */
export const requestSignin = () => {
    return (target, name, descriptor) => {
        const oldValue = descriptor.value;
        descriptor.value = function() {
            const [req, res, next] = arguments;
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
                            oldValue.apply(this, arguments);
                        }
                    }
                }); 
            }
        };
    
        return descriptor;
    }
}

/**
 * 需要普通管理员权限
 */
export const requestAdmin = () => {
    return (target, name, descriptor) => {
        const oldValue = descriptor.value;
        descriptor.value = function() {
            const [req, res, next] = arguments;
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
                            oldValue.apply(this, arguments);
                        }else{
                            next(new BusinessException('需要管理员权限', exceptionCode.ADMIN));
                        }
                    }
                }); 
            }  
        };
    
        return descriptor;
    }
}

/**
 * 需要超级管理员权限
 */
export const requestSuperAdmin = () => {
    return (target, name, descriptor) => {
        const oldValue = descriptor.value;
        descriptor.value = function() {
            const [req, res, next] = arguments;
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
                            oldValue.apply(this, arguments);
                        }else{
                            next(new BusinessException('需要超级管理员权限', exceptionCode.SUPERADMIN));
                        }
                    }
                }); 
            }
        };
    
        return descriptor;
    }
}

/**
 * 访问类型
 */
export const Method = {
    GET: 'get',
    POST: 'post'
}

/**
 * 标志这是一个controller类，否则这个类不会被添加到路由中
 * @param {*} basePath 基础路径，将与route定义的path组合，实际访问路径为 basePath + path
 */
export const controller = (basePath: string) => {
    return (target) => {
        target._isController = true;
        target.prototype._basePath = basePath || '';
    }
}

/**
 * 标志为service,项目初始化时，将其实例挂载到contrller中的services变量中
 * @param name service名称，在controller通过req.services.name获取该服务实例,
 * 在service中可通过this.ctx.services.name获取该服务实例
 */
export const service = (name: string) => {
    if(!global.serviceNames){
        global.serviceNames = {};
    }
    if(global.serviceNames[name]){
        throw new Error(`service name for '${name}' was exist`);
    }
    global.serviceNames[name] = true;
    return (target) => {
        target._isService = true;
        target._name = name;
    };
}

/**
 * 标志这是一个api接口方法，否则这个方法不会被添加到路由中
 * @param {*} path 访问的路径，将与controller定义的basePath组合，实际访问路径为 basePath + path
 * @param {*} method 访问的类型，默认为Method.GET
 */
export const route = (path: string, method: string = Method.GET) => {
    return (target, name, descriptor) => {
        if(typeof target[name] !== 'function'){
            throw `${target.constructor.name}.${name} must be function`;
        }

        target._routes = target._routes || [];
        target._routes.push({
            path,
            method,
            fnName: name
        });

        return descriptor;
    }
}

/**
 * 标志这是一个api接口方法，否则这个方法不会被添加到路由中
 * @param {*} options 路由配置
 */
export const routeFurther = (options: {
  path: string,
  method?: 'get' | 'post',
  middleware?: [(res, req, next) => {}],
  name: string,
  description: string,
  params: {
      name: {
          desc: string,
          type: string,
          exp: any
      }
  }
} = {}) => {
    return (target, name, descriptor) => {
        if(typeof target[name] !== 'function'){
            throw `${target.constructor.name}.${name} must be function`;
        }
        options = {method: 'get', ...options};
        checkOptions(options);

        target._routes = target._routes || [];
        target._routes.push({
            ...options,
            functionName: name,
            controller: target.constructor.name
        });

        return descriptor;
    }
}

function checkOptions(options) {
    const {path, name, description, middleware, method} = options;
    if(method !== 'get' && method !== 'post'){
        throw new Error(`method must be get or post, you got '${method}'`);
    }
    if(!path){
        throw new Error('path can not be null');
    }
    if(!name){
        throw new Error('name can not be null');
    }
    if(!description){
        throw new Error('description can not be null');
    }
    if(middleware){
        if(!(middleware instanceof Array)){
            throw new Error('middleware must be Array');
        }
        middleware.forEach((func) => {
            if(typeof func !== 'function'){
                throw new Error('the item of middleware must be function');
            }
        })
    }
}