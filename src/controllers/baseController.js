import {ControllerContext} from '../type'

export default class BaseController{
    constructor(){
        const context: ControllerContext = undefined;
        /**
         * 当前请求的上下文，包含services, req, res
         */
        this.ctx = context;
    }
}