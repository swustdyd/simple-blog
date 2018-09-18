export default class ApiResponse{
    constructor(ok: boolean = true, message){
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