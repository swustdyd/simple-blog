import moment from 'moment'
import {sequelize, DataTypes} from '../db/sequelize'
import { dayFormatString, dateFormatString } from '../../../configs/base'
import BaseEntity from './base'
import {DEFAULT_ROLD_ID} from '../utils/setting'

const Api = sequelize.define('api', {
    id:{
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    path:{
        type: DataTypes.STRING(200),
        allowNull: false
    },
    name:{
        type: DataTypes.STRING(200),
        allowNull: false
    },
    function:{
        type: DataTypes.STRING(1000),
        allowNull: false
    },
    controller:{
        type: DataTypes.STRING(100),
        allowNull: false
    },
    method:{
        type: DataTypes.STRING(100),
        allowNull: false
    },
    status: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    },
    createAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false,
        get(){
            return moment(this.getDataValue('createAt')).format(dateFormatString);
        }
    },
    updateAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false,
        get(){
            return moment(this.getDataValue('updateAt')).format(dateFormatString);
        }
    }
});

export const ApiModel = Api;
export class ApiEntity extends BaseEntity {
    constructor(ctx){
        super(ApiModel, ctx)
    }
}