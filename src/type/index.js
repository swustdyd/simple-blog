import { ServiceType } from './service';
import {ExpressResponse} from './expressReponse'
import {ExpressRequest} from './expressRequest'

/**
 * 文章的数据格式
 */
export type Article = {
    /**
     * 文章id
     */
    id: number,
    /**
     * 标题
     */
    title: string,
    /**
     * 文章阅读次数
     */
    views: number,
    /**
     * 文章创建者
     */
    creater: number,
    editer: number,
    /**
     * 文章内容
     */
    content: string,
    /**
     * 所属标签，number数组
     */
    tags: number[]
}

/**
 * 标签的数据格式
 */
export type Tag = {
    /**
     * 标签id
     */
    id: number,
    /**
     * 标签名称
     */
    name: string,
    /**
     * 对标签的描述
     */
    describtion: string,    
    creater: number,
    editer: number
}

/**
 * 文章与标签的对应关系
 */
export type ArticleTag = {
    /**
     * 唯一id
     */
    id: number,
    /**
     * 文章的id
     */
    articleId: number,
    /**
     * 标签的id
     */
    tagId: number,
    creater: number,
    editer: number
}

/**
 * 用户数据格式
 */
export type User = {
    /**
     * 唯一id
     */
    id: number,
    /**
     * 用户名
     */
    name: string,
    /**
     * 密码
     */
    password: string,
    /**
     * 邮箱
     */
    email: string,
    /**
    * 手机
    */
    phone: string,
    /**
     * 角色id
     */
    roleId: number
}

/**
 * 角色数据格式
 */
export type Role = {
    /**
     * 唯一id
     */
    id: number,
    /**
     * 角色名称
     */
    name: string,
    /**
     * 类型名称
     */
    typeName: string,
    /**
    * 权限菜单
    */
    menus: string,
    creater: number,
    editer: number
}

/**
 * 接口返回的数据格式
 */
export type ApiResponse = {
    /**
     * 返回的操作结果，true: 成功
     */
    ok: boolean,
    /**
     * 对结果的描述补充
     */
    message: string,
    /**
     * 返回的有效数据
     */
    result: any,
    /**
     * 额外的对数据的补充
     */
    extra: any
}

/**
 * 分页的数据格式
 */
export type PageResult = {
    /**
     * 结果总数
     */
    total: number,
    /**
     * 结果
     */
    list: any
}

/**
 * solr搜索options的数据格式
 */
export type SolrOptionsType ={
    /**
     * 起始位置，0为起始下标
     */
    start: number,
    /**
     * 一次查询返回的数目
     */
    rows: number,
    /**
     * 查询的关键字，此参数最为重要，例如，q=id:1，默认为q=*:*
     */
    q: string,
    /**
     * 指定返回哪些字段，用逗号或空格分隔，注意：字段区分大小写，例如，fl= id,title,sort
     */
    fl: string,
    /**
     * (writer type)指定输出格式，有 xml, json
     */
    wt: 'json' | 'xml',
    /**
     * 过虑查询，提供一个可选的筛选器查询。返回在q查询符合结果中同时符合的fq条件的查询结果，例如：q=id:1&fq=sort:[1 TO 5]，找关键字id为1 的，并且sort是1到5之间的
     */
    fq: string,
    /**
     * Facet条件进行分组统计，参数字段必须被索引
     */
    facet: boolean,
    /**
     * 分组的字段
     */
    'facet.field': string
}

export type SearchOptions = {
    /**
     * 搜索条件
     * @see http://docs.sequelizejs.com/class/lib/model.js~Model.html#static-method-findAll for detail
     * @example
    const {gt, lte, ne, in: opIn} = Sequelize.Op;
    const where = {
            attr0: '123',
            attr1: {
                [gt]: 50
            },
            attr2: {
                [lte]: 45
            },
            attr3: {
                [opIn]: [1,2,3]
            },
            attr4: {
                [ne]: 5
            }
        }
     */
    where: {},
    /**
     * 分页大小
     */
    limit: number,
    /**
     * 分页起始位置
     */
    offset: number
}

export type Transaction = {
    startTransaction: () => Promise<Object>,

    getTransaction: () => Object,

    commit: () => Promise<void>,

    rollback: () => Promise<void>
}

export type ControllerContext = {
    services: ServiceType,
    res: ExpressResponse,
    req: ExpressRequest,
    /**
     * 调用将执行下一个中间件，否则将挂起该次请求
     * @param err 传入该参数，将调用 (err, req, res, next) => void 这一类型的中间件
     * @example
        app.get('/test', (req, res, next) => {
            try {
                const result = await req.services.apiService.searchApis({
                    offset: 0,
                    limit: Number.MAX_SAFE_INTEGER
                })
                const apiRes = new ApiResponse();
                apiRes.setResult(result);
                res.json(apiRes)
            } catch (error) {
                next(error);
            }
        })
     */
    next: (err?: any) => void
}

export type ServiceContext = {
    services: ServiceType,
    transaction: Transaction,
    req: ExpressRequest
}