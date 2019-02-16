const path = require('path')
const baseConfig = require('../../config');
const { serverHost, serverPort, clientHost, clientPort, socketPort, dbhost, dbport } = baseConfig;

module.exports = {
    serverHost,
    serverPort,
    clientHost,
    clientPort,
    clientDevPort: clientPort,
    socketPort,
    root: path.resolve(__dirname, '../'),
    dayFormatString: 'YYYY-MM-DD',    
    dateFormatString: 'YYYY-MM-DD HH:mm:ss',
    dbhost,
    dbport
}