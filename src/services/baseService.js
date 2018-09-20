import {db} from '../db'
import { ServiceContext } from '../type';

export default class BaseService{
    constructor(ctx: ServiceContext){
        this.ctx = ctx;
    }
}