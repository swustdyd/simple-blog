import {db} from '../db'
import { Transaction } from '../type';
import { ServiceType } from '../type/service'

export default class BaseService{
    constructor(ctx: {
        services: ServiceType,
        transaction: Transaction
    }){
        this.ctx = {
            services: ctx.services,
            req: ctx.req,
            transaction: ctx.transaction
        }
    }
}