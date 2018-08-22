import React from 'react'
import {Button} from 'antd'

export default class ArticleList extends React.Component{
    constructor(props){
        super(props);
    }
    render(){
        return (
            <div>
                <Button size="small" type="primary">新增文章</Button>
            </div>
        )
    }
}