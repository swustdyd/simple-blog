const path = require('path')
const baseConfig = require('../../config');
const { serverHost, serverPort, clientHost, clientPort, socketPort } = baseConfig;

module.exports = {
    serverHost,
    serverPort,
    clientHost,
    clientPort,
    clientDevPort: clientPort,
    socketPort,
    root: path.resolve(__dirname, '../'),
    dbConnectString: 'mongodb://localhost:27017/blog',
    dayFormatString: 'YYYY-MM-DD',    
    dateFormatString: 'YYYY-MM-DD HH:mm:ss',
    dsadsa: 'dsadsa',
    dj: 'dsds',
    ddddd: 'dadsadsadadsaddddddsdsdsdsdsddsadasdsadsa'
}