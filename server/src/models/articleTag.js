import moment from 'moment'
import {sequelize, DataTypes} from '../db/sequelize'
import { dayFormatString, dateFormatString } from '../../../configs/base'
import BaseEntity from './base'

const ArticleTag = sequelize.define('articleTag', {
    id:{
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    articleId:{
        type: DataTypes.INTEGER,
        allowNull: false
    },
    tagId:{
        type: DataTypes.INTEGER,
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

export const entity = ArticleTag;
export class ArticleTagEntity extends BaseEntity {
    constructor(ctx){
        super(entity, ctx)
    }
}