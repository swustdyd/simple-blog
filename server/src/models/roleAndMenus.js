import moment from 'moment'
import {sequelize, DataTypes} from '../db/sequelize'
import { dayFormatString, dateFormatString } from '../../../configs/base'
import BaseEntity from './base'
import {DEFAULT_ROLD_ID} from '../utils/setting'

const RoleAndMenus = sequelize.define('roleAndMenus', {
    id:{
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    roleId:{
        type: DataTypes.INTEGER,
        allowNull: false
    },
    menuId:{
        type: DataTypes.INTEGER,
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

export const entity = RoleAndMenus;
export class RoleAndMenusEntity extends BaseEntity {
    constructor(ctx){
        super(entity, ctx)
    }
}