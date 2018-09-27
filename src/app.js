import morgan from 'morgan'
import express from 'express'
import rfs from 'rotating-file-stream';
import path from 'path'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import fs from 'fs'
import moment from 'moment'
import compression from 'compression'
import projectInit from './projectInit'
import BaseConfig from '../configs'
import exceptionHandle from './utils/exceptionHandle'
import {db} from './db'
import logger from './utils/logger'
import initSocket from './socket'

logger.info('Project begin to start, please waite...');

db.authenticate()
    .catch((err) => {
        logger.error('数据库初始化错误', err);
    });

const isDev = process.env.NODE_ENV !== 'production';
const app = express();

let serverPort = process.env.PORT || BaseConfig.serverPort;
serverPort = parseInt(serverPort, 10);

app.use(bodyParser());
app.use(cookieParser());

if(isDev){
    app.use(morgan('dev'));
}else{
    morgan.token('localDate', () => {
        return moment(new Date()).format('YYYY-MM-DD HH:mm:ss.SSS');
    })
    app.use(morgan(':localDate :method :url :status from :remote-addr ":referrer" ":user-agent', {
        stream: rfs((time, index) => {
            if(!time){
                return 'access.log';
            }else{
                return `access-${moment(time).format('YYYY-MM-DD')}-${index}.log`
            }            
        }, {
            interval: '1d', // rotate daily
            path: path.join(BaseConfig.root, './logs')
        })
    }));
}

app.use(express.static(path.resolve(BaseConfig.root, './public')));

app.use(compression());

// 读取middlewares文件夹下的文件
const dirPath = path.resolve(__dirname, './middlewares');

fs.readdirSync(dirPath).forEach((fileName) => {
    const middleware = require(path.join(dirPath, fileName)).default;
    if(middleware && fileName !== 'authority.js'){      
        app.use(middleware);
    }
})

projectInit(app)

app.use(exceptionHandle);

initSocket(app);

app.listen(serverPort, function () {
    logger.info(`Project(${process.env.NODE_ENV}) is running on port ${serverPort}`);
});

process.on('uncaughtException', (err) => {
    logger.error(err);
})

