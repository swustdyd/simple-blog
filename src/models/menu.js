import moment from 'moment'
import {sequelize, DataTypes} from '../db/sequelize'
import { dayFormatString, dateFormatString } from '../../../configs/base'
import BaseEntity from './base'
import {DEFAULT_ROLD_ID} from '../utils/setting'

const Menu = sequelize.define('menu', {
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
    icon:{
        type: DataTypes.STRING(100)
    },
    parentMenu:{
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    hideInMenu: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    orderNo:{
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    creater: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    editer: {
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

export const MenuModel = Menu;
export class MenuEntity extends BaseEntity {
    constructor(ctx){
        super(MenuModel, ctx)
    }
}