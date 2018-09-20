import {ControllerContext} from '../type'

export default class BaseController{
    constructor(){
        const context: ControllerContext = undefined;
        /**
         * 上下文
         */
        this.ctx = context;
    }
}