import moment from 'moment'
import {sequelize, DataTypes} from '../db/sequelize'
import { dayFormatString, dateFormatString } from '../../../configs/base'
import BaseEntity from './base'

const Tag = sequelize.define('tag', {
    id:{
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name:{
        type: DataTypes.STRING(100),
        allowNull: false
    },
    color:{
        type: DataTypes.STRING(100),
        defaultValue: '#dddddd',
        allowNull: false
    },
    description:{
        type: DataTypes.STRING(1000),
        allowNull: false
    },
    creater:{
        type: DataTypes.INTEGER,
        allowNull: false
    },
    editer:{
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

export const entity = Tag;
export class TagEntity extends BaseEntity {
    constructor(ctx){
        super(entity, ctx)
    }
}