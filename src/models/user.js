import moment from 'moment'
import {sequelize, DataTypes} from '../db/sequelize'
import { dayFormatString, dateFormatString } from '../../configs'
import BaseEntity from './base'
import {DEFAULT_ROLD_ID} from '../utils/setting'

const User = sequelize.define('user', {
    id:{
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name:{
        type: DataTypes.STRING(100),
        allowNull: false
    },
    password:{
        type: DataTypes.STRING(200),
        allowNull: false
    },
    email:{
        type: DataTypes.STRING(1000),
        allowNull: false
    },
    phone:{
        type: DataTypes.STRING(100),
        allowNull: false
    },
    roleId:{
        type: DataTypes.INTEGER,
        defaultValue: DEFAULT_ROLD_ID,
        allowNull: false
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

export const UserModel = User;
export class UserEntity extends BaseEntity {
    constructor(ctx){
        super(UserModel, ctx)
    }
}