export default class ApiResponse{
    /**
     * 
     * @param {*} ok 该次请求的返回结果, true: 成功，false: 失败
     * @param {*} message 返回给前端的message
     */
    constructor(ok?: boolean = true, message: string){
        if((typeof ok) === 'string'){
            message = ok;
            ok = true;
        }
        /**
         * 返回的操作结果，默认为true: 成功
         */
        this.ok = ok;
        /**
         * 对结果的描述补充
         */
        this.message = message;
        /**
         * 返回的有效数据
         */
        this.result;
        /**
         * 额外的对数据的补充
         */
        this.extra;
    }

    setOk(ok){
        this.ok = ok;
    }
    
    setMessage(message){
        this.message = message;
    }

    setResult(result){
        this.result = result;
    }

    setExtra(extra){
        this.extra = extra;
    }
}