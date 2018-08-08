import router from './route'
import service from './service'

export default (app) => {
    app.use(service);
    app.use(router);
}