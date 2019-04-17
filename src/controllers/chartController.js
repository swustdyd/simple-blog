'use strict';

import { routeFurther, controller } from '../utils/decorator'
import BaseController from './baseController'
import ApiResponse from '../models/apiResponse'
import {getCharts, getChartDatas} from '../mock/chart';

@controller()
export default class ChartController extends BaseController {
    @routeFurther({
        path: '/searchCharts',
        name: '搜索统计图',
        description: '搜索统计图',
        params: {
            offset: {
                desc: '分页起始位置',
                exp: 0
            },
            pageSize: {
                desc: '分页大小',
                exp: 10
            },
            name: {
                desc: '报表名称'
            },
            createAt: {
                desc: '报表创建时间 YYYY-MM-DD HH:mm:ss',
                exp: '2018-09-11 14:53:12'
            }
        }
    })
    searchCharts(){
        const { res, next} = this.ctx;
        try {
            const apiRes = new ApiResponse();
            apiRes.setResult({
                list: getCharts
            });
            res.json(apiRes)
        } catch (error) {
            next(error);
        }
    }
    @routeFurther({
        path: '/getChartDatas',
        name: '获取统计图数据',
        description: '获取统计图数据',
        params: {
            sql: {
                desc: '报表对应的脚本名称'
            }
        }
    })
    getChartDatas(){
        const { res, next, req} = this.ctx;
        try {
            const { sql } = req.query;
            const apiRes = new ApiResponse(getChartDatas[sql] ? true : false);
            apiRes.setMessage(getChartDatas[sql] ? '' : '不存在该类型数据');
            apiRes.setResult({
                list: getChartDatas[sql]
            });
            res.json(apiRes)
        } catch (error) {
            next(error);
        }
    }
    @routeFurther({
        path: '/saveOrUpdateChart',
        method: 'post',
        name: '保存或者修改统计图设计',
        description: '保存或者修改统计图设计',
        params: {
            chart: {
                desc: '提交的报表设置数据',
                exp: {
                    name: '报表名称',
                    sql: '报表SQL',
                    script: '报表Script',
                    where: [
                        {
                            type: 'rangePicker',
                            key: 'rangePick',
                            label: '选择时间'
                        },
                        {
                            type: 'select',
                            key: 'groupSelect',
                            label: '选择次集团',
                            datas: [
                                {
                                    value: 1,
                                    label: 'A次集团'
                                },
                                {
                                    value: 2,
                                    label: 'B次集团'
                                },
                                {
                                    value: 3,
                                    label: 'C次集团'
                                }
                            ]
                        }
                    ]
                }
            }
        }
    })
    saveOrUpdateChart(){
        const { req, res, next} = this.ctx;
        try {
            const apiRes = new ApiResponse();
            const { chart } = req.body;
            apiRes.setMessage(chart ? '保存成功' : '保存失败');
            chart.id = 1;
            apiRes.setResult(chart);
            res.json(apiRes)
        } catch (error) {
            next(error);
        }
    }
}
