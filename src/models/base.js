import {DEFAULT_PAGESIZE}  from '../utils/setting'
export default class BaseModel{
    constructor(model, ctx){
        if(!model){
            throw new Error('model can not be null');
        }
        if(!ctx){
            throw new Error('ctx can not be null');
        }
        this.model = model;
        this.transaction = ctx.transaction;
    }

    _checkOptions(options){
        if(!options.transaction && this.transaction.getTransaction()){
            options.transaction = this.transaction.getTransaction();
        }
        if(!options.offset){
            options.offset = 0;
        }
        if(!options.limit){
            options.limit = DEFAULT_PAGESIZE;
        }
    }

    
    async create(values: Object, options: Object = {}){
        this._checkOptions(options);
        return await this.model.create(values, options);
    }

    async count(options: Object = {}){
        this._checkOptions(options);
        return await this.model.count(options);
    }

    async findOne(options: Object = {}){
        this._checkOptions(options);
        return await this.model.findOne(options);
    }

    async findAll(options: Object = {}){
        this._checkOptions(options);
        return await this.model.findAll(options);
    }

    async update(values: Object, options: Object = {}){
        this._checkOptions(options);
        return await this.model.update(values, options);
    }
}