import Sequelize from 'sequelize'
import {sequelize} from './sequelize'


export const db = sequelize;
db.Sequelize = Sequelize;