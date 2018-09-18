import {exceptionCode} from '../middlewares/exceptionHandle'

export default class BusinessException{
    constructor(message: string, errorCode: number = exceptionCode.DEFAULT, extra){
        this.message = message;
        this.errorCode = errorCode;
        this.extra = extra;
    }
}