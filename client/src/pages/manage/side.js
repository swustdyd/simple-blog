import React from 'react'

import './side.scss'

export default class Side extends React.Component{
    constructor(){
        super();
        this.state = {
            config: [
                {
                    key: 'articelManage',
                    text: '文章管理',
                    nodes: [
                        {
                            key: 'articleList',
                            text: '文章列表'
                        },
                        {
                            key: 'articleAdd',
                            text: '新增文章'
                        }
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
                        {
                            key: 'userAdd',
                            text: '新增用户'
                        }
                    ]
                }
            ]
        }
    }

    findItem(config, key, cb){
        config.forEach((item) => {
            if(item.key === key){
                item = cb(item);
                return;
            }
            const hasNodes = item.nodes && item.nodes.length > 1;
            if(hasNodes){
                this.findItem(item.nodes, key, cb);
            }
        });
    }

    handleItemClick(item, e){
        const {config} = this.state;
        this.findItem(config, item.key, (item) => {
            item.expand = !item.expand;
            return item;
        })
        this.setState({
            config
        })
        /** 直接操作dom实现动画 */
        // if(this.refs[item.key]){
        //     console.log(this.refs[item.key].className);
        //     if(this.refs[item.key].clientHeight === 0){       
        //         this.refs[item.key].className = 'item-nodes item-nodes-show';                
        //         this.refs[item.key].style.height = '0px';
        //         setTimeout(() => {                    
        //             const height = this.refs[item.key].clientHeight;
        //             this.refs[item.key].style.height = height + 'px';
        //             setTimeout(() => {
        //                 this.refs[item.key].style.height = '';
        //             }, 0)  
        //         }, 0);
        //     }else{  
        //         this.refs[item.key].style.height = '0px';                
        //         setTimeout(() => {
        //             this.refs[item.key].className = 'item-nodes';
        //             this.refs[item.key].style.height = '';
        //         }, 300) 
        //     }
        // }
    }

    getIndent(indent){
        const indents = [];
        for (let i = 0; i < indent; i++) {
            indents.push(<span className="item-text-indent"></span>)          
        }
        return indents;
    }

    renderSide(config = [], indent = 0){
        return config.map((item) => {
            let nodes = '';
            const hasNodes = item.nodes && item.nodes.length > 1;
            if(hasNodes){
                indent++;
                nodes = this.renderSide(item.nodes, indent);
                indent--;
            }
            let itemNodesClass = '',
                itemIconClass = 'item-icon';
            if(hasNodes && !item.expand){
                itemNodesClass += ' item-nodes-hidden';
                itemIconClass += ' item-icon-right'
            }else if(hasNodes && item.expand){
                itemIconClass += ' item-icon-down'
            }
            return (
                <div className="item-container">
                    <div className="item-text-container" onClick={(e) => {this.handleItemClick(item, e)}}>
                        {this.getIndent(indent)}
                        <span className={itemIconClass}></span>
                        <span className="item-text">{item.text}</span>
                    </div>
                    {nodes ? <div ref={item.key} className={`item-nodes${itemNodesClass}`}>{nodes}</div> : ''}
                </div>
            )
        })
    }

    render(){
        const {config} = this.state;
        return (
            <div className="side-container">
                {this.renderSide(config)}
            </div>
        )
    }
}