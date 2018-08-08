/**
 * Created by Aaron on 2018/3/26.
 */
import React from 'react'
import {Link, withRouter} from 'react-router-dom'
import Menu from '../components/menu'
import Tool from '../utils/tool'

class Nav extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            defaultItemKey: Tool.getHashPath(0)
        };
    }
    componentDidMount(){
        this.setState({
            defaultItemKey: Tool.getHashPath(0)
        });
    }

    renderItem(config = []){
        const {withRouter} = this.props;
        return config.map((item) => {
            return (
                <Menu.Item itemKey={withRouter ? item.path : item.key}>
                    <Link to={item.path}>{item.text}</Link>
                </Menu.Item>
            )
        })
    }
    render() {        
        const {config, withRouter, location} = this.props;
        const defaultItemKey = withRouter ? location.pathname : config[0].key;
        return (
            <div className="nav">
                <span className="logo">
                    <span className="icon-logo"></span>
                </span>
                <Menu defaultItemKey={defaultItemKey} withRouter={withRouter}>                    
                    {this.renderItem(config)}
                </Menu>
            </div>
        )
    }
}

export default withRouter(Nav)