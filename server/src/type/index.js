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
    describtion: string
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
    tagId: number
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
     * 分页大小
     */
    pageSize: number,
    /**
     * 结果
     */
    result: any
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