import {db} from '../db'
import { Transaction } from '../type';
import { ServiceType } from '../type/service'

export default class BaseService{
    constructor(ctx){
        const services: ServiceType = '';
        const transaction: Transaction = '';
        this.ctx = {
            services,
            req: '',
            transaction
        }
    }
}