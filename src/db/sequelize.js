import Sequelize from 'sequelize'

const {Op} = Sequelize;

/**
 * sequelize实例
 */
export const sequelize = new Sequelize('blog', 'root', 'DD89757000', {
    host: 'localhost',
    dialect: 'mysql',
    pool: {
        max: 100,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
    timezone: '+08:00',
    logging: (sqlString) => {
        console.log(sqlString);
    },
    define: {        
        // 禁用修改表名; 默认情况下，sequelize将自动将所有传递的模型名称（define的第一个参数）转换为复数。 如果你不想这样，请设置以下内容
        freezeTableName: true,
        timestamps: false,
        // Converts camelCased model names to underscored table names if true. 
        // Will not change model name if freezeTableName is set to true
        underscoredAll: true
    },
    operatorsAliases: {
        $and: Op.and,
        $or: Op.or,
        $eq: Op.eq,
        $gt: Op.gt,
        $lt: Op.lt,
        $lte: Op.lte,
        $like: Op.like
    }
});

/**
 * sequelize数据类型: STRING,INTEGER,DATE
 */
export const {DataTypes, QueryTypes} = Sequelize;