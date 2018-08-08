import {db} from '../db'

export default class Transaction{
    constructor(){
        this.t = null;
    }

    async startTransaction(){
        if(!this.t){
            this.t = await db.transaction();
        }
        return this.t;
    }

    getTransaction(){
        // if(!this.t){
        //     throw new Error('transation was null, use \'startTransaction\' to init')
        // }
        return this.t;
    }

    async commit(){
        if(!this.t){
            throw new Error('transation was null, use \'startTransaction\' to init')
        }
        await this.t.commit()
    }

    async rollback(){
        if(!this.t){
            throw new Error('transation was null, use \'startTransaction\' to init')
        }
        await this.t.rollback()
    }
}