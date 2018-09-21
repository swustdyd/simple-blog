import {DEFAULT_PAGESIZE}  from '../utils/setting'
import {db} from '../db'
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
        this.db = db;
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

    /**
     * Execute a query on the DB, with the posibility to bypass all the sequelize goodness.
     *
     * By default, the function will return two arguments: an array of results, and a metadata object,
     * containing number of affected rows etc. Use `.spread` to access the results.
     *
     * If you are running a type of query where you don't need the metadata, for example a `SELECT` query, you
     * can pass in a query type to make sequelize format the results:
     *
     * @param sql
     * @param options Query options
     * ```js
     * sequelize.query('SELECT...').spread(function (results, metadata) {
     *   // Raw query - use spread
     * });
     *
     * sequelize.query('SELECT...', { type: sequelize.QueryTypes.SELECT }).then(function (results) {
     *   // SELECT query - use then
     * })
     * ```
     */
    async query(sql: string, options?: {}){
        this._checkOptions(options);
        return await db.query(sql, options);
    }
}