const path = require('path')

module.exports = {
    serverHost: 'http://localhost',
    serverPort: 3001,
    clientHost: 'http://localhost',
    clientPort: 3000,
    clientDevPort: 3000,
    root: path.resolve(__dirname, '../'),
    dbConnectString: 'mongodb://localhost:27017/blog',
    dayFormatString: 'YYYY-MM-DD',    
    dateFormatString: 'YYYY-MM-DD HH:mm:ss'
}