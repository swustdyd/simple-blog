import React from 'react'
import {Link, Route} from 'react-router-dom'
import {LRLayout}  from '../../layout'
import Side from '../../components/side'
import Content from './content'
import asyncComponent from '../../components/asyncComponent'

const ArticleList = asyncComponent(() => {return import('./article/articleList')})

import './index.scss'

const sideConfig = [
    {
        key: 'articelManage',
        text: '文章管理',
        expand: true,
        nodes: [
            {
                key: 'articleList',
                text: '文章列表',
                render: (text) => {
                    return <Link className="side-link" to="/manage/articleList">{text}</Link>
                }
            },
            // {
            //     key: 'articleAdd',
            //     text: '文章编辑'
            // }
        ]
    },
    {
        key: 'userManage',
        text: '用户管理',
        nodes: [
            {
                key: 'userList',
                text: '用户列表'
            },
            // {
            //     key: 'userAdd',
            //     text: '新增用户'
            // }
        ]
    }
]

export default class IndexPage extends React.Component{
    render(){
        return (
            <LRLayout 
                left={<Side config={sideConfig}/>}
                right={
                    <Content>
                        <Route path="/manage/articleList" component={ArticleList}/>
                    </Content>
                }
            />
        )
    }
}