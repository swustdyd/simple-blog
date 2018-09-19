import {ServiceType} from '../type/service'

export default class BaseController{
    constructor(){

        const services: ServiceType = '';
        /**
         * 上下文
         */
        this.ctx = {
            services
        }
    }
}