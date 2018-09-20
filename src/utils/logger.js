import log4js from 'log4js'
import path from 'path'

log4js.configure({
    appenders: [
        {
            type: 'dateFile',
            filename: path.resolve(__dirname, '../../logs/error'),
            alwaysIncludePattern: true,
            pattern: '-yyyy-MM-dd.log',
            category: 'PRO_LOGGER'
        },
        {
            type: 'console',
            category: 'DEV_LOGGER'
        }
    ],
    levels: {
        PRO_LOGGER: log4js.levels.DEBUG,
        DEV_LOGGER: log4js.levels.ALL
    }
});

class Logger {
    constructor(env){
        env = env || 'dev';
        this._logger = env === 'dev' ? log4js.getLogger('DEV_LOGGER') : log4js.getLogger('PRO_LOGGER');
    }

    trace(...args){
        this._logger.trace(...args);
    }

    debug(...args){
        this._logger.debug(...args)
    }

    info(...args){
        this._logger.info(...args)
    }

    warn(...args){
        this._logger.warn(...args)
    }

    error(...args){
        this._logger.error(...args)
    }

    fatal(...args){
        this._logger.fatal(...args);
    }
}

export default new Logger(process.env.NODE_ENV);

