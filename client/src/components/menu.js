/**
 * Created by Aaron on 2018/3/13.
 */
import React from 'react'
import PropTypes from 'prop-types';
import Tool from '../utils/tool'

class Menu extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            currentKey: this.props.defaultItemKey
        };
    }

    handleItemClick(key){
        this.setState({
            currentKey: key
        })
    }

    render(){
        const {children, withRouter, defaultItemKey} = this.props;
        const {currentKey} = this.state;
        return(
            <div className="menu">
                {children.map((item) => {
                    item.props.currentKey = withRouter ? defaultItemKey : currentKey;
                    item.props.onClick = () => {this.handleItemClick(item.props.itemKey)}
                    return item;
                })}
            </div>
        );
    }
}

Menu.propTypes = {
    defaultItem: PropTypes.string,
    children: PropTypes.element
}

class Item extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
        const {itemKey, currentKey} = this.props;
        const className = `menu-item${itemKey === currentKey ? ' menu-item-active' : ''}`;
        return(
            <span
                className={className}
                onClick={this.props.onClick}
            >
                {this.props.children}
            </span>
        )
    }
}

Item.propTypes = {
    key: PropTypes.string
}

Menu.Item = Item;

export default Menu;