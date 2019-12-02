const path = require('path')
const nconf = require('nconf');
const env = process.env.DYD_RUNTIME_ENV || 'local';
const dydConfigPath = process.env.DYD_CONFIG_PATH;
nconf.file('cwd-config-env', { file: `${dydConfigPath}/config/index-${env}.json` });
nconf.file('cwd-config-default', { file: `${dydConfigPath}/config/index.json` });
const baseConfig = nconf.get();
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