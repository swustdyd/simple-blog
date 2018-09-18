import moment from 'moment'
import {sequelize, DataTypes} from '../db/sequelize'
import { dayFormatString, dateFormatString } from '../../configs'
import BaseEntity from './base'

const Article = sequelize.define('article', {
    id:{
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    title:{
        type: DataTypes.STRING(300),
        allowNull: false
    },
    views: DataTypes.INTEGER,    
    creater:{
        type: DataTypes.INTEGER,
        allowNull: false
    },
    editer:{
        type: DataTypes.INTEGER,
        allowNull: false
    },
    content: {
        type: DataTypes.TEXT,
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

export const ArticleModel = Article;
export class ArticleEntity extends BaseEntity {
    constructor(ctx){
        super(ArticleModel, ctx)
    }
}